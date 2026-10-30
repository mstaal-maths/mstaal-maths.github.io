/* 5e · chapitre 8 — fiche d'entraînement : les exercices de la fiche de M. Staal (« Angles et parallélisme »),
   avec d'autres mesures. Les figures sont dessinées à partir des mêmes mesures que les corrections. */
TRAIN["5e-8"] = function(){
const {ri, pick, shuf} = TR;
const {secF, al3F, parF, triF, OR, BL, GR} = window.ANG8;
const an = t => `<span class="ang">${t}</span>`;
const fr = x => String(Math.round(x*100)/100).replace(".",",");
const fig = (lab, body) => `<figure><figcaption>${lab}</figcaption>${body}</figure>`;
const L = "abcdef";

/* ===================== I. Vocabulaire des angles ===================== */
const a1 = ri(35,75);
const a2 = ri(25,85), b2a = ri(25,60), b2b = ri(30,70);
const bis = [ (()=>{ const x=ri(15,60); return [`${an("AOB")} = ${x}° donc ${an("AOC")} = ………°`, `${an("AOC")} = 2 × ${x}° = <b>${2*x}°</b>`]; })(),
              (()=>{ const x=2*ri(25,85); return [`${an("AOC")} = ${x}° donc ${an("BOC")} = ………°`, `${an("BOC")} = ${x}° ÷ 2 = <b>${x/2}°</b>`]; })(),
              (()=>{ const x=ri(10,60)+0.5; return [`${an("BOC")} = ${fr(x)}° donc ${an("AOC")} = ………°`, `${an("AOC")} = 2 × ${fr(x)}° = <b>${2*x}°</b>`]; })() ];

/* ===================== II. Angles et droites parallèles ===================== */
const t1 = ri(50,75);                                  /* activité 1 */
const t4 = ri(45,75);                                  /* exercice 4 */
const Q4 = shuf([["ABE","alterne-interne",t4],["FBT","correspondant",t4],["SAC",`opposé par le sommet à ${an("DAB")}`,t4]]);
const t5 = ri(50,80);                                  /* exercice 5 : ABE = t5 */
const e6 = shuf([ (()=>{ const t=ri(55,80); return {par:true, t, b:t}; })(), (()=>{ const t=ri(55,75); return {par:false, t, b:t+pick([-1,1])*ri(7,12)}; })() ]);

/* ===================== III. Somme des angles d'un triangle ===================== */
const act2 = (()=>{ let b,c; do{ b=ri(40,70); c=ri(40,75); }while(Math.abs(b-c)<6 || 180-b-c<40); return {b,c,a:180-b-c}; })();
const TRI = shuf([["ABC","ABC","ACB","BAC"],["DEG","DEG","DGE","EDG"],["GHI","HGI","GIH","GHI"],["JKL","JKL","JLK","KJL"],["MNO","NMO","MON","MNO"],["PQR","PQR","PRQ","QPR"],["STU","STU","SUT","TSU"],["VWX","VWX","VXW","WVX"]]).slice(0,6);
const kinds = shuf(["aigu","aigu","droit","obtus","obtus","equi"]);
const e7 = TRI.map((n,i)=>{ const k=kinds[i]; let x,y;
  if(k==="droit"){ x=ri(20,70); y=90; } else if(k==="obtus"){ x=ri(95,130); y=ri(15,180-x-15); } else if(k==="equi"){ x=60; y=60; } else { x=ri(30,80); y=ri(30,80); }
  if(Math.random()<0.5 && k!=="equi") [x,y]=[y,x];
  return {n, x, y, z:180-x-y}; });
const r8 = ri(20,70);
const x9 = (()=>{ let b,c; do{ b=ri(40,70); c=ri(40,75); }while(Math.abs(b-c)<6 || 180-b-c<35); return {b,c,a:180-b-c}; })();
const i10a = 2*ri(15,60), i10b = ri(30,75);

return [
 {t:"Vocabulaire des angles", e:[
  {n:"Exercice 1", t:"Reconnaître des angles", w:"Sur ton cahier", h:`<p>Les droites (AC) et (BD) se coupent en O.</p>${secF(a1,[["O","A","B",OR]],{w:300})}
   <p><b>1)</b> Nomme un angle opposé par le sommet à ${an("AOB")}.</p><p>Nomme deux angles adjacents à ${an("AOB")}.</p>
   <p><b>2)</b> Complète : ${an("AOB")} et ${an("BOC")} sont ……………… car leur somme est égale à ………°.</p>
   <p><b>3)</b> Quelle est la nature de l'angle ${an("AOB")} ? Et celle de l'angle ${an("AOC")} ?</p>`,
   c:`<p><b>1)</b> L'angle opposé par le sommet à ${an("AOB")} est <b>${an("COD")}</b>.</p><p>Les angles adjacents à ${an("AOB")} sont <b>${an("BOC")}</b> et <b>${an("DOA")}</b>.</p>
   <p><b>2)</b> ${an("AOB")} et ${an("BOC")} sont <b>supplémentaires</b> car leur somme est égale à <b>180°</b> (ils forment l'angle plat ${an("AOC")}).</p>
   <p><b>3)</b> L'angle ${an("AOB")} est un angle <b>aigu</b> (il mesure ${a1}°).</p><p>L'angle ${an("AOC")} est un angle <b>plat</b>.</p>`},
  {n:"Exercice 2", t:"Calculer avec des angles supplémentaires", w:"Sur ton cahier", h:`<p>Calcule la mesure de chaque angle demandé et justifie.</p>
   <p><b>1)</b> Les droites (AC) et (BD) se coupent en O. Calcule ${an("BOC")}, ${an("COD")} et ${an("DOA")}.</p>${secF(a2,[["O","A","B",OR,a2+"°"]],{w:300})}
   <p><b>2)</b> Les points A, O et C sont alignés. Calcule ${an("DOC")}.</p>${al3F(b2a,b2b)}`,
   c:`<p><b>1)</b> ${an("AOB")} et ${an("BOC")} sont supplémentaires :</p><p class="calc">${an("BOC")} = 180° − ${a2}° = ${180-a2}°</p>
   <p>${an("COD")} et ${an("AOB")} sont opposés par le sommet : ${an("COD")} = ${an("AOB")} = <b>${a2}°</b>.</p>
   <p>${an("DOA")} et ${an("BOC")} sont opposés par le sommet : ${an("DOA")} = ${an("BOC")} = <b>${180-a2}°</b>.</p>
   <p><b>2)</b> Les trois angles forment l'angle plat ${an("AOC")} :</p><p class="calc">${an("DOC")} = 180° − ${b2a}° − ${b2b}° = ${180-b2a-b2b}°</p>`},
  {n:"Exercice 3", t:"La bissectrice", w:"Sur ton cahier", h:`<p>Dans chaque cas, [OB) est la bissectrice de l'angle ${an("AOC")}. Complète.</p>${bis.map(([s],i)=>`<p><b>${L[i]})</b> ${s}</p>`).join("")}`,
   c:bis.map(([,c],i)=>`<p><b>${L[i]})</b> ${c}</p>`).join("")}
 ]},
 {t:"Angles et droites parallèles", e:[
  {n:"Activité 1", t:"Mesurer des angles", w:"Sur ton cahier", h:`<p>Les droites (d) et (d') sont parallèles.</p><p>Mesure les angles avec ton rapporteur (directement sur l'écran ou sur la fiche imprimée).</p>${parF(t1,[],{w:440})}
   <p><b>1)</b> Mesure ${an("DAB")} et ${an("ABE")}. Que remarques-tu ?</p><p><b>2)</b> Mesure ${an("SAD")} et ${an("ABF")}. Que remarques-tu ?</p>`,
   c:`${parF(t1,[["DAB",OR,t1+"°"],["ABE",OR,t1+"°"],["SAD",BL,(180-t1)+"°"],["ABF",BL,(180-t1)+"°"]],{w:440})}
   <p><b>1)</b> ${an("DAB")} = ${t1}° et ${an("ABE")} = ${t1}° : ces angles alternes-internes sont <b>égaux</b>.</p>
   <p><b>2)</b> ${an("SAD")} = ${180-t1}° et ${an("ABF")} = ${180-t1}° : ces angles correspondants sont <b>égaux</b>.</p>`},
  {n:"Exercice 4", t:"Alternes-internes ou correspondants ?", w:"Sur ton cahier", h:`<p>Sur la figure, (d) // (d') et ${an("DAB")} = ${t4}°.</p>${parF(t4,[["DAB",OR,t4+"°"]],{w:440})}
   <p>Pour chaque angle, dis s'il est alterne-interne, correspondant ou opposé par le sommet à ${an("DAB")}, puis donne sa mesure :</p>${Q4.map(([n],i)=>`<p><b>${L[i]})</b> ${an(n)}</p>`).join("")}`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>Position par rapport à ${an("DAB")}</th><th>Mesure</th></tr></thead><tbody>${Q4.map(([n,p,m])=>`<tr><td>${an(n)}</td><td>${p}</td><td>${m}°</td></tr>`).join("")}</tbody></table></div>
   ${Q4.map(([n,p])=>/^alt/.test(p) ? `<p>${an(n)} et ${an("DAB")} sont alternes-internes et (d) // (d'), donc ils sont égaux : ${an(n)} = ${t4}°.</p>` : /^corr/.test(p) ? `<p>${an(n)} et ${an("DAB")} sont correspondants et (d) // (d'), donc ils sont égaux : ${an(n)} = ${t4}°.</p>` : `<p>${an(n)} et ${an("DAB")} sont opposés par le sommet, donc ils ont la même mesure : ${an(n)} = ${t4}°.</p>`).join("")}`},
  {n:"Exercice 5", t:"Calculer des angles", w:"Sur ton cahier", h:`<p>Sur la figure, (d) // (d') et ${an("ABE")} = ${t5}°.</p><p>Calcule ${an("DAB")}, ${an("SAD")} et ${an("ABF")} en justifiant chaque réponse.</p>${parF(t5,[["ABE",OR,t5+"°"]],{w:440})}`,
   c:`<p>${an("DAB")} et ${an("ABE")} sont alternes-internes et (d) // (d'), donc ${an("DAB")} = ${an("ABE")} = <b>${t5}°</b>.</p>
   <p>${an("DAB")} et ${an("SAD")} sont supplémentaires :</p><p class="calc">${an("SAD")} = 180° − ${t5}° = ${180-t5}°</p>
   <p>${an("SAD")} et ${an("ABF")} sont correspondants et (d) // (d'), donc ${an("ABF")} = ${an("SAD")} = <b>${180-t5}°</b>.</p>`},
  {n:"Exercice 6", t:"Démontrer un parallélisme", w:"Sur ton cahier", h:`<p>Les droites (d) et (d') sont-elles parallèles ?</p><p>Justifie en nommant les angles utilisés.</p>
   <div class="figs">${e6.map((x,i)=>fig(L[i]+")", parF(x.t,[["DAB",OR,x.t+"°"],["ABE",OR,x.b+"°"]],{b:x.b, w:380}))).join("")}</div>`,
   c:e6.map((x,i)=> x.par
     ? `<p><b>${L[i]})</b> ${an("DAB")} et ${an("ABE")} sont alternes-internes et ${an("DAB")} = ${an("ABE")} = ${x.t}°.</p><p><b>Si</b> deux droites coupées par une sécante forment des angles alternes-internes égaux, <b>alors</b> elles sont parallèles.</p><p>Donc <b>(d) // (d')</b>.</p>`
     : `<p><b>${L[i]})</b> ${an("DAB")} = ${x.t}° et ${an("ABE")} = ${x.b}° : ces angles alternes-internes ne sont pas égaux.</p><p>Si (d) et (d') étaient parallèles, ils seraient égaux : (d) et (d') ne sont <b>pas parallèles</b>.</p>`).join("")}
 ]},
 {t:"Somme des angles d'un triangle", e:[
  {n:"Activité 2", t:"Mesurer les angles d'un triangle", w:"Sur ton cahier", h:`<p>Voici un triangle ABC.</p>${triF(act2.b,act2.c,[["A","B","C",OR],["B","C","A",BL],["C","A","B",GR]],{w:340})}
   <p><b>1)</b> Avec ton rapporteur, mesure ${an("BAC")}, ${an("ABC")} et ${an("ACB")}.</p><p><b>2)</b> Calcule la somme des trois angles. Que remarques-tu ?</p>`,
   c:`<p><b>1)</b> ${an("BAC")} = ${act2.a}°, ${an("ABC")} = ${act2.b}°, ${an("ACB")} = ${act2.c}°.</p><p><b>2)</b> ${act2.a}° + ${act2.b}° + ${act2.c}° = 180° : la somme des angles du triangle vaut <b>180°</b> (aux erreurs de mesure près).</p>`},
  {n:"Exercice 7", t:"Calculer le troisième angle", w:"Sur ton cahier", h:`<p>Calcule le troisième angle de chaque triangle et rédige.</p>${e7.map(({n,x,y},i)=>`<p><b>${L[i]})</b> Dans le triangle ${n[0]}, ${an(n[1])} = ${x}° et ${an(n[2])} = ${y}°. Calcule ${an(n[3])}.</p>`).join("")}`,
   c:`<p>La somme des angles d'un triangle est égale à 180°, donc :</p>${e7.map(({n,x,y,z},i)=>`<p><b>${L[i]})</b> ${an(n[3])} = 180° − ${x}° − ${y}° = <b>${z}°</b></p>`).join("")}`},
  {n:"Exercice 8", t:"Triangles particuliers", w:"Sur ton cahier", h:`<p>Réponds en justifiant.</p><p><b>1)</b> Le triangle RST est rectangle en R et ${an("RST")} = ${r8}°. Calcule ${an("RTS")}.</p>
   <p><b>2)</b> Le triangle équilatéral UVW a trois angles égaux. Quelle est la mesure de chacun ?</p><p><b>3)</b> Un triangle peut-il avoir deux angles obtus ? Justifie.</p>`,
   c:`<p><b>1)</b> La somme des angles du triangle vaut 180° :</p><p class="calc">${an("RTS")} = 180° − 90° − ${r8}° = ${90-r8}°</p>
   <p><b>2)</b> 180° ÷ 3 = 60° : chaque angle mesure <b>60°</b>.</p>
   <p><b>3)</b> <b>Non</b> : deux angles obtus mesurent chacun plus de 90°, donc leur somme dépasse 180°.</p><p>C'est impossible, puisque les trois angles ont pour somme 180°.</p>`},
  {n:"Exercice 9", t:"La configuration-clé", w:"Sur ton cahier", h:`<p>Dans le triangle ABC, la droite (xy) est parallèle à (BC).</p><p>On donne ${an("xAB")} = ${x9.b}° et ${an("yAC")} = ${x9.c}°. Réponds en justifiant.</p>
   ${triF(x9.b,x9.c,[["A","x","B",BL,x9.b+"°"],["A","B","C",OR,""],["A","C","y",GR,x9.c+"°"],["B","C","A",BL,""],["C","A","B",GR,""]],{xy:true, w:380})}
   <p><b>1)</b> Calcule ${an("ABC")} et ${an("ACB")}.</p><p><b>2)</b> Calcule ${an("BAC")} de deux façons.</p>`,
   c:`${triF(x9.b,x9.c,[["A","x","B",BL,x9.b+"°"],["A","B","C",OR,x9.a+"°"],["A","C","y",GR,x9.c+"°"],["B","C","A",BL,x9.b+"°"],["C","A","B",GR,x9.c+"°"]],{xy:true, w:380})}
   <p><b>1)</b> (xy) // (BC) et ${an("xAB")}, ${an("ABC")} sont alternes-internes : ${an("ABC")} = ${an("xAB")} = <b>${x9.b}°</b>.</p><p>De même, ${an("ACB")} = ${an("yAC")} = <b>${x9.c}°</b>.</p>
   <p><b>2)</b> Avec l'angle plat ${an("xAy")} : ${an("BAC")} = 180° − ${x9.b}° − ${x9.c}° = <b>${x9.a}°</b>.</p><p>Avec le triangle :</p><p class="calc">${an("BAC")} = 180° − ${an("ABC")} − ${an("ACB")}<br>${an("BAC")} = 180° − ${x9.b}° − ${x9.c}°<br>${an("BAC")} = <b>${x9.a}°</b></p>`},
  {n:"Exercice 10", t:"Pour aller plus loin : le triangle isocèle", w:"Sur ton cahier", h:`<p>On admet que dans un triangle isocèle, les deux angles situés à la base sont égaux.</p><p>Réponds en justifiant.</p>
   <p><b>1)</b> Le triangle ABC est isocèle en A et ${an("BAC")} = ${i10a}°. Calcule ${an("ABC")} et ${an("ACB")}.</p><p><b>2)</b> Le triangle DEG est isocèle en D et ${an("DEG")} = ${i10b}°. Calcule ${an("DGE")} et ${an("EDG")}.</p>`,
   c:`<p><b>1)</b> ${an("ABC")} = ${an("ACB")} et ${an("ABC")} + ${an("ACB")} = 180° − ${i10a}° = ${180-i10a}°.</p><p>Donc ${an("ABC")} = ${an("ACB")} = ${180-i10a}° ÷ 2 = <b>${(180-i10a)/2}°</b>.</p>
   <p><b>2)</b> ${an("DGE")} = ${an("DEG")} = <b>${i10b}°</b>.</p><p class="calc">${an("EDG")} = 180° − ${i10b}° − ${i10b}° = ${180-2*i10b}°</p>`}
 ]}
];
};
