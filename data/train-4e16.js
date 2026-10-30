/* 4e · chapitre 16 — fiche d'entraînement : les exercices de M. Staal (cours, fiche et exercices donnés), avec d'autres nombres.
   Les repères, les graphiques et les pavés sont dessinés à partir des mêmes valeurs que les corrections. */
TRAIN["4e-16"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {rep, pave, N, F, C2, C3, C3f, tab, BLUE, GRN, RED, PUR} = window.G416;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k, L4="abcd";
const isInt=x=>Number.isInteger(rd(x,6));

/* ===== repérage dans le plan ===== */
const PL = distinct(6, ()=>{ let x,y; do{ x=ri(-10,10)/2; y=ri(-5,5); }while(!x&&!y); return [x,y]; }, p=>p.join(";"));
const NM = ["A","B","C","D","E","F"];
const planFig = n => rep({xmin:-5,xmax:5,ymin:-5,ymax:5,gx:0.5,lx:1,kx:40,ky:22,pts:PL.slice(0,n).map((p,i)=>[NM[i],p[0],p[1],i<4?RED:BLUE])});

/* ===== activité : quatre cinémas ===== */
const CIN = (()=>{ const p1=pick([6.5,7,7.5,8]), p2=pick([8.5,9,9.5,10]), c=pick([3,4,5,6]), d=pick([5,5.5,6,6.5]), p=pick([9,9.5,10,10.5]);
  const n=[1,2,4,10]; const L=[{nom:"Cinémarin",v:n.map(x=>rd(p1*x)),t:"prop",k:p1},{nom:"Le Concorde",v:n.map(x=>rd(c+d*x)),t:"aff",c,d},{nom:"Le Club",v:[p,2*p-1,4*p-4,10*p-15],t:"irr"},{nom:"Cinéville",v:n.map(x=>rd(p2*x)),t:"prop",k:p2}];
  return shuf(L); })();
const cymax = Math.ceil(Math.max(...CIN.flatMap(c=>c.v))/20)*20;
const cg = (v,join)=>rep({xmin:0,xmax:11,ymin:0,ymax:cymax,gx:1,gy:10,ly:20,kx:24,ky:220/cymax,pts:[1,2,4,10].map((x,i)=>["",x,v[i],RED]),lines:join?[{p:[[1,v[0]],[2,v[1]],[4,v[2]],[10,v[3]]],col:BLUE}]:[],xt:"places",yt:"Prix (€)"});

/* ===== quatre graphiques ===== */
const G4 = shuf(["prop","prop","aff","courbe"]).map(T=>{ const k=pick([0.75,1,1.25,1.5]);
  const P = T==="prop"?[1,2,3,4].map(x=>[x,rd(x*k)]) : T==="aff"?(()=>{ const b=pick([1,1.5,2]); return [1,2,3,4].map(x=>[x,rd(0.75*x+b)]); })() : [1,2,3,4].map(x=>[x,rd(x*x/3,2)]);
  return {T,P}; });
const g4 = (P,join)=>rep({xmin:0,xmax:4.6,ymin:0,ymax:5.8,gx:1,gy:1,sub:4,kx:44,ky:34,pts:P.map(p=>["",p[0],p[1],RED]),lines:join?[{p:join,col:BLUE,dash:true}]:[]});
const g4join = G=>G.T==="prop"?[[0,0],G.P[3]]:G.T==="aff"?[[0,rd(G.P[0][1]-0.75)],G.P[3]]:G.P;
const G4TXT = {prop:"Les points forment une droite passant par l'origine du repère : <b>c'est une situation de proportionnalité</b>.", aff:"Les points forment une droite, mais elle ne passe pas par l'origine du repère : <b>la situation n'est pas proportionnelle</b>.", courbe:"Les points ne forment pas une droite : <b>la situation n'est pas proportionnelle</b>."};

/* ===== le plein ===== */
const ES = (()=>{ const k=pick([1.2,1.4,1.5,1.6,1.8]), v=pick([25,35,45,55,65]); return {k,v,p:rd(k*v)}; })();
const esG = (show)=>rep({xmin:0,xmax:70,ymin:0,ymax:Math.ceil(70*ES.k/20)*20,gx:10,gy:10,ly:20,sub:5,kx:7,ky:240/Math.ceil(70*ES.k/20)/20,fns:[{f:x=>x*ES.k,a:0,b:70,col:PUR}],lines:show?[{p:[[ES.v,0],[ES.v,ES.p],[0,ES.p]],col:BLUE,dash:true}]:[],xt:"Volume (L)",yt:"Prix (€)"});

/* ===== cuves ===== */
const CU = (()=>{ let h,k,H,C; do{ h=pick([20,30]); k=pick([2,2.5,3,4,8/3]); H=[h,1.5*h,3*h,5*h]; C=H.map(x=>rd(x*k)); }while(!C.every(isInt)); let q; do{ q=pick([2,3,4,6,7])*h*k/2; }while(q>=C[3]||q===C[1]||q===C[2]||!isInt(q)); return {h,k,H,C,q:rd(q),hq:rd(q/k)}; })();
const cuXmax = Math.ceil(CU.H[3]/20)*20+10, cuYmax = Math.ceil(CU.C[3]/40)*40+40;
const cuG = show=>rep({xmin:0,xmax:cuXmax,ymin:0,ymax:cuYmax,gx:10,gy:40,lx:20,ly:40,kx:480/cuXmax,ky:240/cuYmax,pts:CU.H.map((x,i)=>["",x,CU.C[i],RED]),lines:show?[{p:[[0,0],[CU.H[3],CU.C[3]]],col:GRN},{p:[[0,CU.q],[CU.hq,CU.q],[CU.hq,0]],col:BLUE,dash:true}]:[],xt:"Hauteur (cm)",yt:"Capacité (L)",ml:44});

/* ===== carré ===== */
const CS = distinct(5, ()=>pick([1,1.5,2,2.5,3,3.5,4,4.5,5]), x=>x).sort((a,b)=>a-b);
const csG = peri=>rep({xmin:0,xmax:5.5,ymin:0,ymax:peri?22:26,gx:1,gy:2,ly:4,sub:2,kx:44,ky:9,pts:CS.map(c=>["",c,peri?4*c:c*c,RED]),lines:peri?[{p:[[0,0],[5.5,22]],col:GRN,dash:true}]:[],xt:"côté (cm)",yt:peri?"Périmètre (cm)":"Aire (cm²)"});

/* ===== exercice en + ===== */
const EP = (()=>{ const k=pick([1.5,2.25,2.5,1.75]); const xa=distinct(4,()=>ri(1,6),x=>x).sort((a,b)=>a-b); const prop={x:xa,y:xa.map(x=>rd(k*x)),ok:true,k};
  const kb=pick([2,1.5]); const xb=distinct(4,()=>pick([1,2,3,4,4.5,5,5.5]),x=>x).sort((a,b)=>a-b); const yb=xb.map((x,i)=>i<2?rd(kb*x):rd(kb*x+pick([-1,1])*pick([1,1.5,2])));
  return shuf([prop,{x:xb,y:yb,ok:false}]); })();
const epG = (T,show)=>rep({xmin:0,xmax:7,ymin:0,ymax:Math.ceil(Math.max(...T.y)+1),gx:1,gy:1,ly:2,sub:2,kx:34,ky:200/Math.ceil(Math.max(...T.y)+1),pts:T.x.map((x,i)=>["",x,T.y[i],"var(--ink)"]),lines:show&&T.ok?[{p:[[0,0],[7,7*T.k]],col:RED}]:[],xt:"x",yt:"y"});

/* ===== pavé droit : changer de repère ===== */
const LET = shuf(["ABCDEFGH","MNPQRSTU","IJKLMNOP","RSTUVWXY"].map(s=>s)).pop();
const KEYS = ["0,0,0","1,0,0","1,1,0","0,1,0","0,0,1","1,0,1","1,1,1","0,1,1"];
const NAMES = Object.fromEntries(KEYS.map((k,i)=>[k,LET[i]]));
const kv = k=>k.split(",").map(Number);
const O3 = pick(KEYS), o=kv(O3);
const nb = d=>{ const v=[...o]; v[d]=1-v[d]; return v.join(","); };
const [dx,dy] = shuf([0,1]), RX=nb(dx), RY=nb(dy), RZ=nb(2);
const coord = k=>{ const v=kv(k); return [Math.abs(v[dx]-o[dx]), Math.abs(v[dy]-o[dy]), Math.abs(v[2]-o[2])]; };
const PVo = {a:1,b:1,c:1, ex:[180,0], ey:[56,-46], ez:[0,-100], V:NAMES, hid:"0,1,0"};

/* ===== pavé droit : milieux et centres ===== */
const MIL = [["le milieu de l'arête [AB]",[0.5,0,0]],["le milieu de l'arête [EF]",[0.5,0,1]],["le milieu de l'arête [CG]",[1,1,0.5]],["le milieu de l'arête [BC]",[1,0.5,0]],["le milieu de l'arête [GH]",[0.5,1,1]],["le milieu de l'arête [CD]",[0.5,1,0]],["le milieu de l'arête [AE]",[0,0,0.5]],["le centre de la face EFGH",[0.5,0.5,1]],["le centre de la face ADHE",[0,0.5,0.5]],["le centre de la face ABFE",[0.5,0,0.5]],["le centre de la face BCGF",[1,0.5,0.5]]];
const M3 = shuf(MIL).slice(0,3), MN3=["M","N","P"];
const CUBEo = {a:1,b:1,c:1, ex:[140,0], ey:[54,-45], ez:[0,-140], V:{"0,0,0":"A","1,0,0":"B","1,1,0":"C","0,1,0":"D","0,0,1":"E","1,0,1":"F","1,1,1":"G","0,1,1":"H"}, hid:"0,1,0", red:[["0,0,0","1,0,0"],["0,0,0","0,1,0"],["0,0,0","0,0,1"]]};

return [
 {t:"Repérage dans le plan", e:[
  {n:"Exercice 1", t:"Lire et placer des points", w:"Sur ton cahier", h:`<p>Attention : une unité vaut 2 carreaux sur l'axe des abscisses.</p>${planFig(4)}<p><b>a)</b> Lis les coordonnées des points A, B, C et D.</p><p><b>b)</b> Reproduis le repère et place les points E${C2(...PL[4])} et F${C2(...PL[5])}.</p>`,
   c:`<p><b>a)</b> ${PL.slice(0,4).map((p,i)=>`${NM[i]}${C2(...p)}`).join(" · ")}</p><p><b>b)</b></p>${planFig(6)}`}
 ]},
 {t:"Reconnaître graphiquement la proportionnalité", e:[
  {n:"Activité découverte", t:"Au cinéma", w:"Sur ton cahier", h:`<p>Voici les prix des places dans quatre cinémas.</p>${CIN.map(c=>`<p><b>${c.nom}</b></p>${tab(["Nb de places","1","2","4","10"],[["Prix payé (en €)",...c.v.map(x=>N(x))]])}`).join("")}
   <p><b>1)</b> Lesquels de ces tableaux représentent des situations de proportionnalité ? Justifie.</p><p><b>2)</b> Voici les graphiques. Quel est le point commun des représentations graphiques des situations proportionnelles ?</p><div class="figs">${CIN.map(c=>`<figure>${cg(c.v)}<figcaption>${c.nom}</figcaption></figure>`).join("")}</div>`,
   c:`<p><b>1)</b></p>${CIN.map(c=>`<p><b>${c.nom} :</b> ${c.t==="prop"?`${c.v.map((v,i)=>`${F(N(v),[1,2,4,10][i])} = ${N(c.k)}`).join(" ; ")} : <b>la situation est proportionnelle</b> (coefficient ${N(c.k)}).`:`${N(c.v[0])} × 2 = ${N(2*c.v[0])} ≠ ${N(c.v[1])} : <b>la situation n'est pas proportionnelle</b>.`}</p>`).join("")}
   <div class="figs">${CIN.map(c=>`<figure>${cg(c.v,true)}<figcaption>${c.nom}</figcaption></figure>`).join("")}</div>
   <p><b>2)</b> Pour les situations proportionnelles, les points sont alignés <b>avec l'origine du repère</b>. ${CIN.filter(c=>c.t==="aff").map(c=>`Pour ${c.nom}, les points sont alignés, mais la droite ne passe pas par l'origine.`).join("")}</p>`},
  {n:"Exercice B", t:"Proportionnel ou non ?", w:"Sur ton cahier", h:`<p>Dans chaque cas, indique si le graphique représente une situation de proportionnalité. Justifie.</p><div class="figs">${G4.map((G,i)=>`<figure>${g4(G.P)}<figcaption>${L4[i]})</figcaption></figure>`).join("")}</div>`,
   c:`<div class="figs">${G4.map((G,i)=>`<figure>${g4(G.P,g4join(G))}<figcaption>${L4[i]})</figcaption></figure>`).join("")}</div>${G4.map((G,i)=>`<p><b>${L4[i]})</b> ${G4TXT[G.T]}</p>`).join("")}`},
  {n:"Exercice C", t:"Le plein d'essence", w:"Sur ton cahier", h:`<p>Le graphique donne le prix payé à la pompe en fonction du volume d'essence.</p>${esG(false)}<p><b>1)</b> Quel est environ le prix de ${ES.v} L d'essence ?</p><p><b>2)</b> Le prix payé est-il proportionnel au volume d'essence ? Justifie.</p>`,
   c:`${esG(true)}<p><b>1)</b> On part de ${ES.v} L, on monte jusqu'à la droite, puis on lit sur l'axe vertical : environ <b>${Math.round(ES.p)} €</b> (par le calcul : ${ES.v} × ${N(ES.k)} = ${N(ES.p)} €).</p><p><b>2)</b> La situation est représentée par une droite qui passe par l'origine du repère : <b>elle est proportionnelle</b>.</p>`}
 ]},
 {t:"Représenter graphiquement une situation", e:[
  {n:"Exercice 1", t:"Les cuves", w:"Sur ton cahier", h:`<p>Voici des renseignements sur des cuves.</p>${tab(["Hauteur (en cm)",...CU.H.map(x=>N(x))],[["Capacité (en L)",...CU.C.map(x=>N(x))]])}
   <p><b>a)</b> Représente ce tableau dans un repère (1 carreau pour 10 cm en abscisses et 1 carreau pour 40 L en ordonnées).</p><p><b>b)</b> Indique s'il s'agit d'un tableau de proportionnalité, en utilisant le graphique puis le tableau.</p><p><b>c)</b> Estime avec le graphique la hauteur d'une cuve de ${N(CU.q)} L, puis calcule-la.</p>`,
   c:`${cuG(true)}<p><b>b)</b> Les points sont alignés avec l'origine du repère. Dans le tableau : ${CU.H.map((h,i)=>`${F(N(CU.C[i]),N(h))} ${isInt(CU.C[i]/h*100)?"=":"≈"} ${N(CU.C[i]/h,2)}`).join(" ; ")} : les quotients sont égaux, <b>c'est un tableau de proportionnalité</b>.</p>
   <p><b>c)</b> Graphiquement (en bleu), on trouve environ ${Math.round(CU.hq)} cm. Par le calcul : ${F(`${N(CU.H[3])} × ${N(CU.q)}`,N(CU.C[3]))} = <b>${N(CU.hq,2)} cm</b>.</p>`},
  {n:"Exercice D", t:"Le périmètre et l'aire d'un carré", w:"Sur ton cahier", h:`<p><b>1)</b> Recopie et complète le tableau.</p>${tab(["Longueur du côté (en cm)",...CS.map(c=>N(c))],[["Périmètre (en cm)",...CS.map(()=>"")],["Aire (en cm²)",...CS.map(()=>"")]])}<p><b>2)</b> Représente le périmètre en fonction du côté, puis l'aire en fonction du côté, dans deux repères.</p><p><b>3)</b> Le périmètre est-il proportionnel au côté ? Et l'aire ?</p>`,
   c:`${tab(["Longueur du côté (en cm)",...CS.map(c=>N(c))],[["Périmètre (en cm)",...CS.map(c=>N(4*c))],["Aire (en cm²)",...CS.map(c=>N(c*c))]])}<div class="figs"><figure>${csG(true)}<figcaption>Périmètre</figcaption></figure><figure>${csG(false)}<figcaption>Aire</figcaption></figure></div>
   <p><b>3)</b> Les points du périmètre sont alignés avec l'origine : <b>le périmètre est proportionnel au côté</b>. Ceux de l'aire ne sont pas alignés : <b>l'aire n'est pas proportionnelle au côté</b>.</p>`},
  {n:"Exercice en +", t:"Graphiquement et par le calcul", w:"Sur ton cahier", h:`<p>Pour chaque tableau, représente les points dans un repère, puis indique si c'est une situation de proportionnalité, graphiquement et par le calcul.</p>${EP.map((T,i)=>`<p><b>${i+1})</b></p>${tab(["x",...T.x.map(x=>N(x))],[["y",...T.y.map(y=>N(y))]])}`).join("")}`,
   c:`<div class="figs">${EP.map((T,i)=>`<figure>${epG(T,true)}<figcaption>${i+1})</figcaption></figure>`).join("")}</div>${EP.map((T,i)=>`<p><b>${i+1})</b> ${T.x.map((x,j)=>`${F(N(T.y[j]),N(x))} ${isInt(T.y[j]/x*100)?"=":"≈"} ${N(T.y[j]/x,2)}`).join(" ; ")}. ${T.ok?`Les points sont alignés avec l'origine et le coefficient est ${N(T.k)} : <b>la situation est proportionnelle</b>.`:`Les points ne sont pas alignés avec l'origine et il n'y a pas de coefficient : <b>la situation n'est pas proportionnelle</b>.`}</p>`).join("")}`}
 ]},
 {t:"Repérage dans le pavé droit", e:[
  {n:"Exercice 3", t:"Lire des coordonnées dans un repère", w:"Sur ton cahier", h:`<p>${LET} est un parallélépipède rectangle.</p>${pave({...PVo,alt:"Parallélépipède rectangle "+LET})}<p>Lis les coordonnées de tous les sommets dans le repère (${NAMES[O3]} ; ${NAMES[RX]}, ${NAMES[RY]}, ${NAMES[RZ]}).</p>`,
   c:`<p>${NAMES[O3]} est l'origine ; [${NAMES[O3]}${NAMES[RX]}] donne l'abscisse, [${NAMES[O3]}${NAMES[RY]}] l'ordonnée et [${NAMES[O3]}${NAMES[RZ]}] l'altitude.</p><p>${KEYS.slice(0,4).map(k=>`${NAMES[k]}${C3(...coord(k))}`).join(" ; ")}</p><p>${KEYS.slice(4).map(k=>`${NAMES[k]}${C3(...coord(k))}`).join(" ; ")}</p>`},
  {n:"Exercice 4", t:"Milieux et centres", w:"Sur ton cahier", h:`<p>ABCDEFGH est un cube. On travaille dans le repère (A ; B, D, E).</p>${pave(CUBEo)}<p>Place les points suivants et donne leurs coordonnées :</p>${M3.map(([t],i)=>`<p>• ${MN3[i]} est ${t}${i===M3.length-1?".":" ;"}</p>`).join("")}`,
   c:`${pave({...CUBEo,pts:M3.map(([,c],i)=>[MN3[i],...c,BLUE,14,-8])})}<p>${M3.map(([,c],i)=>`${MN3[i]}${C3f(...c)}`).join(" ; ")}</p>`}
 ]}
];
};
