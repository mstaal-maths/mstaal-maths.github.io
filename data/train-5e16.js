/* 5e · chapitre 16 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres.
   Les sacs, roues et échelles sont dessinés à partir des mêmes valeurs que la correction. */
TRAIN["5e-16"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {sac, roue, echelle, COL, COLm, Fr, D, irr, irrOnly, pct, pctEq, gcd, KC} = window.PROBA;
const lst = a => a.length===1 ? String(a[0]) : a.slice(0,-1).join(", ")+" et "+a[a.length-1];
const bagList = cnt => Object.entries(cnt).flatMap(([c,n])=>Array(n).fill(c));
const nb = (n,c) => `${n} boule${n>1?"s":""} ${n>1?COL[c][2]:COL[c][1]}`;
const cntTxt = cnt => Object.entries(cnt).filter(([,n])=>n).map(([c,n])=>nb(n,c)).join(", ").replace(/, ([^,]*)$/," et $1");
/* probabilité complète : fraction (irréductible), puis pourcentage */
const full = (a,b) => a===0 ? "0 = 0 %" : `${irr(a,b)} ${pctEq(a,b)}`;
/* étapes de la probabilité : fraction, fraction irréductible (ou 1), pourcentage */
const steps = (a,b) => { const g=gcd(a,b), s=[Fr(a,b)]; if(a===b) s.push("1"); else if(g>1) s.push(Fr(a/g,b/g)); const p=pct(a,b); s.push(p.startsWith("≈") ? "≈ <b>"+p.slice(2)+"</b>" : "<b>"+p+"</b>"); return s; };
/* une probabilité : en chaîne (une étape par ligne, « p = ») s'il y a au moins deux étapes, sinon sur la ligne */
const pBlk = (lab, a, b, bold, after="") => { const s=a===0?null:steps(a,b);
  if(!s || s.length<3) return `<p>${lab} ${bold?"<b>":""}${full(a,b)}${bold?"</b>":""}${after?" "+after:""}</p>`;
  return `<p>${lab}${after?" "+after:""}</p>${KC("p", s.map((x,i)=>i===s.length-2&&i>0&&!/</.test(x)?"<b>"+x+"</b>":x))}`; };
const DE = [["obtenir un nombre pair",[2,4,6]],["obtenir un nombre impair",[1,3,5]],["obtenir un multiple de 3",[3,6]],["obtenir un diviseur de 6",[1,2,3,6]],["obtenir un nombre inférieur à 3",[1,2]],["obtenir un nombre supérieur à 4",[5,6]],["obtenir un nombre inférieur à 5",[1,2,3,4]],["obtenir un nombre supérieur à 2",[3,4,5,6]]];

/* ===== A. Expériences aléatoires ===== */
const cA = shuf(["R","B","V","J"]).slice(0,3), nA = shuf([1, ri(2,3), ri(4,5)]), bagA = {}; cA.forEach((c,i)=>bagA[c]=nA[i]);
const totA = nA.reduce((a,b)=>a+b,0), bestA = cA[nA.indexOf(Math.max(...nA))], absent = ["R","B","V","J"].find(c=>!cA.includes(c));
const notBest = cA.filter(c=>c!==bestA);
const ev2 = shuf(DE).slice(0,2);
const ce = shuf([[`obtenir ${ri(7,12)}`,"impossible"],[`obtenir un nombre inférieur à ${ri(7,9)}`,"certain"],["obtenir un nombre pair","ni certain, ni impossible"],["obtenir 0","impossible"],["obtenir un nombre inférieur ou égal à 6","certain"]]).slice(0,3);
const secA = {t:"I — Expériences aléatoires", e:[
  {n:"Exercice 1", t:"Tirer une boule", w:"Sur ton cahier", h:`<p>Un sac opaque contient ${cntTxt(bagA)}. On tire une boule au hasard.</p>${sac(shuf(bagList(bagA)))}
   <p><b>1)</b> Combien y a-t-il d'issues possibles ?</p><p><b>2)</b> Quel est l'événement le plus probable : ${cA.map(c=>`« tirer une boule ${COL[c][1]} »`).join(", ")} ?</p><p><b>3)</b> Peut-on être certain de tirer une boule ${COL[bestA][1]} ? Peut-on tirer une boule ${COL[absent][1]} ?</p>`,
   c:`<p><b>1)</b> La boule tirée peut être ${cA.map(c=>COL[c][1]).join(", ").replace(/, ([^,]*)$/," ou $1")}.</p><p>Il y a donc <b>3 issues</b> possibles : ${cA.map(c=>`« ${COL[c][1]} »`).join(", ").replace(/, ([^,]*)$/," et $1")}.</p><p><b>2)</b> <b>« Tirer une boule ${COL[bestA][1]} »</b> : il y a ${bagA[bestA]} boules ${COL[bestA][2]}, plus que de boules des autres couleurs.</p><p><b>3)</b> <b>Non</b> : il y a aussi ${notBest.map(c=>nb(bagA[c],c)).join(" et ")}.</p><p><b>Non</b> : il n'y a pas de boule ${COL[absent][1]}, l'événement est <b>impossible</b>.</p>`},
  {n:"Exercice 2", t:"Vocabulaire", w:"Sur ton cahier", h:`<p>On lance un dé équilibré à 6 faces.</p><p><b>a)</b> Quelles sont les issues possibles ?</p><p><b>b)</b> Quelles issues réalisent l'événement « ${ev2[0][0]} » ? « ${ev2[1][0]} » ?</p><p><b>c)</b> Ces événements sont-ils certains, impossibles, ou ni l'un ni l'autre ?</p>${ce.map((e,i)=>`<p>${"123"[i]}) « ${e[0]} »</p>`).join("")}`,
   c:`<p><b>a)</b> 1, 2, 3, 4, 5, 6.</p><p><b>b)</b> ${ev2.map(e=>`« ${e[0]} » : <b>${lst(e[1])}</b>.`).join("</p><p>")}</p><p><b>c)</b> ${ce.map((e,i)=>`${"123"[i]}) <b>${e[1]}</b>`).join(" ; ")}.</p>`}
 ]};

/* ===== B. Probabilité d'un événement ===== */
/* échelle : 5 événements de probabilités bien séparées */
const rB = ri(1,4), bB = ri(1,4);
const POOL = [["un événement impossible",0,"0"],["un événement certain",1,"1"],["obtenir « face » en lançant une pièce équilibrée",1/2,"{1/2}"],[`obtenir ${ri(1,6)} en lançant un dé équilibré à 6 faces`,1/6,"{1/6} ≈ 0,17"],
  ["tirer la boule bleue dans un sac de 4 boules dont une seule est bleue",1/4,"{1/4} = 0,25"],[`tirer une boule rouge dans un sac de ${rB} rouge${rB>1?"s":""} et ${bB} bleue${bB>1?"s":""}`,rB/(rB+bB),`${irr(rB,rB+bB)}${rB===bB?"":(Number.isInteger(rB*100/(rB+bB))?" = ":" ≈ ")+D(Math.round(rB/(rB+bB)*100)/100)}`],
  ["ne pas gagner au loto",0.97,"très proche de 1"],["obtenir 10 fois de suite le 6 en lançant un dé",0.03,"très proche de 0"],["obtenir un nombre inférieur à 6 avec un dé à 6 faces",5/6,"{5/6} ≈ 0,83"]];
let evB=[]; { const P=shuf(POOL); for(const e of P){ if(evB.length<5 && evB.every(f=>Math.abs(f[1]-e[1])>0.05)) evB.push(e); } }
const LB = "ABCDE";
const de6 = shuf([...shuf(DE).slice(0,4).map(e=>[e[0],e[1].length]), [`obtenir ${ri(1,6)}`,1], [`obtenir ${ri(7,9)}`,0], ["obtenir un nombre inférieur à 7",6]]).slice(0,6);
/* sac de l'exercice 5 : total T, verte = une chance sur k */
const [T5,k5] = pick([[10,2],[12,2],[12,3],[12,4],[8,2],[8,4],[20,4],[20,5],[20,2],[10,5]]), v5=T5/k5; const r5=ri(1,T5-v5-1), b5=T5-v5-r5;
const bag5 = {R:r5,B:b5,V:v5};
/* roue de 8 secteurs */
let W; do{ const a=ri(1,4), b=ri(1,3), c=ri(1,3); W={R:a,B:b,V:c,J:8-a-b-c}; }while(W.J<1);
const wheel = shuf(["R","B","V","J"].flatMap(c=>Array(W[c]).fill(c)));
const [m6,k6] = pick([[1,4],[1,2],[3,8]].filter(([m,k])=>8*m/k!==W.J)); const need6 = 8*m6/k6;
/* deux sacs */
let a7,b7,c7,d7; do{ a7=ri(1,5); b7=ri(1,6); c7=ri(1,5); d7=ri(1,6); }while(a7*(c7+d7)===c7*(a7+b7) || a7+b7===c7+d7 || Math.round(a7*100/(a7+b7))===Math.round(c7*100/(c7+d7)));
const pA=a7/(a7+b7), pB=c7/(c7+d7), add7=ri(1,3);
const hun = pick([10,20,50,100]), nP = ri(3,8);
const secB = {t:"II — Probabilité d'un événement", e:[
  {n:"Exercice 3", t:"Échelle de probabilité", w:"Sur ton cahier", h:`<p>Reproduis l'échelle et places-y la lettre de chaque événement.</p>${evB.map((e,i)=>`<p><b>${LB[i]} :</b> ${e[0]}</p>`).join("")}${echelle([],{w:560})}`,
   c:`${echelle(evB.map((e,i)=>[LB[i],e[1]]),{w:560})}${evB.map((e,i)=>`<p>${LB[i]} : <b>${e[2]}</b></p>`).join("")}`},
  {n:"Exercice 4", t:"Probabilités avec un dé", w:"Sur ton cahier", h:`<p>On lance un dé équilibré à 6 faces.</p><p>Donne la probabilité de chaque événement sous la forme d'une fraction irréductible, puis d'un pourcentage (arrondi à l'unité si nécessaire).</p>${de6.map((e,i)=>`<p><b>${"abcdef"[i]})</b> ${e[0]}</p>`).join("")}`,
   c:de6.map((e,i)=>pBlk(`<b>${"abcdef"[i]})</b>`, e[1], 6, false, e[1]===0?"(impossible)":e[1]===6?"(certain)":"")).join("")},
  {n:"Exercice 5", t:"Un sac de boules", w:"Sur ton cahier", h:`<p>Un sac contient ${cntTxt(bag5)}. On tire une boule au hasard.</p><p><b>a)</b> Calcule la probabilité de tirer une boule rouge, une boule bleue, une boule verte.</p><p><b>b)</b> Quelle est la probabilité de ne pas tirer une boule verte ?</p><p><b>c)</b> Exprime la probabilité de tirer une boule verte avec l'expression « une chance sur … ».</p>`,
   c:`<p><b>a)</b> Il y a ${r5} + ${b5} + ${v5} = ${T5} boules.</p>${pBlk("Rouge :", r5, T5, true)}${pBlk("Bleue :", b5, T5, true)}${pBlk("Verte :", v5, T5, true)}${pBlk(`<b>b)</b> ${r5+b5} boules ne sont pas vertes :`, r5+b5, T5, true)}<p><b>c)</b> ${Fr(1,k5)} : <b>une chance sur ${["","","deux","trois","quatre","cinq"][k5]}</b>.</p>`},
  {n:"Exercice 6", t:"La roue de loterie", w:"Sur ton cahier", h:`<p>La roue est partagée en 8 secteurs identiques. La flèche fixe en haut indique le résultat.</p>${roue(wheel)}<p><b>a)</b> Quelle est la probabilité d'obtenir rouge ? bleu ? vert ? jaune ?</p><p><b>b)</b> Quelle est la probabilité d'obtenir une couleur autre que rouge ?</p><p><b>c)</b> Combien de secteurs faudrait-il colorier en jaune pour que la probabilité d'obtenir jaune soit ${Fr(m6,k6)} ?</p>`,
   c:`${["R","B","V","J"].map((c,i)=>pBlk(`${i?"":"<b>a)</b> "}${COLm[c][0].toUpperCase()+COLm[c].slice(1)} : ${W[c]} secteur${W[c]>1?"s":""} sur 8 :`, W[c], 8, true)).join("")}${pBlk(`<b>b)</b> ${8-W.R} secteurs ne sont pas rouges :`, 8-W.R, 8, true)}<p><b>c)</b> ${Fr(m6,k6)}${k6===8?"":` = ${Fr(need6,8)}`} : il faudrait <b>${need6} secteur${need6>1?"s":""} jaune${need6>1?"s":""}</b>.</p>`},
  {n:"Exercice 7", t:"Comparer des chances", w:"Sur ton cahier", h:`<p>Dans le sac A, il y a ${nb(a7,"R")} et ${nb(b7,"B")}.</p><p>Dans le sac B, il y a ${nb(c7,"R")} et ${nb(d7,"B")}.</p><div class="figs"><figure><figcaption>Sac A</figcaption>${sac(shuf(bagList({R:a7,B:b7})))}</figure><figure><figcaption>Sac B</figcaption>${sac(shuf(bagList({R:c7,B:d7})))}</figure></div><p><b>a)</b> Dans quel sac a-t-on le plus de chances de tirer une boule rouge ? Justifie par un calcul.</p><p><b>b)</b> On ajoute ${add7} boule${add7>1?"s":""} rouge${add7>1?"s":""} dans le sac A. Quelle est la nouvelle probabilité de tirer une boule rouge ?</p>`,
   c:`${[["<b>a)</b> Sac A :",a7,a7+b7,pA],["Sac B :",c7,c7+d7,pB]].map(([lab,x,t,pv])=>{ const L=[Fr(x,t)]; if(!pct(x,t).startsWith("≈")) L.push(D(pv)); L.push(pct(x,t)); return L.length<3 ? `<p>${lab} ${Fr(x,t)} ${pctEq(x,t)}.</p>` : `<p>${lab}</p>${KC("p",L)}`; }).join("")}<p>C'est dans le <b>sac ${pA>pB?"A":"B"}</b> qu'on a le plus de chances.</p>${pBlk(`<b>b)</b> Le sac A contient maintenant ${a7+add7} boules rouges sur ${a7+b7+add7} boules :`, a7+add7, a7+b7+add7, true)}`},
  {n:"Exercice 8", t:"Hasard et idées fausses", w:"Sur ton cahier", h:`<p><b>a)</b> Noé lance une pièce équilibrée et obtient ${nP} fois « face » de suite.</p><p>Il affirme : « Au prochain lancer, j'ai plus de chances d'obtenir pile. » A-t-il raison ?</p><p><b>b)</b> Un sac contient 1 boule rouge et ${hun-1} boules bleues.</p><p>Inès dit : « Je tire une boule : c'est sûr que ce sera une bleue. » Corrige son affirmation.</p>`,
   c:`<p><b>a)</b> <b>Non</b> : la pièce n'a pas de mémoire. La probabilité d'obtenir « pile » reste {1/2} à chaque lancer.</p><p><b>b)</b> Il est <b>très probable</b> de tirer une bleue (probabilité ${Fr(hun-1,hun)} = ${D((hun-1)*100/hun)} %), mais ce n'est <b>pas certain</b>.</p><p>On peut tirer la boule rouge (probabilité ${Fr(1,hun)} = ${D(100/hun)} %).</p>`}
 ]};

/* ===== C. Fréquences et probabilité ===== */
const N9 = pick([50,60,120,200]);
let eff; do{ eff=Array.from({length:5},()=>Math.round(N9/6)+ri(-Math.round(N9/25),Math.round(N9/25))); eff.push(N9-eff.reduce((a,b)=>a+b,0)); }while(eff[5]<1 || Math.abs(eff[5]-N9/6)>Math.max(2,N9/25));
const f9 = eff.map(e=>Math.round(e*100/N9));
const N10 = pick([8,10,12,16,20,24]), k10 = pick([2,4].filter(k=>N10%k===0)), m10 = k10===4?pick([1,3]):1;
const r10 = ri(3,7), b10 = ri(1,r10-1);
const T10 = pick([10,20,30,40]), R10 = ri(2,T10/2-1);
const secC = {t:"III — Fréquences et probabilité", e:[
  {n:"Exercice 9", t:"Lancers de dé", w:"Sur ton cahier", h:`<p>On a lancé ${N9} fois un dé équilibré à 6 faces. Recopie et complète le tableau (fréquences en pourcentage, arrondies à l'unité).</p><div class="scroll"><table class="std"><thead><tr><th>Face obtenue</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th>${eff.map(e=>`<td>${e}</td>`).join("")}<td></td></tr><tr><th>Fréquence</th>${eff.map(()=>"<td></td>").join("")}<td></td></tr></tbody></table></div><p>Compare ces fréquences à la probabilité théorique d'obtenir chaque face.</p>`,
   c:`<p>Fréquence = effectif ÷ ${N9}.</p><div class="scroll"><table class="std"><thead><tr><th>Face obtenue</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th>${eff.map(e=>`<td>${e}</td>`).join("")}<td><b>${N9}</b></td></tr><tr><th>Fréquence</th>${f9.map(f=>`<td><b>${f} %</b></td>`).join("")}<td><b>100 %</b></td></tr></tbody></table></div>${f9.reduce((a,b)=>a+b,0)!==100?`<p><i>Avec les arrondis, la somme des fréquences arrondies fait ${f9.reduce((a,b)=>a+b,0)} % : c'est normal.</i></p>`:""}<p>Probabilité théorique de chaque face : {1/6} ≈ 17 %.</p><p>Les fréquences observées (de ${Math.min(...f9)} % à ${Math.max(...f9)} %) sont <b>proches de 17 %</b>, sans lui être exactement égales.</p>`},
  {n:"Exercice 10", t:"Construire un sac", w:"Sur ton cahier", h:`<p><b>a)</b> Un sachet contient ${N10} bonbons. La probabilité de tirer un bonbon à la fraise est ${Fr(m10,k10)}. Combien y a-t-il de bonbons à la fraise ?</p><p><b>b)</b> Un sac contient ${nb(r10,"R")} et ${nb(b10,"B")}. Combien faut-il ajouter de boules bleues pour que la probabilité de tirer une boule bleue soit {1/2} ?</p><p><b>c)</b> Dans un sac de ${T10} boules, ${R10} sont rouges. On veut que la probabilité de tirer une rouge soit de 50 %. Combien faut-il ajouter de boules rouges ?</p>`,
   c:`<p><b>a)</b> ${N10} × ${Fr(m10,k10)} = ${N10*m10/k10} : il y a <b>${N10*m10/k10} bonbons à la fraise</b>.</p><p><b>b)</b> Il faut autant de bleues que de rouges, donc ${r10} bleues au total : on ajoute <b>${r10-b10} boule${r10-b10>1?"s":""} bleue${r10-b10>1?"s":""}</b>.</p><p><b>c)</b> Il y a ${T10-R10} boules non rouges : il faut ${T10-R10} rouges au total. On ajoute <b>${T10-2*R10} boules rouges</b> (et ${Fr(T10-R10,2*(T10-R10))} = {1/2}).</p>`}
 ]};

return [secA, secB, secC];
};
