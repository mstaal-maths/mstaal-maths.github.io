/* 6e — Chapitre 19 : Solides et volumes (cours et fiche d'exercices de M. Staal)
   Assemblages de cubes analysés sur ses dessins (nombre de rangées lu sur les faces de côté). */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c619co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c619ex/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* une vue : liste de carreaux [colonne, ligne depuis le haut] */
function vue(cells, titre, o={}){ const n=Math.max(...cells.map(p=>p[0]))+1, m=Math.max(...cells.map(p=>p[1]))+1, c=o.c||26, pad=3, W=n*c+2*pad, H=m*c+2*pad;
  let s=`<figure><svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${titre}">`;
  cells.forEach(([x,y])=>{ s+=`<rect x="${pad+x*c}" y="${pad+y*c}" width="${c}" height="${c}" style="fill:#cfe0f3;stroke:#222;stroke-width:2"/>`; });
  if(o.nums) o.nums.forEach(([x,y,t])=>{ s+=`<text x="${pad+x*c+c/2}" y="${pad+y*c+c/2+6}" text-anchor="middle" style="font-size:16px;font-weight:700;fill:#222">${t}</text>`; });
  return s+`</svg><figcaption>${titre}</figcaption></figure>`; }
/* vues d'un assemblage donné par les hauteurs h[rangée][colonne] (rangée 0 = devant) */
function vues(h){ const R=h.length, C=h[0].length; const top=[], face=[], droite=[];
  for(let r=0;r<R;r++) for(let c=0;c<C;c++) if(h[r][c]>0) top.push([c, R-1-r]);
  const H=Math.max(...h.flat());
  for(let c=0;c<C;c++){ const m=Math.max(...h.map(row=>row[c])); for(let k=0;k<m;k++) face.push([c, H-1-k]); }
  for(let r=0;r<R;r++){ const m=Math.max(...h[r]); for(let k=0;k<m;k++) droite.push([r, H-1-k]); }
  return {top, face, droite}; }
/* assemblage en perspective : h[rangée][colonne] */
function iso(h, o={}){ const R=h.length, C=h[0].length, s=o.s||30, d=s*0.45, Hm=Math.max(...h.flat());
  const W=C*s+R*d+10, Ht=Hm*s+R*d+10, X=(c,r)=>5+c*s+r*d, Y=(k,r)=>Ht-5-k*s-r*d;
  let out=`<svg class="fig" viewBox="0 0 ${W.toFixed(0)} ${Ht.toFixed(0)}" width="${W.toFixed(0)}" role="img" aria-label="Un assemblage de cubes">`;
  for(let r=R-1;r>=0;r--) for(let c=0;c<C;c++) for(let k=0;k<h[r][c];k++){ const x=X(c,r), y=Y(k,r);
    out+=`<path d="M${x} ${y} h${s} v${-s} h${-s} z" style="fill:#a3c6ea;stroke:#222;stroke-width:1.5"/><path d="M${x} ${y-s} l${d} ${-d} h${s} l${-d} ${d} z" style="fill:#d2e3f5;stroke:#222;stroke-width:1.5"/><path d="M${x+s} ${y} l${d} ${-d} v${-s} l${-d} ${d} z" style="fill:#6fa8dc;stroke:#222;stroke-width:1.5"/>`; }
  return out+"</svg>"; }
/* patron d'un pavé L × l × h : bande de 4 faces (L × l, L × h, L × l, L × h) et deux faces l × h de part et d'autre de la 3e */
function patronPave(L, l, h){ const k=Math.min(16, 300/(L+2*h), 360/(2*l+2*h)), x0=10+h*k, R=(x,y,w,H,t)=>`<rect x="${(x).toFixed(1)}" y="${(y).toFixed(1)}" width="${(w*k).toFixed(1)}" height="${(H*k).toFixed(1)}" style="fill:#fbe3c6;stroke:#222;stroke-width:1.8"/><text x="${(x+w*k/2).toFixed(1)}" y="${(y+H*k/2+4).toFixed(1)}" text-anchor="middle" style="font-size:11px;fill:#222">${t}</text>`;
  const W=20+(L+2*h)*k, H=20+(2*l+2*h)*k; let s=`<svg class="fig" viewBox="0 0 ${W.toFixed(1)} ${H.toFixed(1)}" width="${Math.round(W)}" style="max-width:100%" role="img" aria-label="Un patron du pavé droit de ${L} cm sur ${l} cm sur ${h} cm">`;
  let y=10; [[l,`${L} × ${l}`],[h,`${L} × ${h}`],[l,`${L} × ${l}`],[h,`${L} × ${h}`]].forEach(([hh,t],i)=>{ s+=R(x0,y,L,hh,t); if(i===2){ s+=R(10,y,h,l,`${l}×${h}`)+R(x0+L*k,y,h,l,`${l}×${h}`); } y+=hh*k; });
  return s+"</svg>"; }
window.FIG19 = {vue, vues, iso, patronPave};

/* ---------- figures des corrections ---------- */
const P = {A:[35,745],B:[283,745],C:[283,603],D:[35,603],E:[101,679],F:[349,679],G:[349,537],H:[101,537]};
const pave4 = (()=>{ const k=0.8, f=([x,y])=>[(x-15)*k,(y-515)*k]; const L=(a,b,dash)=>{ const [x1,y1]=f(P[a]),[x2,y2]=f(P[b]); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${dash?"#d0342c":"var(--ink)"};stroke-width:${dash?2.5:2};${dash?"stroke-dasharray:7 5":""}"/>`; };
  let s=`<svg class="fig" viewBox="0 0 300 200" width="300" role="img" aria-label="Le pavé ABCDEFGH avec ses arêtes cachées en pointillés">`;
  [["A","B"],["B","C"],["C","D"],["D","A"],["B","F"],["F","G"],["G","C"],["G","H"],["H","D"]].forEach(([a,b])=>s+=L(a,b));
  [["A","E"],["E","F"],["E","H"]].forEach(([a,b])=>s+=L(a,b,true));
  Object.entries(P).forEach(([n,p])=>{ const [x,y]=f(p); const dx={A:-14,B:4,C:4,D:-14,E:6,F:6,G:4,H:-14}[n], dy={A:14,B:14,C:-4,D:-4,E:-4,F:12,G:-4,H:-4}[n]; s+=`<text x="${x+dx}" y="${y+dy}" style="font-size:13px;font-weight:700;fill:${"AEF".includes(n)&&n!=="F"&&n!=="A"?"#d0342c":"var(--ink)"}">${n}</text>`; });
  return s+"</svg>"; })();
/* exercice 5 : pavés terminés sur quadrillage (32 × 9 carreaux) */
const pers5 = (()=>{ const c=15, W=32*c+8, H=10*c+8, p=(x,y)=>[4+x*c,4+y*c];
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" style="max-width:100%" role="img" aria-label="Les trois pavés droits terminés en perspective cavalière">`;
  for(let i=0;i<=32;i++) s+=`<line x1="${4+i*c}" y1="4" x2="${4+i*c}" y2="${4+10*c}" style="stroke:#d6d6d6"/>`;
  for(let j=0;j<=10;j++) s+=`<line x1="4" y1="${4+j*c}" x2="${4+32*c}" y2="${4+j*c}" style="stroke:#d6d6d6"/>`;
  const seg=(a,b,dash)=>{ const [x1,y1]=p(...a),[x2,y2]=p(...b); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" style="stroke:${dash?"#d0342c":"#222"};stroke-width:2.2;${dash?"stroke-dasharray:5 4":""}"/>`; };
  const box=(x0,y0,w,h,dx,dy)=>{ const A=[x0,y0+h],B=[x0+w,y0+h],C=[x0+w,y0],D=[x0,y0],E=[x0+dx,y0+h+dy],F=[x0+w+dx,y0+h+dy],G=[x0+w+dx,y0+dy],Hh=[x0+dx,y0+dy];
    return [ [A,B],[B,C],[C,D],[D,A],[D,Hh],[Hh,G],[G,C],[G,F],[F,B] ].map(([a,b])=>seg(a,b)).join("") + [[A,E],[E,F],[E,Hh]].map(([a,b])=>seg(a,b,true)).join(""); };
  s += box(2,5,6,4,2,-2) + box(16,5,4,4,2,-2) + box(24,3,3,5,3,-3);
  [["a)",5,9.9],["b) un cube",18,9.9],["c)",25.5,9.9]].forEach(([t,x,y])=>{ s+=`<text x="${4+x*c}" y="${4+y*c-2}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#222">${t}</text>`; });
  return s+"</svg>"; })();
/* patron du dé complété */
const de7 = vue([[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]], "Le patron du dé complété", {c:38, nums:[[1,0,"6"],[0,1,"2"],[1,1,"3"],[2,1,"5"],[1,2,"1"],[1,3,"4"]]});

/* ---------- schémas ---------- */
const S_SOL = sch("Les solides usuels", co("solides","Cube, pavé droit, prisme droit, pyramide ; cylindre, cône, boule",440));
const S_PAVE = sch("Faces, arêtes, sommets", co("pave","Le pavé ABCDEFGH : face, arête, sommet",260)+`<p class="schN">Pavé droit et cube : 6 faces, 12 arêtes, 8 sommets.</p>`);
const S_PAT = sch("Le patron", co("patron","Un patron du cube et un patron du pavé droit",400)+`<p class="schN">Une figure plane qui, pliée, donne le solide sans que deux faces se superposent. Le cube a 11 patrons.</p>`);
const S_VOL = sch("Le volume", co("volume","1 cm³ ; un pavé de 2 couches de 12 cubes",400)+`<p class="schN">On compte les cubes de 1 cm³, couche par couche : 2 × (4 × 3) = 24 cm³.</p>`);
const S_VUES = sch("Les vues", co("vues","Un assemblage et ses vues de dessus, de face et de droite",440));

CH["6e-19"] = {
intro:"Les solides usuels et le vocabulaire des polyèdres, la perspective cavalière, les patrons de cube et de pavé, le volume en cm³ et les vues d'un assemblage de cubes.",
savoir:[
  "reconnaître et nommer les solides usuels, et décrire un polyèdre (faces, arêtes, sommets) ;",
  "lire et compléter une représentation en perspective cavalière ;",
  "reconnaître et construire un patron de cube ou de pavé droit ;",
  "déterminer un volume en cm³ en comptant des cubes unités ;",
  "passer d'un assemblage de cubes à ses vues (de dessus, de face, de côté) et inversement."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Les solides usuels", h:`
  ${co("solides","Des polyèdres : cube, pavé droit, prisme droit, pyramide. Des solides qui ne sont pas des polyèdres : cylindre, cône, boule",490)}
  <h4>Le vocabulaire d'un polyèdre</h4>
  <div class="cpt"><div class="retenir" data-l="Vocabulaire"><p>Un <b>polyèdre</b> est délimité par des <b>faces</b> (des polygones).</p><p>Deux faces se rencontrent sur une <b>arête</b> (un segment).</p><p>Les arêtes se rencontrent en des <b>sommets</b> (des points).</p></div>${co("pave","Le pavé droit ABCDEFGH : une face, une arête, un sommet",250)}</div>
  <p>Le <b>pavé droit</b> a 6 faces rectangulaires, 12 arêtes et 8 sommets. Ses faces opposées sont identiques.</p>
  <p>Le <b>cube</b> est un pavé droit dont les 6 faces sont des carrés identiques : toutes ses arêtes ont la même longueur.</p>`},
{k:"II", t:"Représenter un solide", h:`
  <h4>1. La perspective cavalière</h4>
  <p>Pour représenter un solide sur une feuille, on utilise la <b>perspective cavalière</b> :</p>
  <div class="retenir" data-l="Règles"><ol><li>la face avant est dessinée en vraie grandeur ;</li><li>les arêtes parallèles dans la réalité restent parallèles sur le dessin ;</li><li>les arêtes « fuyantes » (vers l'arrière) sont tracées en oblique et plus courtes ;</li><li>les arêtes cachées sont tracées en pointillés.</li></ol></div>
  <p><b>Remarque :</b> sur le pavé ABCDEFGH ci-dessus, la face ABCD est en vraie grandeur et les arêtes [AE], [EF] et [EH] sont cachées.</p>
  <h4>2. Le patron</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>patron</b> d'un solide est une figure plane qui, après pliage, permet de fabriquer ce solide, sans que deux faces se superposent.</p></div>
  ${co("patron","Un patron du cube ; un patron du pavé droit de 4 cm, 3 cm et 2 cm",480)}
  <div class="anim" data-anim="6e19-patron-pave"></div>
  <p><b>Remarque :</b> un même solide peut avoir plusieurs patrons. Le cube en a 11 différents.</p>`},
{k:"III", t:"Volume d'un solide", h:`
  <div class="retenir" data-l="Définition"><p>Le <b>volume</b> d'un solide est la mesure de l'espace qu'il occupe. <b>1 cm³</b> (« un centimètre cube ») est le volume d'un cube de 1 cm d'arête.</p></div>
  ${co("volume","Un cube de 1 cm³ ; un pavé de 2 couches de 4 × 3 = 12 cubes",470)}
  <div class="retenir" data-l="Méthode"><ol><li>On compte le nombre de cubes de 1 cm³ qui remplissent le solide, sans oublier les cubes cachés ;</li><li>pour un pavé droit, on peut compter les cubes d'une couche, puis multiplier par le nombre de couches.</li></ol></div>
  <p><b>Exemple :</b> le pavé ci-dessus a 2 couches de 4 × 3 = 12 cubes : il contient 2 × 12 = 24 cubes, son volume est 24 cm³.</p>
  <p><b>Remarque :</b> deux solides de formes différentes peuvent avoir le même volume.</p>`},
{k:"IV", t:"Voir dans l'espace", h:`
  <p>Pour décrire un assemblage de cubes, on peut dessiner ce qu'on voit en le regardant <b>de dessus</b>, <b>de face</b> ou <b>de côté</b>. Chaque vue est une figure plane formée de carrés.</p>
  ${co("vues","Un assemblage de cubes et ses vues de dessus, de face et de droite",490)}
  <p class="attention"><b>ATTENTION :</b> une vue ne montre pas la profondeur : un cube caché derrière un autre n'apparaît pas. Il faut souvent plusieurs vues pour connaître l'assemblage.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Les solides usuels", e:[
  {n:"Activité 1", t:"Le tri des solides", w:"Sur ton cahier", h:`${ex("act1","Huit solides numérotés de 1 à 8",490)}<p>1) Écris le nom de chaque solide sur ton cahier.</p><p>2) Classe-les en deux groupes : les polyèdres et les autres. Explique ton choix.</p>`,
   c:`<p>1) ① cube · ② cylindre · ③ pyramide à base carrée · ④ boule · ⑤ prisme droit à base triangulaire · ⑥ pavé droit · ⑦ cône · ⑧ pyramide à base triangulaire</p><p>2) <b>Polyèdres</b> (toutes leurs faces sont des polygones) : ①, ③, ⑤, ⑥, ⑧. <b>Les autres</b> (ils ont une surface courbe) : ②, ④, ⑦.</p>`},
  {n:"Exercice 1", t:"Des objets et des solides", w:"Sur ta feuille", h:`<p>À quel solide te fait penser chaque objet ?</p><p>a) Une boîte à chaussures · b) Un dé à jouer · c) Une boîte de conserve · d) Un ballon de football · e) Un cornet de glace · f) Une tente canadienne · g) La pyramide du Louvre · h) Un morceau de sucre</p>`,
   c:`<p>a) pavé droit · b) cube · c) cylindre · d) boule · e) cône · f) prisme droit (à base triangulaire) · g) pyramide (à base carrée) · h) cube (ou pavé droit)</p>`},
  {n:"Exercice 2", t:"Faces, arêtes et sommets", w:"Sur ta feuille", h:`<p>Aide-toi des solides de l'activité 1 pour compléter le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Solide</th><th>Faces</th><th>Arêtes</th><th>Sommets</th></tr></thead><tbody><tr><td>Cube</td><td></td><td></td><td></td></tr><tr><td>Pavé droit</td><td></td><td></td><td></td></tr><tr><td>Prisme droit à base triangulaire</td><td></td><td></td><td></td></tr><tr><td>Pyramide à base carrée</td><td></td><td></td><td></td></tr></tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Solide</th><th>Faces</th><th>Arêtes</th><th>Sommets</th></tr></thead><tbody><tr><td>Cube</td><td>6</td><td>12</td><td>8</td></tr><tr><td>Pavé droit</td><td>6</td><td>12</td><td>8</td></tr><tr><td>Prisme droit à base triangulaire</td><td>5</td><td>9</td><td>6</td></tr><tr><td>Pyramide à base carrée</td><td>5</td><td>8</td><td>5</td></tr></tbody></table></div>`},
  {n:"Exercice 3", t:"Vrai ou faux ?", w:"Sur ta feuille", h:`<p>a) Un cube est un pavé droit. · b) Toutes les faces d'un pavé droit sont des carrés. · c) Un cylindre est un polyèdre. · d) Une pyramide à base carrée a 5 faces. · e) Un cube a 12 arêtes de même longueur.</p>`,
   c:`<p>a) <b>Vrai</b> (un pavé droit particulier). · b) <b>Faux</b> : ce sont des rectangles (des carrés seulement pour un cube). · c) <b>Faux</b> : il a une surface courbe. · d) <b>Vrai</b> : 4 triangles et 1 carré. · e) <b>Vrai</b> : ses 6 faces sont des carrés identiques, donc ses 12 arêtes ont la même longueur.</p>`}
 ]},
{t:"Représenter un solide", e:[
  {n:"Exercice 4", t:"Les arêtes cachées", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Voici un pavé droit ABCDEFGH dessiné sans ses arêtes cachées.</p><p>a) Complète le dessin en traçant les arêtes cachées en pointillés.</p><p>b) Quelles faces sont en vraie grandeur ?</p><p>c) Cite trois arêtes de même longueur que [AB].</p><p>d) Quelle face est opposée à la face BCGF ?</p></div>${ex("e4","Le pavé ABCDEFGH sans ses arêtes cachées",300)}</div>`,
   c:`<div class="cpt"><div><p>a) Les arêtes cachées sont [AE], [EF] et [EH] (en pointillés).</p><p>b) La face avant <b>ABCD</b> et la face arrière <b>EFGH</b>.</p><p>c) <b>[DC], [EF] et [HG]</b>.</p><p>d) La face <b>ADHE</b>.</p></div>${pave4}</div>`},
  {n:"Exercice 5", t:"Compléter la perspective", w:"Sur ta feuille", h:`<p>Termine le dessin de chaque pavé droit en perspective cavalière (b est un cube). N'oublie pas les arêtes cachées en pointillés.</p>${ex("e5","Trois débuts de pavés sur quadrillage",490)}`,
   c:`${pers5}<p>Les arêtes fuyantes sont toutes parallèles et de même longueur que celle déjà tracée ; les arêtes cachées (en rouge) sont en pointillés.</p>`}
 ]},
{t:"Patrons", e:[
  {n:"Exercice 6", t:"Patrons de cube ?", w:"Sur ta feuille", h:`<p>Parmi ces figures, lesquelles sont des patrons de cube ? Tu peux les reproduire sur ton cahier et les découper pour vérifier.</p>${ex("e6","Six figures de six carrés, a) à f)",490)}`,
   c:`<p>Les patrons de cube sont <b>a), c) et f)</b>.</p><p>b) Non : les deux carrés du haut se plieraient sur la même face. · d) Non : deux carrés deviennent le dessus et il manque une face. · e) Non : avec 5 carrés en ligne, le premier et le dernier se superposent.</p>`},
  {n:"Exercice 7", t:"Le patron du dé", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Sur un dé, la somme des nombres de deux faces opposées est toujours égale à 7. Complète ce patron de dé avec les nombres 4, 5 et 6.</p><p><b>Aide :</b> imagine le pliage. Quelle face sera opposée à la face 1 ?</p></div>${ex("e7","Patron de dé avec 2, 3 et 1",240)}</div>`,
   c:`<div class="cpt"><div><p>Dans la colonne de 4 carrés, deux carrés séparés par un carré sont opposés : le carré du haut est opposé au 1, il porte <b>6</b> ; le carré du bas est opposé au 3, il porte <b>4</b>.</p><p>Les deux carrés de côté sont opposés : en face du 2, on écrit <b>5</b>.</p></div><div class="figs">${de7}</div></div>`},
  {n:"Exercice 8", t:"Construire un patron", w:"Sur ton cahier", h:`<p>Construis en vraie grandeur un patron d'un pavé droit de longueur 5 cm, de largeur 3 cm et de hauteur 2 cm. Découpe-le et plie-le pour vérifier.</p>`,
   c:(()=>{ const k=14, R=(x,y,w,h)=>`<rect x="${10+x*k}" y="${10+y*k}" width="${w*k}" height="${h*k}" style="fill:#fbe3c6;stroke:#222;stroke-width:1.8"/>`; let s=`<svg class="fig" viewBox="0 0 ${20+12*k} ${20+10*k}" width="${20+12*k}" role="img" aria-label="Un patron du pavé de 5 cm sur 3 cm sur 2 cm">`;
     s+=R(2,0,5,3)+R(2,3,5,2)+R(2,5,5,3)+R(2,8,5,2)+R(0,5,2,3)+R(7,5,2,3); s+=`<text x="${10+4.5*k}" y="${10+1.7*k}" text-anchor="middle" style="font-size:12px">5 × 3</text><text x="${10+4.5*k}" y="${10+4.3*k}" text-anchor="middle" style="font-size:12px">5 × 2</text><text x="${10+4.5*k}" y="${10+6.7*k}" text-anchor="middle" style="font-size:12px">5 × 3</text><text x="${10+4.5*k}" y="${10+9.3*k}" text-anchor="middle" style="font-size:12px">5 × 2</text><text x="${10+1*k}" y="${10+6.7*k}" text-anchor="middle" style="font-size:11px">3×2</text><text x="${10+8*k}" y="${10+6.7*k}" text-anchor="middle" style="font-size:11px">3×2</text>`;
     return `<p>Par exemple (figure réduite) : une bande de 4 rectangles (5 × 3, 5 × 2, 5 × 3, 5 × 2), et deux rectangles de 3 cm sur 2 cm sur les côtés.</p>${s}</svg><p>Les faces opposées sont identiques : 2 faces de 5 × 3, 2 faces de 5 × 2 et 2 faces de 3 × 2.</p>`; })()}
 ]},
{t:"Volumes", e:[
  {n:"Exercice 9", t:"Compter les cubes", w:"Sur ta feuille", h:`<p>Chaque petit cube a un volume de 1 cm³. Les assemblages sont pleins : les cubes cachés qui soutiennent les autres sont présents. Donne le volume de chaque assemblage.</p>${ex("e9","Quatre assemblages de cubes a) à d)",490)}`,
   c:`<p>On lit la profondeur sur les faces de côté (une ou deux rangées).</p><p>a) Couche du bas : 4 × 2 = 8 cubes (deux rangées) ; en haut : 2 cubes. <b>10 cm³</b>.</p><p>b) Devant : une colonne de 3 cubes et 2 cubes au sol ; derrière la colonne : une colonne de 2 cubes. <b>7 cm³</b>.</p><p>c) Deux couches de 3 × 2 = 6 cubes, et 2 cubes au sommet (l'un derrière l'autre). 6 + 6 + 2 = <b>14 cm³</b>.</p><p>d) Au sol : 3 cubes devant, et 2 cubes l'un derrière l'autre derrière celui du milieu ; au 2<sup>e</sup> étage : 2 cubes au milieu. 3 + 2 + 2 = <b>7 cm³</b>.</p>`},
  {n:"Exercice 10", t:"Couche par couche", w:"Sur ta feuille", h:`<p>Un pavé droit est construit avec des cubes de 1 cm³. Il mesure 5 cubes de long, 3 cubes de large et 2 cubes de haut.</p><p>a) Combien de cubes y a-t-il dans une couche ? b) Combien y a-t-il de couches ? c) Quel est le volume de ce pavé ?</p>`,
   c:`<p>a) 5 × 3 = <b>15 cubes</b>.</p><p>b) Le pavé a 2 cubes de haut : <b>2 couches</b>.</p><p>c) 2 × 15 = 30 cubes : <b>30 cm³</b>.</p>${iso([[2,2,2,2,2],[2,2,2,2,2],[2,2,2,2,2]],{s:26})}`},
  {n:"Exercice 11", t:"Combien en manque-t-il ?", w:"Sur ta feuille", h:`<div class="cpt"><div><p>On voulait construire un grand cube de 3 cubes de côté, mais on a enlevé quelques cubes, uniquement sur la couche du dessus.</p><p>a) Combien de cubes faut-il pour un grand cube complet ? b) Combien de cubes manque-t-il ? c) Quel est le volume de l'assemblage dessiné ?</p></div>${ex("e11","Un grand cube auquel il manque des cubes sur le dessus",170)}</div>`,
   c:`<p>a) 3 × 3 × 3 = <b>27 cubes</b>.</p><p>b) Sur la couche du dessus, il reste 5 cubes (devant à gauche, au milieu à gauche, au centre, et derrière au milieu et à droite) : il en manque 9 − 5 = <b>4</b>.</p><p>c) 27 − 4 = <b>23 cm³</b>.</p>`},
  {n:"Exercice 12", t:"Remplir une boîte", w:"Sur ta feuille", h:`<p>Une boîte en forme de pavé droit mesure 6 cm de long, 4 cm de large et 3 cm de haut. Combien de cubes de 1 cm³ peut-on y ranger ? Quel est le volume de la boîte ?</p>`,
   c:`<p>Une couche : 6 × 4 = 24 cubes. 3 couches : 3 × 24 = <b>72 cubes</b>. Le volume de la boîte est <b>72 cm³</b>.</p>`}
 ]},
{t:"Voir dans l'espace", e:[
  {n:"Activité 2", t:"Ateliers tournants (avec des cubes emboîtables)", w:"En classe", h:`<p>Par groupes, passez d'un atelier à l'autre (environ 10 minutes par atelier).</p><p><b>Atelier 1 — Reproduire :</b> construisez l'assemblage dessiné sur la carte, puis comptez ses cubes.</p><p><b>Atelier 2 — Dessiner les vues :</b> pour l'assemblage posé sur la table, dessinez sur papier quadrillé ses vues de dessus, de face et de droite.</p><p><b>Atelier 3 — Construire à partir des vues :</b> à partir des trois vues données sur la carte, construisez l'assemblage.</p><p><b>Atelier 4 — Défi :</b> avec 4 cubes, construisez le plus possible d'assemblages différents. Dessinez la vue de dessus de chacun.</p>`,
   c:`<p>Les réponses dépendent des cartes données en classe.</p><p><b>Atelier 4 :</b> à plat, on trouve 5 formes de 4 cubes (le carré, la barre, le L, le T et le S) ; en empilant des cubes, on en trouve d'autres (par exemple 3 cubes au sol et 1 cube posé dessus).</p>${["[[0,0],[1,0],[0,1],[1,1]]","[[0,0],[1,0],[2,0],[3,0]]","[[0,0],[0,1],[0,2],[1,2]]","[[0,0],[1,0],[2,0],[1,1]]","[[1,0],[2,0],[0,1],[1,1]]"].map(t=>vue(JSON.parse(t),"",{c:18})).join("").replace(/<figure>/g,'<figure style="display:inline-block;margin:0 10px">')}`},
  {n:"Exercice 13", t:"La vue de dessus cotée", w:"Sur ta feuille", h:`<div class="cpt"><div><p>Voici la vue de dessus d'un assemblage. Le nombre écrit dans chaque case indique combien de cubes sont empilés à cet endroit.</p><p>a) Combien de cubes compte cet assemblage ? b) Quel est son volume si chaque cube mesure 1 cm³ ? c) Sur ton cahier, dessine sa vue de face.</p></div>${ex("e13","Vue de dessus cotée",230)}</div>`,
   c:`<p>a) On additionne les nombres des cases : 1 + 2 + 1 + 2 + 3 + 2 + 1 = <b>12 cubes</b>.</p><p>b) 12 cubes de 1 cm³ : <b>12 cm³</b>.</p><p>c) De face, on voit pour chaque colonne la plus grande hauteur : 3 à gauche, 2 au milieu, 2 à droite.</p><div class="figs">${vue([[0,0],[0,1],[0,2],[1,1],[1,2],[2,1],[2,2]],"Vue de face")}</div>`},
  {n:"Exercice 14", t:"Quelle vue ?", w:"Sur ta feuille", h:`<p>Pour cet assemblage, retrouve la vue de dessus, la vue de face et la vue de droite. Une des figures est un intrus.</p>${ex("e14","Un assemblage en escalier et quatre vues numérotées",490)}`,
   c:`<p>Vue de dessus : <b>②</b> (3 cubes devant, et 1 cube derrière la colonne de gauche) · Vue de face : <b>①</b> (l'escalier 3, 2, 1) · Vue de droite : <b>③</b> (devant 3 cubes de haut, derrière 2) · L'intrus : <b>④</b>.</p>`},
  {n:"Exercice 15", t:"Dessiner les vues", w:"Sur ta feuille", h:`<p>Dessine les vues de dessus, de face et de droite de cet assemblage.</p>${ex("e15","Un assemblage de cubes et trois quadrillages vides",490)}`,
   c:(()=>{ const V=vues([[2,1,1],[1,0,3]]); return `<p>Devant : 2 cubes à gauche, 1 au milieu, 1 à droite. Derrière : 1 cube à gauche et une colonne de 3 cubes à droite. (8 cubes en tout.)</p><div class="figs">${vue(V.top,"Vue de dessus")}${vue(V.face,"Vue de face")}${vue(V.droite,"Vue de droite")}</div><p><i>Vue de droite : le devant de l'assemblage est à gauche, l'arrière à droite.</i></p>`; })()},
  {n:"En ++", t:"Le cube peint", w:"Sur ta feuille", h:`<div class="cpt"><div><p>On peint en orange l'extérieur de ce grand cube formé de 27 petits cubes, puis on le démonte.</p><p>Combien de petits cubes ont 3 faces peintes ? 2 faces peintes ? 1 seule face peinte ? Aucune face peinte ?</p></div>${ex("epp","Un grand cube orange de 3 × 3 × 3",150)}</div>`,
   c:`<p><b>3 faces peintes :</b> les 8 cubes des coins. <b>2 faces :</b> les cubes au milieu des 12 arêtes, soit <b>12</b>. <b>1 face :</b> le cube au centre de chacune des 6 faces, soit <b>6</b>. <b>Aucune :</b> le cube tout au centre, soit <b>1</b>.</p><p>Vérification : 8 + 12 + 6 + 1 = 27.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Les solides", schema:S_SOL, q:{
 1:[ {g:()=>{ const p=pick([["Une boîte de conserve","un cylindre"],["Un dé à jouer","un cube"],["Un ballon","une boule"],["Un cornet de glace","un cône"],["Une boîte à chaussures","un pavé droit"]]); return {q:`${p[0]} fait penser à…`, c:shuf(uniq(p[1],["un cylindre","un cube","une boule","un cône","un pavé droit"]).slice(0,3)), rep:p[1], sx:S_SOL}; }} ],
 2:[ {q:"Lequel de ces solides n'est pas un polyèdre ?", c:["le cylindre","le cube","la pyramide"], rep:"le cylindre", ex:"Il a une surface courbe.", sx:S_SOL},
     {g:()=>{ const p=pick([["arêtes","12"],["sommets","8"],["faces","6"]]); return {q:`Combien un pavé droit a-t-il ${p[0]==="arêtes"?"d'":"de "}${p[0]} ?`, rep:p[1], sx:S_PAVE}; }} ],
 3:[ {g:()=>{ const p=pick([["faces","pyramide à base carrée","5"],["sommets","pyramide à base carrée","5"],["arêtes","pyramide à base carrée","8"],["faces","prisme droit à base triangulaire","5"],["arêtes","prisme droit à base triangulaire","9"],["sommets","prisme droit à base triangulaire","6"]]); return {q:`Combien ${p[0]==="arêtes"?"d'":"de "}${p[0]} a une ${p[1]} ?`.replace("a une prisme","a un prisme"), rep:p[2], sx:S_SOL}; }} ]
}},
{nom:"Perspective et patrons", schema:S_PAT, q:{
 1:[ {q:"En perspective cavalière, les arêtes cachées sont tracées…", c:["en pointillés","en couleur","en gras"], rep:"en pointillés", sx:S_PAVE},
     {q:"Combien de faces a le patron d'un cube ?", c:["6","4","8"], rep:"6", sx:S_PAT} ],
 2:[ {q:"Combien de patrons différents a un cube ?", c:["11","6","1"], rep:"11", sx:S_PAT},
     {q:"En perspective cavalière, quelle face est dessinée en vraie grandeur ?", c:["la face avant","la face du dessus","la face de droite"], rep:"la face avant", sx:S_PAVE} ],
 3:[ {q:"Sur un dé, la face 2 est opposée à la face…", c:["5","4","6"], rep:"5", ex:"La somme de deux faces opposées vaut 7.", sx:S_PAT},
     {q:"Six carrés alignés forment-ils un patron de cube ?", c:["Non","Oui"], rep:"Non", sx:S_PAT} ]
}},
{nom:"Volumes", schema:S_VOL, q:{
 1:[ {g:()=>{ const L=ri(2,6), l=ri(2,5); return {q:`Une couche de ${L} cubes sur ${l} cubes contient combien de cubes ?`, rep:String(L*l), sx:S_VOL}; }} ],
 2:[ {g:()=>{ const L=ri(2,6), l=ri(2,5), h=ri(2,4); return {q:`Volume d'un pavé de ${L} cubes de long, ${l} de large et ${h} de haut (cubes de 1 cm³), en cm³ ?`, rep:String(L*l*h), ex:`${h} couches de ${L*l} cubes.`, sx:S_VOL}; }},
     {g:()=>{ const h=[[ri(1,3),ri(0,2),ri(1,2)]]; if(h[0][1]===0) h[0][1]=1; return {q:"Combien de cubes compte cet assemblage (une seule rangée) ?", fig:iso(h,{s:28}), rep:String(h[0].reduce((s,x)=>s+x,0)), sx:S_VOL}; }} ],
 3:[ {g:()=>{ const n=ri(2,4); return {q:`Un grand cube a ${n} petits cubes de côté. Combien de petits cubes contient-il ?`, rep:String(n**3), ex:`${n} × ${n} × ${n} = ${n**3}.`, sx:S_VOL}; }} ]
}},
{nom:"Les vues", schema:S_VUES, q:{
 1:[ {q:"Une vue montre-t-elle les cubes cachés derrière d'autres ?", c:["Non","Oui"], rep:"Non", sx:S_VUES} ],
 2:[ {g:()=>{ const h=[[ri(1,3),ri(1,3),ri(1,3)]]; const f=vues(h).face; return {q:"Combien de carrés compte la vue de face de cet assemblage ?", fig:iso(h,{s:28}), rep:String(f.length), sx:S_VUES}; }} ],
 3:[ {g:()=>{ const t=[[ri(1,3),ri(1,3)],[ri(1,3),ri(1,3)]]; const tot=t.flat().reduce((s,x)=>s+x,0); return {q:`Une vue de dessus cotée indique les hauteurs ${t[1].join(" et ")} (derrière) et ${t[0].join(" et ")} (devant). Combien de cubes ?`, rep:String(tot), ex:`On additionne les hauteurs : ${t.flat().join(" + ")} = ${tot}.`, sx:S_VUES}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
/* quatre solides dessinés en perspective (arêtes cachées en pointillés) */
const ST = "fill:none;stroke:var(--ink);stroke-width:2", DS = "fill:none;stroke:var(--ink);stroke-width:1.6;stroke-dasharray:5 4";
const box = (n, inner, alt) => `<figure style="margin:0 6px"><svg class="fig" viewBox="0 0 110 112" width="110" role="img" aria-label="${alt}">${inner}</svg><figcaption>${n}</figcaption></figure>`;
const CONE = `<path d="M15 92 A40 12 0 0 0 95 92" style="${ST}"/><path d="M15 92 A40 12 0 0 1 95 92" style="${DS}"/><path d="M15 92 L55 8 L95 92" style="${ST}"/><path d="M15 92 A40 12 0 0 0 95 92 L55 8 Z" style="fill:#d2e3f5;stroke:none;opacity:.6"/>`;
const PRISME = `<path d="M8 100 L68 100 L38 50 Z M38 50 L68 28 L98 78 L68 100 M68 28 L38 50" style="${ST};fill:#d2e3f5"/><path d="M8 100 L38 78 L98 78 M38 78 L68 28" style="${DS}"/>`;
const CUBE = `<path d="M8 100 H68 V40 H8 Z" style="${ST};fill:#d2e3f5"/><path d="M8 40 L33 15 H93 V75 L68 100 M68 40 L93 15" style="${ST}"/><path d="M8 100 L33 75 H93 M33 75 V15" style="${DS}"/>`;
const BOULE = `<circle cx="55" cy="55" r="42" style="${ST};fill:#d2e3f5"/><path d="M13 55 A42 11 0 0 0 97 55" style="${ST}"/><path d="M13 55 A42 11 0 0 1 97 55" style="${DS}"/>`;
const SOLIDES = (L) => `<div class="figs">${L.map(([n,s,a])=>box(n,s,a)).join("")}</div>`;
const S4 = SOLIDES([["①",CONE,"Solide ① : un cône"],["②",PRISME,"Solide ② : un prisme droit à base triangulaire"],["③",BOULE,"Solide ③ : une boule"],["④",CUBE,"Solide ④ : un cube"]]);
const NOMS = `<p>① un <b>cône</b> · ② un <b>prisme droit</b> (à base triangulaire) · ③ une <b>boule</b> · ④ un <b>cube</b></p>`;
const fv = (cells, n, alt) => vue(cells, n).replace(`aria-label="${n}"`, `aria-label="${alt}"`);
const PAT = (L) => `<div class="figs">${L.map(([n,cells])=>fv(cells, n, "Figure "+n+" : six carrés")).join("")}</div>`;
const souv = t => `<div class="retenir" data-l="Je me souviens"><p>${t}</p></div>`;
const NETS = {a:[[0,1],[1,1],[2,1],[3,1],[1,0],[2,2]], b:[[0,0],[1,0],[2,0],[2,1],[3,1],[4,1]], c:[[0,0],[1,0],[2,0],[3,0],[0,1],[3,1]], d:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]]};
const NETSB = {a:[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]], b:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0]], c:[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1]], d:[[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]]};
const VOL = [[[1,1,1,1],[2,2,1,1]], [[2,1,1],[2,2,1]], [[2,2,2],[2,3,2]]];
const VOLB = [[[3,1,2]], [[1,1,1],[1,1,1]], [[2,2,2],[2,2,2]]];
const ISOS = L => `<div class="figs">${L.map((h,i)=>`<figure style="margin:0 8px">${iso(h,{s:32})}<figcaption>${"abc"[i]})</figcaption></figure>`).join("")}</div>`;
const A4 = [[1,1,2],[1,0,0]], V4 = vues(A4), T4 = [[0,1],[1,1],[2,1],[1,0]];
const A4B = [[1,2,1]], V4B = vues(A4B), T4B = [[0,1],[1,1],[2,1],[0,0]];
return {
titre:"Évaluation d'entraînement — Chapitre 19", duree:25, info:"Durée : 25 min · Crayon et règle · Calculatrice non autorisée",
comp:[
  ["COMMUNIQUER","Je reconnais et je nomme les solides usuels ; je décris un pavé droit (faces, arêtes, sommets).","Ex. 1 (3 points)"],
  ["CALCULER","Je trouve le volume d'un assemblage en comptant les cubes de 1 cm³.","Ex. 2 (3 points)"],
  ["REPRÉSENTER","Je reconnais les vues d'un assemblage de cubes.","Ex. 3 (2 points)"],
  ["REPRÉSENTER","Je reconnais les patrons d'un cube.","Ex. 4 (2 points)"]
],
exos:[
{t:"Quel est ce solide ?", p:3, h:`<p>a) Donne le nom de chacun de ces solides.</p>${S4}
  <p>b) Recopie chaque phrase et écris « vrai » ou « faux ».</p><p>1) Un pavé droit a 8 sommets.</p><p>2) Toutes les faces d'un pavé droit sont des carrés.</p><p>3) Un pavé droit a 6 arêtes.</p><p>4) Deux faces opposées d'un pavé droit sont identiques.</p>`,
 c:`<p>a)</p>${NOMS}<p><i>(0,5 point par nom)</i></p>
  <p>b) 1) <b>Vrai</b>. · 2) <b>Faux</b> : ce sont des rectangles (des carrés seulement pour un cube). · 3) <b>Faux</b> : il a 12 arêtes (et 6 faces). · 4) <b>Vrai</b>. <i>(0,25 point par réponse)</i></p>`},
{t:"Combien de cubes ?", p:3, h:`<p>Chaque petit cube a un volume de 1 cm³. Les assemblages sont pleins : les cubes cachés qui soutiennent les autres sont bien là.</p><p>Quel est le volume de chaque assemblage ?</p>${ISOS(VOL)}`,
 c:`<p>On regarde le côté droit pour savoir combien il y a de rangées (ici, deux rangées pour chaque assemblage).</p>
  <p>a) Devant : 4 cubes. Derrière : 2 colonnes de 2 cubes et 2 cubes seuls, soit 2 + 2 + 1 + 1 = 6 cubes. 4 + 6 = 10 cubes : <b>10 cm³</b>. <i>(1 point)</i></p>
  <p>b) Devant : 2 + 1 + 1 = 4 cubes. Derrière : 2 + 2 + 1 = 5 cubes. 4 + 5 = 9 cubes : <b>9 cm³</b>. <i>(1 point)</i></p>
  <p>c) Deux couches de 3 × 2 = 6 cubes, et 1 cube posé dessus : 6 + 6 + 1 = 13 cubes : <b>13 cm³</b>. <i>(1 point)</i></p>`},
{t:"De dessus, de face", p:2, h:`<div class="cpt"><div><p>Voici un assemblage de cubes. On le regarde de devant (de face) et d'en haut (de dessus).</p>
  <p>a) Laquelle des figures ①, ② et ③ est la vue de dessus ?</p><p>b) Laquelle est la vue de face ?</p></div>${iso(A4,{s:34})}</div><div class="figs">${fv(V4.face,"①","Figure ①")}${fv(T4,"②","Figure ②")}${fv(V4.top,"③","Figure ③")}</div>`,
 c:`<p>a) La vue de dessus est la figure <b>③</b> : on voit 3 carrés pour la rangée de devant, et 1 carré derrière, à gauche. <i>(1 point)</i></p>
  <p>b) La vue de face est la figure <b>①</b> : de devant, on voit une colonne de 1 cube, une colonne de 1 cube, puis une colonne de 2 cubes à droite. Le cube de derrière est caché. <i>(1 point)</i></p>
  <p>La figure ② ne correspond à aucune des deux vues.</p>`},
{t:"Patrons de cube", p:2, h:`<p>Parmi ces figures, lesquelles sont des patrons de cube ?</p>${PAT([["a)",NETS.a],["b)",NETS.b],["c)",NETS.c],["d)",NETS.d]])}`,
 c:`<p>Les patrons de cube sont <b>a) et b)</b>. <i>(0,5 point par figure bien classée)</i></p>
  <p>c) n'en est pas un : les deux carrés du bas se plieraient tous les deux sur la même face. · d) n'en est pas un : un rectangle de 2 carrés sur 3 ne se referme pas en cube.</p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 19 · version aménagée", duree:25, info:"Version aménagée (tiers-temps) · Durée : 25 min · Crayon et règle · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["COMMUNIQUER","Je reconnais et je nomme les solides usuels ; je décris un pavé droit (faces, arêtes, sommets).","Ex. 1 (3 points)"],
  ["CALCULER","Je trouve le volume d'un assemblage en comptant les cubes de 1 cm³.","Ex. 2 (3 points)"],
  ["REPRÉSENTER","Je reconnais les vues d'un assemblage de cubes.","Ex. 3 (2 points)"],
  ["REPRÉSENTER","Je reconnais les patrons d'un cube.","Ex. 4 (2 points)"]
],
exos:[
{t:"Quel est ce solide ?", p:3, h:`<p>a) Donne le nom de chacun de ces solides.</p>${S4}
  <p>b) Recopie chaque phrase et écris « vrai » ou « faux ».</p><p>1) Un pavé droit a 8 sommets.</p><p>2) Un pavé droit a 6 arêtes.</p>`,
 c:`<p>a)</p>${NOMS}<p><i>(0,5 point par nom)</i></p>
  <p>b) 1) <b>Vrai</b>. · 2) <b>Faux</b> : il a 12 arêtes (et 6 faces). <i>(0,5 point par réponse)</i></p>`},
{t:"Combien de cubes ?", p:3, h:`<p>Chaque petit cube a un volume de 1 cm³. Les assemblages sont pleins : les cubes cachés qui soutiennent les autres sont bien là.</p><p>Quel est le volume de chaque assemblage ?</p>${ISOS(VOL.slice(0,2))}`,
 c:`<p>On regarde le côté droit pour savoir combien il y a de rangées (ici, deux rangées pour chaque assemblage).</p>
  <p>a) Devant : 4 cubes. Derrière : 2 colonnes de 2 cubes et 2 cubes seuls, soit 2 + 2 + 1 + 1 = 6 cubes. 4 + 6 = 10 cubes : <b>10 cm³</b>. <i>(1,5 point)</i></p>
  <p>b) Devant : 2 + 1 + 1 = 4 cubes. Derrière : 2 + 2 + 1 = 5 cubes. 4 + 5 = 9 cubes : <b>9 cm³</b>. <i>(1,5 point)</i></p>`},
{t:"De dessus, de face", p:2, h:`<div class="cpt"><div><p>Voici un assemblage de cubes. On le regarde de devant (de face) et d'en haut (de dessus).</p>
  <p>a) Laquelle des figures ①, ② et ③ est la vue de dessus ?</p><p>b) Laquelle est la vue de face ?</p></div>${iso(A4,{s:34})}</div><div class="figs">${fv(V4.face,"①","Figure ①")}${fv(T4,"②","Figure ②")}${fv(V4.top,"③","Figure ③")}</div>`,
 c:`<p>a) La vue de dessus est la figure <b>③</b> : on voit 3 carrés pour la rangée de devant, et 1 carré derrière, à gauche. <i>(1 point)</i></p>
  <p>b) La vue de face est la figure <b>①</b> : de devant, on voit une colonne de 1 cube, une colonne de 1 cube, puis une colonne de 2 cubes à droite. Le cube de derrière est caché. <i>(1 point)</i></p>
  <p>La figure ② ne correspond à aucune des deux vues.</p>`},
{t:"Patrons de cube", p:2, h:`<p>Parmi ces figures, lesquelles sont des patrons de cube ?</p>${PAT([["a)",NETS.a],["b)",NETS.b],["c)",NETS.c],["d)",NETS.d]])}`,
 c:`<p>Les patrons de cube sont <b>a) et b)</b>. <i>(0,5 point par figure bien classée)</i></p>
  <p>c) n'en est pas un : les deux carrés du bas se plieraient tous les deux sur la même face. · d) n'en est pas un : un rectangle de 2 carrés sur 3 ne se referme pas en cube.</p>`}
]}
};
})()

};
})();
