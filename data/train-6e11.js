/* 6e · chapitre 11 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres mesures */
TRAIN["6e-11"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {tri, fromASA, fromSAS} = window.FIG11;
const A = n => `<span class="ang">${n}</span>`;
const LET = "ABCDEFGHIJKLMNOPRSTUVWXYZ".split("");
const nom = () => shuf(LET).slice(0,3);
/* calcul nommé : une étape par ligne, chaque ligne commence par le nom de l'angle */
const CHN = (x, st) => `<p class="calc">${st.map((l,k)=>`${A(x)} = ${k===st.length-1?`<b>${l}</b>`:l}`).join("<br>")}</p>`;
const red = (t, a, b, x) => `<p class="calc">Dans le triangle ${t}, la somme des angles est égale à 180°.<br>${A(x)} = 180° − (${a}° + ${b}°)<br>${A(x)} = 180° − ${a+b}°<br>${A(x)} = <b>${180-a-b}°</b></p>`;

/* ---------- A. La somme des angles ---------- */
const e1 = shuf([0,0,0,1,1,1]).map(bad=>{ const a=ri(20,100), b=ri(10,170-a); let c=180-a-b; if(bad) c+= c>25?pick([-20,-10,10,15,20]):pick([10,15,20]); return [a,b,c]; });
const e2 = distinct(4, ()=>{ const n=nom(), a=ri(20,120), b=ri(15,165-a); return [n,a,b]; }, x=>x[0].join(""));
const e3 = distinct(3, ()=>{ const t=pick(["q","r","i"]); if(t==="q"){ const a=ri(30,80), b=ri(30,80); return [t,a,b]; } if(t==="r"){ return [t,90,ri(20,70)]; } const b=ri(28,45); return [t,b,b]; }, x=>x.join());
const N3 = (t,k) => (t==="r"?[["M","N","P"],["U","V","W"],["I","J","K"]]:[["A","B","C"],["R","S","T"],["E","F","G"]])[k];
const L4 = shuf([ri(40,70), ri(40,70), ri(40,70)]), ok4 = L4[0]+L4[1]+L4[2];
const secA = {t:"La somme des angles d'un triangle", e:[
  {n:"Exercice 1", t:"Possible ou impossible ?", w:"Sur ton cahier", h:`<p>Ces nombres peuvent-ils être les mesures des angles d'un triangle ?</p><p>${items(e1.map(m=>m.join("° ; ")+"°"),"  ·  ",true)}</p>`,
   c:items(e1.map(m=>{ const s=m[0]+m[1]+m[2]; return `${m.join(" + ")} = ${s} : <b>${s===180?"possible":"impossible"}</b>`; }),"<br>",true)},
  {n:"Exercice 2", t:"Calculer un angle", w:"Sur ton cahier", h:e2.map(([n,a,b],k)=>`<p>${"abcd"[k]}) ${n.join("")} est un triangle tel que ${A(n.join(""))} = ${a}° et ${A(n[1]+n[2]+n[0])} = ${b}°. Calcule ${A(n[2]+n[0]+n[1])}.</p>`).join(""),
   c:e2.map(([n,a,b],k)=>`<p>${"abcd"[k]})</p>${red(n.join(""),a,b,n[2]+n[0]+n[1])}`).join("")},
  {n:"Exercice 3", t:"Des figures à main levée", w:"Sur ton cahier", h:`<p>Les figures sont à main levée : calcule l'angle marqué « ? ».</p><div class="figs">${e3.map(([t,a,b],k)=>{ const P = t==="r"?fromSAS(4,2.6,90):t==="i"?fromASA(5,a,b):fromASA(4.5,a,b); const o={k:30,n:N3(t,k)}; o.arc = t==="r"?[{i:1,t:b+"°"},{i:2,t:"?",c:"r"}]:[{i:0,t:a+"°"},{i:1,t:b+"°"},{i:2,t:"?",c:"r"}]; if(t==="r") o.right=[0]; return `<figure><figcaption>${"abc"[k]})</figcaption>${tri(P,o)}</figure>`; }).join("")}</div>`,
   c:e3.map(([t,a,b],k)=>{ const [X,Y,Z]=N3(t,k); return `<p>${"abc"[k]})${t==="r"?` Le triangle est rectangle en ${X} : ${A(Y+X+Z)} = 90°.`:""}</p>`+(t==="r"?red(X+Y+Z,90,b,X+Z+Y):red(X+Y+Z,a,b,X+Z+Y)); }).join("")},
  {n:"Exercice 4", t:"Une erreur ?", w:"Sur ton cahier", h:`<p>Sami a mesuré les trois angles d'un triangle : ${L4.join("°, ")}°. A-t-il fait une erreur ?</p>`,
   c:`<p>${L4.join(" + ")} = ${ok4}. ${ok4===180?"La somme vaut 180° : ses mesures sont <b>possibles</b>.":`La somme devrait être 180° : <b>il a fait une erreur</b> (${Math.abs(ok4-180)}° d'écart en tout).`}</p>`}
 ]};

/* ---------- B. Triangles particuliers ---------- */
const ib = ri(25,80), it = 2*ri(15,55), rx = ri(15,75);
const i6 = 2*ri(48,75), i7 = ri(30,85);
const i8a = ri(91,170), i8b = ri(10,80);
const secB = {t:"Les angles des triangles particuliers", e:[
  {n:"Exercice 5", t:"Triangles particuliers", w:"Sur ton cahier", h:`<div class="figs"><figure><figcaption>a) ABC isocèle en A</figcaption>${tri(fromASA(4,ib,ib),{k:28,n:["B","C","A"],arc:[{i:0,t:ib+"°"}],ticks:[[0,2,1],[1,2,1]]})}</figure><figure><figcaption>b) KLM isocèle en L</figcaption>${tri(fromASA(5,(180-it)/2,(180-it)/2),{k:28,n:["K","M","L"],arc:[{i:2,t:it+"°"}],ticks:[[0,2,1],[1,2,1]]})}</figure><figure><figcaption>c) UVW rectangle en U</figcaption>${tri(fromSAS(4,3,90),{k:28,n:["U","V","W"],right:[0],arc:[{i:1,t:rx+"°"}]})}</figure></div><p>Calcule : a) ${A("ACB")} et ${A("BAC")} · b) ${A("LKM")} et ${A("LMK")} · c) ${A("VWU")}</p><p><i>Figures à main levée : on calcule, on ne mesure pas.</i></p>`,
   c:`<p>a) Isocèle en A : ${A("ACB")} = ${A("ABC")} = <b>${ib}°</b>, puis :</p>${CHN("BAC",[`180° − (${ib}° + ${ib}°)`,`180° − ${2*ib}°`,`${180-2*ib}°`])}<p>b) Isocèle en L : ${A("LKM")} = ${A("LMK")}.</p>${CHN("LKM",[`(180° − ${it}°) ÷ 2`,`${180-it}° ÷ 2`,`${(180-it)/2}°`])}<p>Donc ${A("LMK")} = <b>${(180-it)/2}°</b> aussi.</p><p>c) Rectangle en U : les angles aigus ont pour somme 90°.</p>${CHN("VWU",[`90° − ${rx}°`,`${90-rx}°`])}`},
  {n:"Exercice 6", t:"Des problèmes", w:"Sur ton cahier", h:`<p>1) Un triangle isocèle a un angle de ${i6}°. Quelles sont les mesures de ses deux autres angles ?</p><p>2) Un triangle isocèle a un angle de ${i7}°. Trouve les deux possibilités pour ses deux autres angles.</p>`,
   c:`<p>1) ${i6}° ne peut pas être un angle à la base (${i6} + ${i6} = ${2*i6} &gt; 180) : c'est l'angle au sommet principal. Les angles à la base mesurent (180° − ${i6}°) ÷ 2 = <b>${(180-i6)/2}° chacun</b>.</p><p>2) Si ${i7}° est l'angle au sommet principal : (180° − ${i7}°) ÷ 2 = <b>${String((180-i7)/2).replace(".",",")}° et ${String((180-i7)/2).replace(".",",")}°</b>.<br>Si ${i7}° est un angle à la base : <b>${i7}° et ${180-2*i7}°</b>.</p>`},
  {n:"Exercice 7", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>a) Un triangle peut avoir un angle de ${i8a}° et un angle droit.</p><p>b) Un triangle rectangle qui a un angle de 45° est isocèle.</p><p>c) Un triangle isocèle peut avoir un angle à la base de ${91+i8b%9}°.</p><p>d) Un triangle équilatéral est aussi isocèle.</p>`,
   c:`<p>a) <b>Faux.</b> ${i8a} + 90 = ${i8a+90} &gt; 180.</p><p>b) <b>Vrai.</b> Le troisième angle mesure 180° − (90° + 45°) = 45° : deux angles égaux.</p><p>c) <b>Faux.</b> Les deux angles à la base mesureraient ${91+i8b%9}° : ${2*(91+i8b%9)}° &gt; 180°.</p><p>d) <b>Vrai.</b> Il a trois côtés de même longueur, donc au moins deux.</p>`}
 ]};

/* ---------- C. Construire ---------- */
const c9 = (()=>{ const c=ri(5,7), a=ri(30,70), b=ri(30,70), n=nom(); return {c,a,b,n}; })();
const c10 = (()=>{ const c=ri(4,6), d=ri(3,5)+pick([0,0.5]), a=5*ri(8,24), n=nom(); return {c,d,a,n}; })();
const c11 = (()=>{ const c=ri(5,7), x=ri(35,65), y=ri(40,70), n=nom(); return {c,x,y,n}; })();
const ci = ri(4,6), ca = 2*ri(15,40);
const fr = x => String(x).replace(".",",");
const secC = {t:"Construire un triangle", note:"Fais un dessin à main levée codé, puis construis en vraie grandeur. <i>Les figures des corrections sont réduites.</i>", e:[
  {n:"Exercice 8", t:"Un côté et deux angles", w:"Sur ton cahier", h:`<p>Construis le triangle ${c9.n.join("")} tel que ${c9.n[0]}${c9.n[1]} = ${c9.c} cm, ${A(c9.n[1]+c9.n[0]+c9.n[2])} = ${c9.a}° et ${A(c9.n[0]+c9.n[1]+c9.n[2])} = ${c9.b}°. Mesure le troisième angle, puis vérifie par un calcul.</p>`,
   c:`${red(c9.n.join(""), c9.a, c9.b, c9.n[0]+c9.n[2]+c9.n[1])}${tri(fromASA(c9.c,c9.a,c9.b),{k:28,n:c9.n,arc:[{i:0,t:c9.a+"°"},{i:1,t:c9.b+"°",c:"o"},{i:2,t:(180-c9.a-c9.b)+"°",c:"g"}],side:[{i:0,j:1,t:c9.c+" cm"}]})}`},
  {n:"Exercice 9", t:"Deux côtés et l'angle compris", w:"Sur ton cahier", h:`<p>Construis le triangle ${c10.n.join("")} tel que ${c10.n[0]}${c10.n[1]} = ${c10.c} cm, ${c10.n[0]}${c10.n[2]} = ${fr(c10.d)} cm et ${A(c10.n[1]+c10.n[0]+c10.n[2])} = ${c10.a}°.</p><p>Puis construis le triangle isocèle DEF tel que DE = DF = ${ci} cm et ${A("EDF")} = ${ca}°, et calcule ses deux autres angles.</p>`,
   c:`<div class="cgrid"><figure><figcaption>Je trace [${c10.n[0]}${c10.n[1]}], l'angle de ${c10.a}° en ${c10.n[0]}, puis je place ${c10.n[2]} à ${fr(c10.d)} cm de ${c10.n[0]}.</figcaption>${tri(fromSAS(c10.c,c10.d,c10.a),{k:28,n:c10.n,arc:[{i:0,t:c10.a+"°"}],side:[{i:0,j:1,t:c10.c+" cm"},{i:2,j:0,t:fr(c10.d)+" cm"}]})}</figure>
   <figure><figcaption>${A("DEF")} = ${A("DFE")}.${CHN("DEF",[`(180° − ${ca}°) ÷ 2`,`${180-ca}° ÷ 2`,`${(180-ca)/2}°`])}Donc ${A("DFE")} = <b>${(180-ca)/2}°</b> aussi.</figcaption>${tri(fromSAS(ci,ci,ca),{k:28,n:["D","E","F"],arc:[{i:0,t:ca+"°",r:28},{i:1,t:(180-ca)/2+"°",c:"o"},{i:2,t:(180-ca)/2+"°",c:"o"}],ticks:[[0,1,1],[0,2,1]]})}</figure></div>`},
  {n:"Exercice 10", t:"Calculer avant de construire", w:"Sur ton cahier", h:`<p>On veut construire le triangle ${c11.n.join("")} tel que ${c11.n[0]}${c11.n[1]} = ${c11.c} cm, ${A(c11.n[0]+c11.n[1]+c11.n[2])} = ${c11.x}° et ${A(c11.n[1]+c11.n[2]+c11.n[0])} = ${c11.y}°. Quel angle faut-il calculer d'abord ? Construis le triangle.</p>`,
   c:`<p>L'angle en ${c11.n[2]} n'est pas au bout du côté [${c11.n[0]}${c11.n[1]}] : je calcule l'angle en ${c11.n[0]}.</p>${red(c11.n.join(""), c11.x, c11.y, c11.n[2]+c11.n[0]+c11.n[1])}${tri(fromASA(c11.c,180-c11.x-c11.y,c11.x),{k:28,n:c11.n,arc:[{i:0,t:(180-c11.x-c11.y)+"°"},{i:1,t:c11.x+"°",c:"o"},{i:2,t:c11.y+"°",c:"g"}],side:[{i:0,j:1,t:c11.c+" cm"}]})}`}
 ]};

return [secA, secB, secC];
};
