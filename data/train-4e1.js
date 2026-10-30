/* 4e · chapitre 1 — fiche d'entraînement : les exercices de la feuille de M. Staal, avec d'autres nombres.
   Pyramides, cercles et tableaux sont produits à partir des mêmes valeurs que les corrections. */
TRAIN["4e-1"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {F, S, P, Q, cols, pyr, build, ADD, MUL, cercles, etiq, tabH} = window.REL4;
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(!v); return v; };
const L="abcdefghijklmno", NM="ABCDEFGHIJKLMNO";
const {chns}=window.CHN4;   /* calculs en chaîne « A = … » */
const sum=a=>a.reduce((x,y)=>x+y,0);
const r3=x=>Math.round(x*1000)/1000;
/* terme simplifié : « − 5 » ou « + 5 » (le premier sans « + ») */
const simp=(v,first)=>first ? F(v) : (v<0?"− ":"+ ")+F(Math.abs(v));
const simpl=arr=>arr.map((v,i)=>simp(v,i===0)).join(" ");

/* ===== Exercice 1 : températures ===== */
const T1=distinct(7,()=>ri(-25,25)/10,x=>x);
const JOURS=["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const T1s=[...T1].sort((a,b)=>a-b);

/* ===== Exercice 2 : sommes ===== */
const A2=[...distinct(5,()=>{ const s=pick([1,-1]); return [s*ri(1,12), s*ri(1,12)]; }), ...distinct(7,()=>{ let a,b; do{ a=nz(-15,15); b=nz(-15,15); }while(a*b>0||a+b===0); return [a,b]; })];

/* ===== Exercice 3 : plus de deux nombres ===== */
const A3=(()=>{ const k=ri(2,8); let v; do{ v=Array.from({length:4},()=>nz(-9,9)); }while(v.some(x=>Math.abs(x)===k) || !v.some(x=>x>0) || !v.some(x=>x<0)); const all=shuf([...v,k,-k]); return {all,k}; })();
const A3r=A3.all.filter(x=>Math.abs(x)!==A3.k), A3p=sum(A3r.filter(x=>x>0)), A3n=sum(A3r.filter(x=>x<0));

/* ===== Exercice 4 : jeu vidéo ===== */
const NOMS=["Richard","Nicolas","Jean-Baptiste","Dylan"];
const J4=(()=>{ for(let g=0;g<500;g++){ const v=NOMS.map(()=>[nz(-30,30),nz(-30,30)]); const t=v.map(x=>x[0]+x[1]); if(t.filter(x=>x===Math.max(...t)).length===1) return v; } return [[25,-18],[-2,-11],[9,-24],[-27,33]]; })();
const t4=J4.map(x=>x[0]+x[1]), w4=t4.indexOf(Math.max(...t4));
const verbe=(v,i)=>`${v>0?"gagne":"perd"} ${Math.abs(v)} point${Math.abs(v)>1?"s":""} ${i?"à la deuxième partie":"à la première partie"}`;

/* ===== Exercice 5 : pyramides additives ===== */
const PA=build([nz(-20,20),nz(-20,20),nz(-20,20)],ADD), PB=build([nz(-20,20),nz(-20,20),nz(-20,20),nz(-20,20)],ADD);
const knownB=(k,i)=>i===0 && k<3 || k===3;

/* ===== Exercice 6 : envisager tous les cas ===== */
const E6=distinct(4,()=>{ const x=ri(11,199)/10; let y; do{ y=ri(11,299)/10; }while(y===x); return [x,y,pick([0,1])]; },v=>v[0]+"|"+v[1]);

/* ===== Exercice 7 : le tarot ===== */
const TN=["Charlotte","Amandine","Marion","Estelle"];
const manche=()=>{ const w=shuf([0,1,2,3]).slice(0,2), g=[10*ri(1,6),10*ri(1,6)], l=(g[0]+g[1])/2, r=[-l,-l,-l,-l]; r[w[0]]=g[0]; r[w[1]]=g[1]; return {w,g,l,r}; };
const T7=[manche(),manche(),manche()];
const sc=k=>TN.map((_,i)=>sum(T7.slice(0,k+1).map(m=>m.r[i])));
const phr=m=>{ const lo=[0,1,2,3].filter(i=>!m.w.includes(i)); return `${TN[m.w[0]]} a gagné ${m.g[0]} points et ${TN[m.w[1]]} en a gagné ${m.g[1]}. ${TN[lo[0]]} et ${TN[lo[1]]} ont toutes les deux perdu ${m.l} points.`; };

/* ===== Exercice 8 : soustractions ===== */
const A8=distinct(6,()=>[nz(-25,25),nz(-25,25)],v=>v.join());

/* ===== Exercice 9 : cercles ===== */
const C9=(()=>{ const c=nz(-9,9); const red=[ri(1,9), ri(1,99)/10, nz(-12,12), nz(-15,-1)]; const vals=[...red, ...red.map(r=>r3(r-c))];
  /* ordre du dessin : rouges 0..3 (haut → bas-droite), bleus 4..7 (bas → haut-gauche) ; le bleu opposé au rouge i est 4+i */
  return {c, vals, known:[1,1,0,1,1,0,1,0]}; })();

/* ===== Activité 2 : cerceaux ===== */
const CER=[["jaune",7],["bleu clair",-6],["vert",5],["violet",-8],["rouge",-12],["marron",10],["bleu foncé",3]];
const joueur=()=>{ const c=shuf(CER).slice(0,3).map(([n,v])=>[n,v,ri(2,9)]); const rat=ri(0,4); return {c,rat,tot:sum(c.map(x=>x[1]*x[2]))}; };
let J1, J2; do{ J1=joueur(); J2=joueur(); }while(J1.tot===J2.tot);
const descr=J=>J.c.map(([n,,k])=>`${k} dans un cerceau ${n}`).join(", ")+(J.rat?` et ${J.rat} lancer${J.rat>1?"s":""} raté${J.rat>1?"s":""}`:"");
const nb=J=>sum(J.c.map(x=>x[2]))+J.rat;
const calcJ=J=>`${J.c.map(([,v,k])=>`${k} × ${P(v)} = ${F(k*v)}`).join(" · ")}<br>Score : ${J.c.map(([,v,k])=>P(k*v)).join(" + ")} = <b>${F(J.tot)}</b>`;

/* ===== Exercice 10 : pyramides multiplicatives ===== */
const SM=[-3,-2,-1,2,3,0.5,-0.5,-4,4];
const PM1=build([pick(SM),pick(SM),nz(-9,9)],MUL), PM2=build([nz(-4,4),nz(-4,4),pick([0.5,-0.5,1,-1]),nz(-5,5)],MUL);

/* ===== Exercice 11 : c'est toi le prof ===== */
const OPS=["+","−","×"];
const E11=(()=>{ const nbF=ri(2,5); const faux=shuf([0,1,2,3,4,5,6,7]).slice(0,nbF);
  return Array.from({length:8},(_,i)=>{ const op=OPS[i%3], a=nz(-15,15), b=nz(-12,12); const v=op==="+"?a+b:op==="−"?a-b:a*b;
    let w=v; if(faux.includes(i)){ const alt=[-v, op==="+"?a-b:a+b].filter(x=>x!==v); w=alt.length?pick(alt):v+2; }
    return {t:`${P(a)} ${op} ${P(b)}`, v, w, ok:w===v, st:op==="−"?[`${P(a)} + ${P(-b)}`]:[]}; }); })();
const nJ=E11.filter(x=>x.ok).length, nF=8-nJ, note=nJ-nF*0.5;

/* ===== Exercice 12 et 13 : simplification ===== */
const A12=distinct(4,()=>[nz(-15,15),nz(-15,15)],v=>v.join());
const A13=distinct(6,()=>[nz(-15,15),nz(-15,15)],v=>v.join());

/* ===== Exercice 14 : étiquettes égales ===== */
const E14=(()=>{ const res=distinct(4,()=>nz(-9,9),x=>x); const forme=r=>{ const t=pick([0,1,2]); const b=ri(2,15);
    if(t===0) return `${F(r+b)} − ${P(b)}`.replace(/− \(\+(\d+)\)/,"− (+$1)");
    if(t===1){ const x=ri(-90,90)/10, y=r3(r-x); return `${P(x)} + ${P(y)}`; }
    const x=ri(-90,90)/10, y=r3(x-r); return `${F(x)} − ${y<0?`(${F(y)})`:F(y)}`+(y<0?`\u0001${F(x)} + ${F(-y)}`:""); };
  const et=shuf(res.flatMap(r=>{ let a,b; do{ a=forme(r); b=forme(r); }while(a===b); return [[a,r],[b,r]]; })); return {res, et}; })();

/* ===== Exercice 15 : histoire de simplification ===== */
const H15=(()=>{ const [a,b,c]=distinct(3,()=>ri(2,15),x=>x);
  const calc=[[`${P(-a)} + ${P(b)} + ${P(-c)}`,[-a,b,-c]],[`${P(a)} + ${P(-b)} − ${P(c)}`,[a,-b,-c]],[`${P(-a)} − ${P(-b)} + ${P(c)}`,[-a,b,c]],[`${P(a)} − ${P(b)} − ${P(-c)}`,[a,-b,c]]];
  const order=shuf([0,1,2,3]); return {calc, order}; })();

/* ===== Exercice 16 : ascenseur ===== */
const E16=(()=>{ const s=ri(1,5), m=[ri(1,4), -ri(1,5), -ri(1,4), ri(1,3)]; return {s, m, f:s+sum(m)}; })();
const ETAGE=e=>e===0?"au rez-de-chaussée":e>0?`à l'étage ${e}`:`au sous-sol (étage ${F(e)})`;

return [
 {t:"L'addition de deux nombres relatifs", e:[
  {n:"Exercice 1", t:"Les températures", w:"Sur ton cahier", h:`<p>Marie a relevé les températures tous les matins durant une semaine (en °C) :</p>${tabH(JOURS,[T1.map(F)])}<p>Range ces températures dans l'ordre croissant.</p>`,
   c:`<p class="calc">${T1s.map(F).join(" &lt; ")}</p><p>${T1s.map((v,i)=>{ const j=JOURS[T1.indexOf(v)]; return i? j.toLowerCase() : j; }).join(", ")}.</p>`},
  {n:"Exercice 2", t:"Calculer des sommes", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(A2.map(([a,b],i)=>`${NM[i]} = ${P(a)} + ${P(b)}`))}`,
   c:`<p><b>Même signe :</b> on garde le signe et on additionne les distances à zéro.</p>${chns(A2.slice(0,5).map(([a,b],i)=>[NM[i],[`${P(a)} + ${P(b)}`,P(a+b)]]))}
   <p><b>Signes contraires :</b> on soustrait les distances à zéro et on prend le signe du nombre qui a la plus grande distance à zéro.</p>${chns(A2.slice(5).map(([a,b],i)=>[NM[i+5],[`${P(a)} + ${P(b)}`,P(a+b)]]))}`},
  {n:"Exercice 3", t:"Additions de plus de deux nombres relatifs", w:"Sur ton cahier", h:`<p>Calcule en regroupant les nombres positifs, puis les nombres négatifs.</p><p>Pense à rayer les nombres opposés.</p><p class="calc">A = ${A3.all.map(P).join(" + ")}</p>`,
   c:`<p>${P(A3.k)} et ${P(-A3.k)} sont opposés : on les raye.</p><p class="calc">A = ${A3.all.map(v=>Math.abs(v)===A3.k?`<s>${P(v)}</s>`:P(v)).join(" + ")}<br>A = ${[...A3r.filter(x=>x>0),...A3r.filter(x=>x<0)].map(P).join(" + ")}${A3r.length>2?`<br>A = ${[A3p,A3n].filter(x=>x).map(P).join(" + ")}`:""}<br>A = <b>${P(A3p+A3n)}</b></p>`},
  {n:"Exercice 4", t:"Jeu vidéo", w:"Sur ton cahier", h:`<p>Quatre copains jouent à un jeu vidéo.</p>${J4.map((v,i)=>`<p>${NOMS[i]} ${verbe(v[0],0)} et ${verbe(v[1],1)}.</p>`).join("")}<p><b>1)</b> Écris les quatre additions qui permettent de calculer le score de chacun.</p><p><b>2)</b> Qui a le meilleur score ?</p>`,
   c:`<p class="calc">${J4.map((v,i)=>`${NOMS[i]} : ${P(v[0])} + ${P(v[1])} = ${P(t4[i])}`).join("<br>")}</p><p>C'est <b>${NOMS[w4]}</b> qui a le meilleur score (${F(t4[w4])} point${Math.abs(t4[w4])>1?"s":""}).</p>`},
  {n:"Exercice 5", t:"Les pyramides additives", w:"Sur ton cahier", h:`<p>Dans chaque brique, le nombre à inscrire est la <b>somme</b> des nombres des deux briques du dessous. Recopie et complète chaque pyramide.</p><div class="figs"><div><p><b>a.</b></p>${pyr(PA)}</div><div><p><b>b.</b></p>${pyr(PB,knownB)}</div></div>`,
   c:`<p><b>a.</b> ${PA.slice(1).flatMap((row,k)=>row.map((v,i)=>`${F(PA[k][i])} + ${Q(PA[k][i+1])} = ${F(v)}`)).join(" · ")}</p>${pyr(PA,undefined,true)}<p><b>b.</b> On cherche le nombre qui manque dans chaque somme, en partant du haut :</p><p>${[[2,0],[1,0],[1,1],[0,0],[0,1],[0,2]].map(([k,i])=>`${F(PB[k][i])} + … = ${F(PB[k+1][i])}, donc … = ${F(PB[k][i+1])}`).join(" · ")}</p>${pyr(PB,knownB,true)}`},
  {n:"Exercice 6", t:"Envisager tous les cas", w:"Sur ton cahier", h:`<p>Les signes des nombres ont été remplacés par ■. Retrouve les signes en envisageant tous les cas possibles.</p>${cols(E6.map(([x,y,m],i)=>`${L[i]}. ■${F(x)} + (■${F(y)}) = ■${F(m?x+y:Math.abs(x-y))}`))}`,
   c:E6.map(([x,y,m],i)=>{ const r=m?x+y:Math.abs(x-y); return m?`<p><b>${L[i]}.</b> ${F(x)} + ${F(y)} = ${F(r)} : même signe.</p><p class="calc">+${F(x)} + (+${F(y)}) = +${F(r)} &nbsp; ou &nbsp; −${F(x)} + (−${F(y)}) = −${F(r)}</p>`
      : `<p><b>${L[i]}.</b> ${F(Math.max(x,y))} − ${F(Math.min(x,y))} = ${F(r)} : signes contraires.</p><p class="calc">+${F(x)} + (−${F(y)}) = ${S(x-y)} &nbsp; ou &nbsp; −${F(x)} + (+${F(y)}) = ${S(y-x)}</p>`; }).join("")},
  {n:"Exercice 7", t:"Le tarot", w:"Sur ton cahier", h:`<p>Charlotte, Amandine, Marion et Estelle jouent au tarot. La somme des scores doit toujours être égale à 0.</p><p>À la première partie : ${phr(T7[0])}</p>${tabH(TN,[sc(0).map(S),TN.map(()=>"&nbsp;"),TN.map(()=>"&nbsp;")])}
   <p><b>1)</b> À la deuxième partie : ${phr(T7[1])} Écris leur nouveau score sur la 2<sup>e</sup> ligne.</p><p><b>2)</b> À la troisième partie : ${phr(T7[2])} Écris leur nouveau score sur la 3<sup>e</sup> ligne.</p>`,
   c:`<p><b>1)</b> ${TN.map((n,i)=>`${n} : ${P(sc(0)[i])} + ${P(T7[1].r[i])} = ${S(sc(1)[i])}`).join(" · ")}</p><p><b>2)</b> ${TN.map((n,i)=>`${n} : ${P(sc(1)[i])} + ${P(T7[2].r[i])} = ${S(sc(2)[i])}`).join(" · ")}</p>${tabH(TN,[0,1,2].map(k=>sc(k).map(S)))}<p>Vérification : ${sc(2).map(P).join(" + ")} = 0.</p>`}
 ]},
 {t:"La soustraction de deux nombres relatifs", e:[
  {n:"Exercice 8", t:"Entraînement aux soustractions", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(A8.map(([a,b],i)=>`${NM[i]} = ${P(a)} − ${P(b)}`))}`,
   c:`<p>Soustraire un nombre, c'est ajouter son opposé.</p>${chns(A8.map(([a,b],i)=>[NM[i],[`${P(a)} − ${P(b)}`,`${P(a)} + ${P(-b)}`,F(a-b)]]))}`},
  {n:"Exercice 9", t:"Les cercles", w:"Sur ton cahier", h:`<p>Un nombre écrit dans un cercle rouge <b>moins</b> le nombre écrit dans le cercle bleu diamétralement opposé doit donner ${F(C9.c)}.</p><p>Exemple : ${F(C9.vals[0])} − ${Q9(C9.vals[4])} = ${F(C9.c)}.</p><p>Trouve les nombres des cercles vides.</p>${cercles(C9.c,C9.vals,C9.known)}`,
   c:`<p class="calc">Cercle rouge en face de ${F(C9.vals[6])} : … − ${Q9(C9.vals[6])} = ${F(C9.c)}, donc … = ${F(C9.vals[2])} car ${F(C9.vals[2])} − ${Q9(C9.vals[6])} = ${F(C9.vals[2])} + ${Q9(-C9.vals[6])} = ${F(C9.c)}.<br>Cercle bleu en face de ${F(C9.vals[1])} : ${F(C9.vals[1])} − … = ${F(C9.c)}, donc … = ${F(C9.vals[5])} car ${F(C9.vals[1])} − ${Q9(C9.vals[5])} = ${F(C9.vals[1])} + ${Q9(-C9.vals[5])} = ${F(C9.c)}.<br>Cercle bleu en face de ${F(C9.vals[3])} : ${F(C9.vals[3])} − … = ${F(C9.c)}, donc … = ${F(C9.vals[7])} car ${F(C9.vals[3])} − ${Q9(C9.vals[7])} = ${F(C9.vals[3])} + ${Q9(-C9.vals[7])} = ${F(C9.c)}.</p>${cercles(C9.c,C9.vals,C9.known,true)}`}
 ]},
 {t:"La multiplication de deux nombres relatifs", e:[
  {n:"Activité 2", t:"Jeu du lancer de cerceaux", w:"Sur ton cahier", h:`<p>Cerceaux : marron +10 ; violet −8 ; jaune +7 ; vert +5 ; bleu clair −6 ; bleu foncé +3 ; rouge −12.</p><p>On fait la somme de tous les points pour avoir le score final.</p><p>Juliette a lancé <b>${nb(J1)} balles</b> : ${descr(J1)}.</p><p>Alexis a lancé <b>${nb(J2)} balles</b> : ${descr(J2)}.</p><p>Lequel des deux a gagné la partie ?</p>`,
   c:`<p>Juliette : ${calcJ(J1)}</p><p>Alexis : ${calcJ(J2)}</p><p>${J1.tot>J2.tot?`${F(J1.tot)} &gt; ${F(J2.tot)} : c'est <b>Juliette</b> qui a gagné.`:`${F(J2.tot)} &gt; ${F(J1.tot)} : c'est <b>Alexis</b> qui a gagné.`}</p>`},
  {n:"Exercice 10", t:"Les pyramides multiplicatives", w:"Sur ton cahier", h:`<p>Dans chaque brique, le nombre à inscrire est le <b>produit</b> des nombres des deux briques du dessous. Recopie et complète chaque pyramide.</p><div class="figs"><div><p><b>a.</b></p>${pyr(PM1)}</div><div><p><b>b.</b></p>${pyr(PM2)}</div></div>`,
   c:`<p><b>a.</b> ${PM1[1].map((v,i)=>`${P(PM1[0][i])} × ${P(PM1[0][i+1])} = ${F(v)}`).join(" · ")} · ${P(PM1[1][0])} × ${P(PM1[1][1])} = ${F(PM1[2][0])}</p>${pyr(PM1,undefined,true)}<p><b>b.</b> ${PM2.slice(1).flatMap((row,k)=>row.map((v,i)=>`${P(PM2[k][i])} × ${P(PM2[k][i+1])} = ${F(v)}`)).join(" · ")}</p>${pyr(PM2,undefined,true)}`},
  {n:"Exercice 11", t:"C'est toi le prof !", w:"Sur ton cahier", h:`<p>Lila obtient 1 point par bonne réponse, 0 point sans réponse et −0,5 point par réponse fausse. Voici sa copie :</p><div class="scroll"><table class="std"><tbody>${E11.map((x,i)=>`<tr><th>${L[i]}.</th><td>${x.t} = ${F(x.w)}</td></tr>`).join("")}</tbody></table></div><p><b>1)</b> Corrige sa copie.</p><p><b>2)</b> Calcule sa note.</p>`,
   c:`<p><b>1)</b> ${E11.map((x,i)=>`${L[i]}. ${x.ok?"juste":"faux"}`).join(" · ")}</p><p>Les calculs corrigés :</p>${chns(E11.map((x,i)=>[NM[i],[x.t,...x.st,F(x.v)],x.ok]).filter(x=>!x[2]))}<p><b>2)</b> ${nJ} bonne${nJ>1?"s":""} réponse${nJ>1?"s":""} et ${nF} réponse${nF>1?"s":""} fausse${nF>1?"s":""} : ${nJ} × 1 + ${nF} × (−0,5) = ${F(nJ)} + ${P(-nF*0.5)} = <b>${F(note)}</b> point${Math.abs(note)>1?"s":""} sur 8.</p>`}
 ]},
 {t:"Simplification d'écriture", e:[
  {n:"Exercice 12", t:"Simplification", w:"Sur ton cahier", h:`<p>Simplifie, puis calcule.</p>${cols(A12.map(([a,b],i)=>`${NM[i]} = ${P(a)} + ${P(b)}`))}`,
   c:chns(A12.map(([a,b],i)=>[NM[i],[`${P(a)} + ${P(b)}`,simpl([a,b]),F(a+b)]]))},
  {n:"Exercice 13", t:"Déjà simplifiées", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(A13.map((v,i)=>`${NM[i]} = ${simpl(v)}`))}`,
   c:chns(A13.map((v,i)=>[NM[i],[simpl(v),F(v[0]+v[1])]]))},
  {n:"Exercice 14", t:"Étiquettes égales", w:"Sur ton cahier", h:`<p>Regroupe les étiquettes qui ont le même résultat.</p>${etiq(E14.et.map((x,i)=>NM[i]+" = "+x[0].split("\u0001")[0]))}`,
   c:`${chns(E14.et.map(([t,r],i)=>[NM[i],[...t.split("\u0001"),F(r)]]))}${E14.res.map(r=>`<p>Égales à ${F(r)} : ${E14.et.map((x,i)=>x[1]===r?NM[i]:"").filter(x=>x).join(" et ")}.</p>`).join("")}`},
  {n:"Exercice 15", t:"Histoire de simplification", w:"Sur ton cahier", h:`<p>Associe chaque calcul à son écriture simplifiée, puis effectue chaque calcul.</p>${tabH(["Calcul","Écriture simplifiée"],H15.calc.map((c,i)=>[`${L[i]}. ${NM[i]} = ${c[0]}`,`(${i+1}) ${simpl(H15.calc[H15.order[i]][1])}`]))}`,
   c:`<p>Associations : ${H15.calc.map((c,i)=>`${L[i]} va avec (${H15.order.indexOf(i)+1})`).join(", ")}.</p>${chns(H15.calc.map((c,i)=>[NM[i],[c[0],simpl(c[1]),simpl([c[1][0]+c[1][1],c[1][2]]),F(sum(c[1]))]]))}`},
  {n:"Exercice 16", t:"L'ascenseur fou", w:"Sur ton cahier", h:`<p>Maïna est à l'étage ${E16.s}. Elle appuie sur le bouton RDC (rez-de-chaussée, étage 0).</p><p>L'ascenseur monte de ${E16.m[0]} étage${E16.m[0]>1?"s":""}, puis descend de ${-E16.m[1]} et encore de ${-E16.m[2]}, pour enfin monter de ${E16.m[3]}.</p><p>Maïna va-t-elle se retrouver au rez-de-chaussée ?</p>`,
   c:`<p class="calc">${simpl([E16.s,...E16.m])} = ${F(E16.f)}</p><p>${E16.f===0?"Oui : Maïna se retrouve à l'étage 0, au <b>rez-de-chaussée</b>.":`Non : Maïna se retrouve <b>${ETAGE(E16.f)}</b>.`}</p>`}
 ]}
];
function Q9(v){ return r3(v)<0?`(${F(v)})`:F(v); }
};
