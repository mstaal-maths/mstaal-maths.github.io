/* 5e · chapitre 5 — fiche d'entraînement : les exercices du dossier de classe, avec d'autres nombres.
   Les figures et les corrections sont produites à partir des mêmes valeurs. */
TRAIN["5e-5"] = function(){
const {ri, pick, shuf} = TR;
const {F, Fs, cmp, dg, rep, thermo, cols, LT, GT} = window.REL;
const r3 = x => Math.round(x*1000)/1000;
const distinct = (n, f) => { const s=new Set(); let g=0; while(s.size<n && g++<3000) s.add(r3(f())); return [...s]; };
const L = "abcdefghijkl";
const coords = P => P.map(([n,x,y])=>`${n}(${F(x)} ; ${F(y)})`).join(" &nbsp; ");
const sortUp = a => [...a].sort((x,y)=>x-y);

/* ===== Activité 1 : soustractions ===== */
const subs = [];
for(let i=0;i<12;i++){
  const t = i%4;
  let a,b;
  if(t===0){ a=ri(10,60); b=ri(2,a-1); }                                 /* résultat positif */
  else if(t===1){ a=ri(1,20); b=a+ri(2,25); }                            /* résultat négatif */
  else if(t===2){ a=ri(11,90); b=100; if(Math.random()<0.5){ b=a+ri(3,40); } }
  else { a=r3(ri(11,89)/10); b=Math.ceil(a)+ri(0,4); if(Math.random()<0.3){ b=ri(Math.ceil(a)+1,15); } }
  subs.push([a,b]);
}
const A1h = cols(subs.map(([a,b],i)=>`${L[i]}) ${F(a)} − ${F(b)} = ………`));
const A1c = cols(subs.map(([a,b],i)=>`${L[i]}) ${F(a)} − ${F(b)} = ${F(a-b)}`));

/* ===== Exercice 1 : vie quotidienne ===== */
const SIT = [
  ()=>{ const n=ri(1,6); return [`Une voiture est garée au ${n===1?"1<sup>er</sup>":n+"<sup>e</sup>"} sous-sol`, -n]; },
  ()=>{ const n=ri(2,9); return [`L'ascenseur s'arrête au ${n}<sup>e</sup> étage`, n]; },
  ()=>{ const n=ri(2,15); return [`La température est de ${n} °C en dessous de zéro`, -n]; },
  ()=>{ const n=ri(12,35); return [`Il fait ${n} °C au-dessus de zéro`, n]; },
  ()=>{ const n=ri(2,40)*10; return [`Sur mon compte, je suis « à découvert » de ${n} €`, -n]; },
  ()=>{ const n=ri(2,20)*10; return [`Le plongeur est descendu à ${n} m de profondeur`, -n]; },
  ()=>{ const n=ri(5,20)*100; return [`Un château a été construit en ${n} après J.-C.`, n, 1]; } /* une année s'écrit sans espace */,
  ()=>{ const n=ri(2,9)*100; return [`Une ville a été fondée ${n} ans avant J.-C.`, -n]; },
  ()=>{ const n=ri(10,48)*100; return [`Un sommet culmine à ${F(n)} m d'altitude`, n]; }
];
const sits = shuf(SIT).slice(0,6).map(f=>f());

/* ===== Exercice 2 : thermomètres ===== */
const th = shuf(distinct(6, ()=>ri(-10,10)));

/* ===== Exercice 3 : opposés et valeurs absolues ===== */
const op = shuf([ri(2,15), -ri(2,15), 0, -r3(ri(11,99)/10), r3(ri(11,99)/10)]);
const ab = shuf([ri(11,40), -r3(ri(11,99)/10), -ri(50,200), 0]);
const VF3 = shuf([
  ()=>{ const a=ri(2,9); return [`|−${a}| = |${a}|`, true, `|−${a}| = ${a} et |${a}| = ${a}.`]; },
  ()=>{ const a=ri(2,9); return [`|−${a}| = −${a}`, false, `|−${a}| = ${a} : une valeur absolue n'est jamais négative.`]; },
  ()=>[`Un nombre et son opposé ont la même valeur absolue.`, true, `ils ont la même distance à zéro.`],
  ()=>{ const a=r3(ri(11,99)/10); return [`L'opposé de −${F(a)} est −${F(a)}.`, false, `l'opposé de −${F(a)} est ${F(a)}.`]; },
  ()=>[`L'opposé de 0 est 0.`, true, `0 n'a pas de signe : il est son propre opposé.`]
]).slice(0,3).map(f=>f());

/* ===== Exercice 4 : positif / négatif ===== */
const e4 = shuf([0, -ri(1,9), r3(ri(11,99)/10), -r3(ri(1,9)/10), ri(10,30), -ri(10,30), r3(ri(1,9)/10)]);
const lst = f => e4.filter(f).map(Fs).join(" ; ");

/* ===== Exercice 5 : droites graduées ===== */
const pts4 = (vals) => sortUp(vals).map((v,i)=>["ABCD"[i],v]);
const DR = [
  {min:-6,max:6,step:1,lab:1, v:distinct(4,()=>ri(-6,6)||1)},
  {min:-1,max:1,step:0.1,lab:0.5, v:distinct(4,()=>{ let x; do{ x=ri(-10,10); }while(x%5===0); return x/10; })},
  {min:-3,max:3,step:0.5,lab:1, v:distinct(4,()=>{ let x; do{ x=ri(-6,6); }while(!x); return x/2; })},
  {min:-40,max:40,step:5,lab:10, v:distinct(4,()=>{ let x; do{ x=ri(-8,8); }while(!x); return x*5; })}
];
const drw = (d,show) => dg({min:d.min,max:d.max,step:d.step,lab:d.lab,pts:pts4(d.v),show});
const D5b = distinct(5, ()=>ri(-8,6)/2).map((v,i)=>["ABCDE"[i],v]);

/* ===== Activité 2 : températures de la semaine ===== */
const JOURS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const tempsU = shuf([...distinct(4, ()=>-ri(5,250)/100), ...distinct(3, ()=>ri(5,250)/100)]);
const order = JOURS.map((j,i)=>[j,tempsU[i]]).sort((a,b)=>a[1]-b[1]);

/* ===== Exercice 6 : comparer ===== */
const C6 = [];
{ const a=-r3(ri(11,99)/10), b=r3(ri(11,99)/10); C6.push(pick([[a,b],[b,a]])); }
{ let a,b; do{ a=-ri(2,20); b=-ri(2,20); }while(a===b); C6.push([a,b]); }
{ const u=ri(1,9), a=r3(u+ri(1,9)/10), b=r3(u+ri(10,99)/100); C6.push(pick([[a,b],[b,a]])); }
{ const u=ri(1,9); let a,b; do{ a=-r3(u+ri(1,9)/10); b=-r3(u+ri(1,9)/10); }while(a===b); C6.push([a,b]); }
{ let a,b; do{ a=-ri(2,9); b=-ri(2,9); }while(a===b); C6.push([a,b]); }
{ let k; do{ k=ri(11,99); }while(k%10===0); const a=r3(k/10); C6.push([a, a]); }
{ const u=ri(1,9), d=ri(1,9); C6.push(pick([[r3(u+d/10), r3(u+d/100)],[r3(u+d/100), r3(u+d/10)]])); }
{ const u=ri(1,9), d=ri(1,8), a=-r3(u+d/10), b=-r3(u+d/10+ri(1,9)/100); C6.push(pick([[a,b],[b,a]])); }
const c6txt = ([a,b],i) => i===5 ? [F(a), F(a)+"0"] : [F(a), F(b)];
/* justification courte : on compare les distances à zéro, écrites avec autant de décimales */
const dec = x => (F(x).split(",")[1]||"").length;
const padd = (x,n) => { const t=F(Math.abs(x)), d=dec(x); return n>d ? t+(d?"":",")+"0".repeat(n-d) : t; };
const c6why = ([a,b],i) => { if(i===5) return "(un 0 à la fin de la partie décimale ne change pas le nombre)";
  if((a<0)!==(b<0)) return "(un négatif est plus petit qu'un positif)";
  if(a>0 && dec(a)===dec(b)) return "";
  const n=Math.max(dec(a),dec(b)), A=Math.abs(a), B=Math.abs(b), s=A<B?LT:A>B?GT:"=";
  return a<0 ? `(${padd(a,n)} ${s} ${padd(b,n)} : ${F(A<B?a:b)} est plus près de zéro)` : `(${padd(a,n)} ${s} ${padd(b,n)})`; };

/* ===== Exercice 7 : ranger ===== */
const u7=ri(2,8), R7a = shuf([...distinct(3, ()=>-r3(u7+ri(0,99)/100)), ...distinct(3, ()=>r3(u7+ri(0,99)/100))]);
const u8=ri(2,8), R7b = shuf([...distinct(3, ()=>-r3(u8+ri(0,99)/100)), ...distinct(4, ()=>r3(u8+ri(0,99)/100))]);

/* ===== Exercice 8 : problèmes ===== */
const VILLES = ["Briançon","Lille","Strasbourg","Brest","Grenoble","Nice","Lyon","Chamonix","Metz","Bordeaux"];
const villes = shuf(VILLES).slice(0,6);
const tv = (()=>{ const w=-ri(2,4), d=ri(1,9); return shuf([-r3(ri(60,120)/10), r3(w-d/10), r3(w-d/10-ri(1,9)/100), r3(ri(5,30)/10), ri(4,8), ri(9,14)]); })();
const villesT = villes.map((v,i)=>[v,tv[i]]);
const ALT = [["Fosse des Mariannes",-10994],["Lac Assal",-155],["Mont Blanc",4810],["Paris",35],["Mer Morte",-430],["Mont Everest",8849],["Vallée de la Mort",-86],["Puy de Dôme",1465]];
const alts = shuf(ALT).slice(0,5);
if(!alts.some(a=>a[1]<0)) alts[0]=ALT[1];

/* ===== Exercice 9 : vrai ou faux ===== */
const VF9 = [
  ()=>{ const a=ri(2,9), b=ri(a+1,15); return [`−${b} &lt; −${a}`, true, `${b} &gt; ${a} : −${b} est plus loin de zéro, donc −${b} &lt; −${a}.`]; },
  ()=>{ const d=ri(1,9); return [`−0,${d} &gt; −0,0${d}`, false, `0,${d} &gt; 0,0${d}, donc −0,${d} &lt; −0,0${d}.`]; },
  ()=>[`Un nombre strictement négatif est toujours plus petit qu'un nombre strictement positif.`, true, `il est à gauche de 0, l'autre est à droite de 0.`],
  ()=>[`0 est strictement négatif.`, false, `0 est négatif, mais pas strictement négatif.`],
  ()=>{ const a=ri(2,6), b=ri(a+1,12); return [`|−${b}| est plus petit que |−${a}|.`, false, `|−${b}| = ${b} et |−${a}| = ${a}, or ${b} &gt; ${a}.`]; },
  ()=>[`Deux nombres opposés ont la même valeur absolue.`, true, `c'est la propriété du cours : |a| = |−a|.`],
  ()=>{ const a=r3(ri(11,99)/10); return [`|−${F(a)}| = −${F(a)}`, false, `|−${F(a)}| = ${F(a)} : une valeur absolue n'est jamais négative.`]; }
].map(f=>f());

/* ===== Exercice 10 : qui suis-je ? / intercaler ===== */
const q10 = (()=>{ const a=ri(2,15), b=r3(ri(11,99)/10), c=ri(2,12), d=ri(-9,-2); return [
  [`Je suis strictement négatif et ma valeur absolue est ${a}.`, F(-a)],
  [`Je suis l'opposé de −${F(b)}.`, F(b)],
  [`Je suis à la fois positif et négatif.`, "0"],
  [`Ma valeur absolue est ${c} et je suis plus grand que 0.`, F(c)],
  [`Je suis le plus petit nombre entier relatif strictement plus grand que ${F(d)}.`, F(d+1)]]; })();
const i10 = (()=>{ const a=-ri(2,9), b=-ri(2,8)/10, c=ri(1,9), d=-ri(2,9); return [[a-1,a,F(a-0.5)],[r3(b-0.1),b,F(b-0.05)],[c,r3(c+0.1),F(c+0.05)],[d,r3(d+0.1),F(d+0.05)]]; })();

/* ===== Exercice 11 : coordonnées ===== */
const pt = (n) => { const out=[]; let g=0, onX=0, onY=0;
  while(out.length<n && g++<5000){ let x=ri(-5,5), y=ri(-4,4); const r=Math.random(); if(r<0.12 && !onY){ x=0; } else if(r<0.24 && !onX){ y=0; }
    if(Math.abs(x)+Math.abs(y)<2) continue; if(out.some(([a,b])=>Math.abs(a-x)<2 && Math.abs(b-y)<2)) continue;
    if(x===0) onY++; if(y===0) onX++; out.push([x,y]); }
  return out; };
const P11 = pt(12).map(([x,y],i)=>["ABCDEFGHIJKL"[i],x,y]);
const P11a = P11.slice(0,8), P11b = P11.slice(8).map((p,i)=>["MNPQ"[i],p[1],p[2]]);

/* ===== Exercice 12 : parallélogrammes ===== */
const par1 = (()=>{ for(let g=0; g<500; g++){ const A=[ri(-5,0),ri(-4,-1)], B=[A[0]+ri(3,6),A[1]], v=[ri(-2,3),ri(2,4)], C=[B[0]+v[0],B[1]+v[1]], D=[A[0]+v[0],A[1]+v[1]];
  if([B,C,D].every(p=>p[0]>=-5&&p[0]<=5&&p[1]>=-4&&p[1]<=4)) return {A,B,C,D}; } return {A:[-4,-2],B:[1,-2],C:[3,1],D:[-2,1]}; })();
const par2 = (()=>{ for(let g=0; g<500; g++){ const A=[ri(-4,-1),ri(1,3)], B=[ri(1,4),ri(-1,3)]; if(B[1]===0&&A[1]===0) continue; if(Math.abs(A[0]*B[1]-A[1]*B[0])<8) continue; /* pas de parallélogramme écrasé */ return {A,B,C:[-A[0],-A[1]],D:[-B[0],-B[1]]}; } return {A:[-3,2],B:[4,1],C:[3,-2],D:[-4,-1]}; })();
const C2 = p => `(${F(p[0])} ; ${F(p[1])})`;

return [
 {t:"Nombres relatifs, opposés, valeur absolue et droite graduée", e:[
  {n:"Activité 1", t:"Calculer le résultat de soustractions", w:"Sur ton cahier", h:`<p>Recopie et complète.</p>${A1h}`,
   c:`<p>Quand on enlève plus que ce que l'on a, on calcule la différence entre les deux nombres et on met le signe −.</p>${A1c}`},
  {n:"Exercice 1", t:"Les nombres relatifs dans la vie quotidienne", w:"Sur ton cahier", h:`<p>Écris le nombre relatif associé à chaque situation.</p>${sits.map(([s],i)=>`<p>${L[i]}) ${s} : ………</p>`).join("")}`,
   c:sits.map(([s,v,an],i)=>`<p>${L[i]}) ${an?"+"+v:Fs(v)}</p>`).join("")+`<p><i>En dessous du niveau 0 (sol, zéro degré, compte vide, naissance de J.-C., niveau de la mer) : nombre négatif. Au-dessus : nombre positif.</i></p>`},
  {n:"Exercice 2", t:"Nombres relatifs et températures", w:"Sur ton cahier", h:`<p>Écris la température indiquée par chaque thermomètre (en °C).</p>${thermo(th)}`,
   c:`<p>Chaque graduation vaut 1 °C.</p><p>${th.map((v,i)=>`${"ABCDEF"[i]} : ${F(v)} °C`).join(" · ")}</p>${thermo(th,true)}`},
  {n:"Exercice 3", t:"Opposé et valeur absolue", w:"Sur ton cahier", h:`<p><b>1)</b> Donne l'opposé de chacun de ces nombres.</p>${cols(op.map((v,i)=>`${L[i]}) ${Fs(v)} : ………`))}
   <p><b>2)</b> Complète.</p>${cols(ab.map((v,i)=>`${L[i]}) |${Fs(v)}| = ………`))}
   <p><b>3)</b> Vrai ou faux ? Justifie.</p>${VF3.map(([s],i)=>`<p>${L[i]}) ${s}</p>`).join("")}`,
   c:`<p><b>1)</b> L'opposé d'un nombre a la même distance à zéro, mais le signe contraire.</p><p>${op.map((v,i)=>`${L[i]}) ${F(-v||0)}`).join(" · ")}</p><p><b>2)</b> ${ab.map((v,i)=>`${L[i]}) |${Fs(v)}| = ${F(Math.abs(v))}`).join(" · ")}</p>
   <p><b>3)</b> ${VF3.map(([s,ok,why],i)=>`${L[i]}) <b>${ok?"Vrai":"Faux"}</b> : ${why}`).join(" · ")}</p>`},
  {n:"Exercice 4", t:"Positif, négatif, strictement positif, strictement négatif", w:"Sur ton cahier", h:`<p>Voici des nombres : ${e4.map(Fs).join(" ; ")}. Recopie ceux qui sont :</p><p>a) strictement positifs · b) négatifs · c) à la fois positifs et négatifs · d) ni strictement positifs, ni strictement négatifs</p>`,
   c:`<p>a) strictement positifs : ${lst(x=>x>0)}</p><p>b) négatifs : ${lst(x=>x<=0)} <i>(0 est négatif !)</i></p><p>c) à la fois positifs et négatifs : 0</p><p>d) ni strictement positifs, ni strictement négatifs : 0</p>`},
  {n:"Exercice 5", t:"Nombres relatifs décimaux et droite graduée", w:"Sur ta feuille", h:`<p><b>1)</b> Sur chacune des droites graduées, lis l'abscisse des points marqués par une lettre.</p>
   ${DR.map((d,i)=>`<p><b>Droite n°${i+1}</b></p>${drw(d)}`).join("")}
   <p><b>2)</b> Reproduis cette droite graduée et place les points ${D5b.map(([n,v])=>`${n}(${F(v)})`).join(", ")}.</p>${dg({min:-4,max:3,step:0.5})}`,
   c:`<p><b>1)</b> On cherche d'abord combien vaut une graduation.</p>
   ${DR.map((d,i)=>`<div style="break-inside:avoid"><p><b>Droite n°${i+1}</b> (une graduation = ${F(d.step)}) : ${pts4(d.v).map(([n,v])=>`${n}(${F(v)})`).join(" &nbsp; ")}</p>${drw(d,true)}</div>`).join("")}
   <p><b>2)</b> Une graduation vaut 0,5.</p>${dg({min:-4,max:3,step:0.5,pts:D5b,show:true})}`}
 ]},
 {t:"Comparer et ranger des nombres relatifs", e:[
  {n:"Activité 2", t:"Relevé de températures : ranger dans l'ordre croissant", w:"Sur ton cahier", h:`<p>Voici les températures relevées chaque matin pendant une semaine.</p>
   <div class="scroll"><table class="std"><thead><tr>${JOURS.map(j=>`<th>${j}</th>`).join("")}</tr></thead><tbody><tr>${tempsU.map(t=>`<td>${F(t)} °C</td>`).join("")}</tr></tbody></table></div>
   <p>Classe ces jours dans l'ordre croissant de leur température. Tu indiqueras les températures.</p>`,
   c:`<p>Les températures négatives d'abord (de la plus loin de zéro à la plus proche), puis les positives.</p><p>${order.map(([j,t])=>`${j} (${F(t)} °C)`).join(" &lt; ")}</p>`},
  {n:"Exercice 6", t:"Comparaison de nombres relatifs", w:"Sur ton cahier", h:`<p>Compare avec &lt;, &gt; ou =.</p>${cols(C6.map((p,i)=>{ const [x,y]=c6txt(p,i); return `${L[i]}) ${x} …… ${y}`; }))}`,
   c:`<p><i>Deux négatifs : le plus grand est celui qui a la plus petite distance à zéro.</i></p>`+C6.map((p,i)=>{ const [x,y]=c6txt(p,i); return `<p>${L[i]}) ${x} ${cmp(p[0],p[1])} ${y} <i>${c6why(p,i)}</i></p>`; }).join("")},
  {n:"Exercice 7", t:"Ranger des nombres relatifs", w:"Sur ton cahier", h:`<p><b>1)</b> Range dans l'ordre croissant : ${R7a.map(F).join(" ; ")}</p><p><b>2)</b> Range dans l'ordre décroissant : ${R7b.map(F).join(" ; ")}</p>`,
   c:`<p>Les négatifs d'abord : le plus loin de zéro est le plus petit. Puis les positifs, du plus petit au plus grand.</p><p><b>1)</b> ${sortUp(R7a).map(F).join(" &lt; ")}</p><p><b>2)</b> ${sortUp(R7b).reverse().map(F).join(" &gt; ")}</p>`},
  {n:"Exercice 8", t:"Problèmes de rangement", w:"Sur ton cahier", h:`<p><b>1)</b> Relevé de températures à 6 h : ${villesT.map(([v,t])=>`${v} ${F(t)} °C`).join(" ; ")}.</p><p>a) Quelle ville est la plus froide ? la plus chaude ?</p><p>b) Range les villes de la plus chaude à la plus froide.</p>
   <p><b>2)</b> ${alts.map(([n,a])=>`${n} : ${Fs(a)} m`).join(" ; ")}. Range ces altitudes dans l'ordre croissant, puis dis quel est le point le plus bas.</p>`,
   c:(()=>{ const s=[...villesT].sort((a,b)=>b[1]-a[1]), z=[...alts].sort((a,b)=>a[1]-b[1]);
     return `<p><b>1) a)</b> La plus froide : ${s[s.length-1][0]} (${F(s[s.length-1][1])} °C). La plus chaude : ${s[0][0]} (${F(s[0][1])} °C).</p><p><b>b)</b> ${s.map(([,t])=>F(t)).join(" &gt; ")} : ${s.map(([v])=>v).join(", ")}.</p>
     <p><b>2)</b> ${z.map(([,a])=>Fs(a)).join(" &lt; ")}</p><p>${z.map(([n])=>n).join(", ")}. Le point le plus bas est : ${z[0][0]} (${F(z[0][1])} m).</p>`; })()},
  {n:"Exercice 9", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Justifie chaque réponse.</p>${VF9.map(([s],i)=>`<p>${L[i]}) ${s}</p>`).join("")}`,
   c:VF9.map(([s,ok,why],i)=>`<p>${L[i]}) <b>${ok?"Vrai":"Faux"}</b> : ${why}</p>`).join("")},
  {n:"Exercice 10", t:"Qui suis-je ? / Intercaler", w:"Sur ton cahier", h:`<p><b>1)</b> Trouve le nombre :</p>${q10.map(([s],i)=>`<p>${L[i]}) ${s}</p>`).join("")}<p><b>2)</b> Écris un nombre relatif compris entre :</p>${cols(i10.map(([a,b],i)=>`${L[i]}) ${F(a)} et ${F(b)}`))}`,
   c:`<p><b>1)</b> ${q10.map(([,r],i)=>`${L[i]}) ${r}`).join(" · ")}</p><p><b>2)</b> Par exemple : ${i10.map(([,,m],i)=>`${L[i]}) ${m}`).join(" · ")}</p>`}
 ]},
 {t:"Repérage dans le plan", e:[
  {n:"Exercice 11", t:"Coordonnées dans un repère", w:"Sur ta feuille", h:`<div class="figs">${rep({pts:P11a})}${rep({})}</div><p>a) Indique les coordonnées des points ${P11a.map(p=>p[0]).join(", ")} (repère de gauche).</p><p>b) Dans le repère de droite, place les points ${coords(P11b).replace(/ &nbsp; /g,", ")}.</p>`,
   c:`<p>a) ${coords(P11a)}</p><div class="figs">${rep({pts:P11a, proj:P11a.filter(p=>p[1]&&p[2]).map(p=>p[0]), grads:true})}</div><p>b)</p><div class="figs">${rep({pts:P11b, grads:true})}</div>`},
  {n:"Exercice 12", t:"Repères et parallélogrammes", w:"Sur ta feuille", h:`<div class="figs">${rep({})}${rep({})}</div>
   <p><b>1)</b> Dans le repère de gauche, place A${C2(par1.A)}, B${C2(par1.B)} et C${C2(par1.C)}. Place le point D pour que ABCD soit un parallélogramme et lis ses coordonnées. Écris deux égalités de parallélisme.</p>
   <p><b>2)</b> Dans le repère de droite, place A${C2(par2.A)}, B${C2(par2.B)} et le point O, origine du repère. ABCD est un parallélogramme de centre O. Place C et D et lis leurs coordonnées. Que remarques-tu ?</p>`,
   c:`<p><b>1)</b> On fait depuis A le même déplacement que pour aller de B à C.</p><div class="figs">${rep({pts:[["A",...par1.A,-8,18],["B",...par1.B,6,18],["C",...par1.C,8,-8],["D",...par1.D,-8,-8]], poly:["A","B","C","D"], grads:true})}</div><p>D${C2(par1.D)} &nbsp; (AB) // (DC) et (AD) // (BC)</p>
   <p><b>2)</b> O est le milieu des diagonales [AC] et [BD].</p><div class="figs">${rep({pts:[["A",...par2.A],["B",...par2.B],["C",...par2.C],["D",...par2.D]].map(([n,x,y])=>[n,x,y,x<0?-8:8,y<0?18:-8]).concat([["O",0,0,6,18]]), poly:["A","B","C","D"], segs:[["A","C"],["B","D"]], grads:true})}</div><p>C${C2(par2.C)} &nbsp; D${C2(par2.D)} : les coordonnées de C sont les opposées de celles de A (et celles de D, les opposées de celles de B).</p>`}
 ]}
];
};
