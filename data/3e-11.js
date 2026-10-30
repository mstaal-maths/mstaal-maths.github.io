/* 3e — Chapitre 11 : Statistiques (cours « Statistiques (fréquence, moyenne, médiane et étendue) » et fiche d'exercices de M. Staal,
   dossier « 12 - Statistiques »). Le dossier « 17 - Statistiques » (population, caractère, diagrammes : niveau 5e) n'est pas repris.
   Tous les diagrammes en bâtons et les histogrammes sont dessinés en SVG à partir des valeurs exactes.
   La fiche n'a pas de corrigé (sauf deux sujets de brevet) : les corrections ont été calculées et vérifiées. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F=(a,b)=>`{${a}/${b}}`;
const irr=(a,b)=>{ const g=gcd(a,b); return b/g===1?String(a/g):F(a/g,b/g); };
const sum=a=>a.reduce((x,y)=>x+y,0);
const sortN=a=>[...a].sort((x,y)=>x-y);
const tab=(head, rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* tableau d'effectifs horizontal : [titre ligne 1, valeurs…], [titre ligne 2, effectifs…] */
const te=(r1,r2,r3)=>`<div class="scroll"><table class="std"><tbody>${[r1,r2,r3].filter(Boolean).map(r=>`<tr><th>${r[0]}</th>${r.slice(1).map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const T=(x,y,t,st="",a="middle")=>`<text x="${x}" y="${y}" text-anchor="${a}" style="font-size:15px;fill:var(--ink);${st}">${t}</text>`;
const BAR="#c0392b", HIS=["#f7c59f","#f19a8b","#a9d18e","#9fc5e8","#c9a0dc","#ffd966","#9fd4d0"];

/* ------------------------------------------------------------------
   Diagramme en bâtons : vals (étiquettes de l'axe horizontal), eff
------------------------------------------------------------------ */
function batons(o){
  const {vals, eff, title="", xlab="", ylab="Effectif", w=460, H=280} = o;
  const ymax=o.ymax||Math.ceil((Math.max(...eff)+1)/(o.ystep||1))*(o.ystep||1), ystep=o.ystep||1, ylabStep=o.ylabStep||(ymax>10?5:ystep);
  const ml=56, mr=18, mt=(title?40:20)+(o.show?14:0), mb=xlab?58:36, pw=w-ml-mr, ph=H-mt-mb, n=vals.length, slot=pw/n;
  const Y=v=>mt+ph-v/ymax*ph;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Diagramme en bâtons${title?" : "+title:""}">`;
  if(title) s+=T(ml+pw/2, 22, title, "font-weight:700;font-size:16px");
  for(let k=0;k<=Math.round(ymax/ystep);k++){ const v=rd(k*ystep), y=Y(v).toFixed(1), big=Math.abs(v/ylabStep-Math.round(v/ylabStep))<1e-9;
    s+=`<line x1="${ml}" y1="${y}" x2="${ml+pw}" y2="${y}" class="gridl"${big?"":' style="stroke-width:.6"'}/>`; if(big) s+=T(ml-8, +y+5, N(v), "", "end"); }
  if(ylab) s+=T(ml-4, mt-8, ylab, "font-weight:700", "start");
  eff.forEach((v,i)=>{ const x=(ml+slot*(i+.5)).toFixed(1); s+=`<line x1="${x}" y1="${Y(0)}" x2="${x}" y2="${Y(v).toFixed(1)}" style="stroke:${BAR};stroke-width:7"/>`;
    if(o.show) s+=T(x, (Y(v)-7).toFixed(1), N(v), "fill:var(--c);font-weight:700"); s+=T(x, Y(0)+22, vals[i]); });
  s+=`<line x1="${ml}" y1="${mt-4}" x2="${ml}" y2="${Y(0)}" class="axe2"/><line x1="${ml}" y1="${Y(0)}" x2="${ml+pw}" y2="${Y(0)}" class="axe2"/>`;
  if(xlab) s+=T(ml+pw/2, H-10, xlab, "font-weight:700");
  return s+"</svg>";
}
/* ------------------------------------------------------------------
   Histogramme : bornes b[0] < b[1] < …, eff (une valeur par classe)
------------------------------------------------------------------ */
function histo(o){
  const {b, eff, title="", xlab="", ylab="Effectif", w=460, H=290} = o;
  const ystep=o.ystep||1, ymax=o.ymax||Math.ceil((Math.max(...eff)+1)/ystep)*ystep, ylabStep=o.ylabStep||(ymax>10?(ymax>20?5:2):ystep);
  const ml=56, mr=24, mt=(title?40:22)+(o.show?14:0), mb=xlab?58:36, pw=w-ml-mr, ph=H-mt-mb, x0=b[0], x1=b[b.length-1], xs=o.xstep||(b[1]-b[0]);
  const X=x=>ml+(x-x0)/(x1-x0)*pw, Y=v=>mt+ph-v/ymax*ph;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Histogramme${title?" : "+title:""}">`;
  if(title) s+=T(ml+pw/2, 22, title, "font-weight:700;font-size:16px");
  for(let k=0;k<=Math.round(ymax/ystep);k++){ const v=rd(k*ystep), y=Y(v).toFixed(1), big=Math.abs(v/ylabStep-Math.round(v/ylabStep))<1e-9;
    s+=`<line x1="${ml}" y1="${y}" x2="${X(x1)}" y2="${y}" class="gridl"${big?"":' style="stroke-width:.6"'}/>`; if(big) s+=T(ml-8, +y+5, N(v), "", "end"); }
  eff.forEach((v,i)=>{ const xa=X(b[i]), xb=X(b[i+1]); if(v>0) s+=`<rect x="${xa.toFixed(1)}" y="${Y(v).toFixed(1)}" width="${(xb-xa).toFixed(1)}" height="${(Y(0)-Y(v)).toFixed(1)}" style="fill:${HIS[i%HIS.length]};stroke:#1b2a44;stroke-width:1.6"/>`;
    if(o.show) s+=T(((xa+xb)/2).toFixed(1), (Y(v)-7).toFixed(1), N(v), "fill:var(--c);font-weight:700"); });
  for(let x=x0; x<=x1+1e-9; x=rd(x+xs)) s+=T(X(x).toFixed(1), Y(0)+22, N(x));
  if(ylab) s+=T(ml-4, mt-8, ylab, "font-weight:700", "start");
  s+=`<line x1="${ml}" y1="${mt-4}" x2="${ml}" y2="${Y(0)}" class="axe2"/><line x1="${ml}" y1="${Y(0)}" x2="${X(x1)+8}" y2="${Y(0)}" class="axe2"/>`;
  if(xlab) s+=T(ml+pw/2, H-10, xlab, "font-weight:700");
  return s+"</svg>";
}

/* ---------- textes de correction ---------- */
/* série rangée « 4 ≤ 6 ≤ 7 … » */
const range=v=>sortN(v).map(x=>N(x)).join(" ≤ ");
/* médiane d'une liste, avec l'explication du cours */
function medList(v){ const s=sortN(v), n=s.length;
  if(n%2){ const p=(n+1)/2, m=s[p-1]; return {m, txt:`<p>L'effectif total est ${n}, donc impair. ${n} ÷ 2 = ${N(n/2)} : la médiane est la ${p}<sup>e</sup> valeur.</p><p class="calc">${range(v)}</p><p>La ${p}<sup>e</sup> valeur est ${N(m)} : la médiane est <b>${N(m)}</b>.</p>`}; }
  const p=n/2, a=s[p-1], b=s[p], m=(a+b)/2; return {m, txt:`<p>L'effectif total est ${n}, donc pair. ${n} ÷ 2 = ${p} : je repère la ${p}<sup>e</sup> et la ${p+1}<sup>e</sup> valeur.</p><p class="calc">${range(v)}</p><p>${a===b?`Ces deux valeurs valent ${N(a)} : la médiane est <b>${N(m)}</b>.`:`{${N(a)} + ${N(b)}/2} = ${N(m)} : la médiane est <b>${N(m)}</b>.`}</p>`}; }
/* médiane à partir d'un tableau d'effectifs (valeurs croissantes) */
function medTab(vals, eff, unit=""){ const n=sum(eff), cum=[]; eff.reduce((a,e,i)=>(cum[i]=a+e),0);
  const at=k=>vals[cum.findIndex(c=>c>=k)];
  const ranks=n%2?[(n+1)/2]:[n/2,n/2+1], need=ranks[ranks.length-1];
  let lines=[], acc=0; for(let i=0;i<vals.length;i++){ const prev=acc; acc+=eff[i]; if(i>0) lines.push(`${prev} + ${eff[i]} = ${acc} : il y a ${acc} valeurs inférieures ou égales à ${N(vals[i])}${unit}.`); else lines.push(`Il y a ${acc} valeur${acc>1?"s":""} égale${acc>1?"s":""} à ${N(vals[0])}${unit}.`); if(acc>=need) break; }
  const m=ranks.length===1?at(ranks[0]):(at(ranks[0])+at(ranks[1]))/2;
  const head=n%2?`L'effectif total est ${n}, donc impair. ${n} ÷ 2 = ${N(n/2)} : la médiane est la ${ranks[0]}<sup>e</sup> valeur.`:`L'effectif total est ${n}, donc pair. ${n} ÷ 2 = ${n/2} : je repère la ${ranks[0]}<sup>e</sup> et la ${ranks[1]}<sup>e</sup> valeur.`;
  const end=ranks.length===1?`La ${ranks[0]}<sup>e</sup> valeur est ${N(m)}${unit} : la médiane est <b>${N(m)}${unit}</b>.`:(at(ranks[0])===at(ranks[1])?`La ${ranks[0]}<sup>e</sup> et la ${ranks[1]}<sup>e</sup> valeur valent ${N(at(ranks[0]))}${unit} : la médiane est <b>${N(m)}${unit}</b>.`:`La ${ranks[0]}<sup>e</sup> valeur est ${N(at(ranks[0]))} et la ${ranks[1]}<sup>e</sup> est ${N(at(ranks[1]))} : {${N(at(ranks[0]))} + ${N(at(ranks[1]))}/2} = ${N(m)}. La médiane est <b>${N(m)}${unit}</b>.`);
  return {m, n, txt:`<p>${head}</p>${lines.map(l=>`<p>${l}</p>`).join("")}<p>${end}</p>`}; }
/* moyenne d'un tableau d'effectifs */
const meanTab=(vals,eff)=>{ const n=sum(eff), S=sum(vals.map((v,i)=>v*eff[i])); return {n, S, m:S/n, txt:`{${vals.map((v,i)=>`${eff[i]} × ${N(v)}`).join(" + ")}/${n}} = {${N(S)}/${n}}`,
  /* le même calcul en chaîne : une étape par ligne */
  ch:(nm="M")=>`${nm} = {${vals.map((v,i)=>`${eff[i]} × ${N(v)}`).join(" + ")}/${n}}<br>${nm} = {${N(S)}/${n}}`}; };
window.STAT3={N, F, irr, gcd, sum, sortN, tab, te, batons, histo, range, medList, medTab, meanTab, rd};

/* ===================== données du cours et de la fiche ===================== */
const AGES=[10,11,11,10,11,11,13,11,11,14,13,13,12,11,14,12,11,13,14,14];
const C1=[18,18,7,6,16,18,7,4,10,11,10,18];
const C2v=[9,11,12,12.5,14,15], C2e=[6,7,6,3,5,2];
const POUL=[47,50,44,48,54,45,51,47,46,52,43,49,51,47,53,49];
const ATT={vals:[1,2,3,4,5,6,7], eff:[4,9,13,11,9,3,1]};
const NOTES={vals:[5,8,10,12,13,15,18], eff:[2,3,1,5,9,4,3]};
const H_POUL=histo({b:[40,45,50,55], eff:[2,8,6], xlab:"Masse (en kg)", ymax:8, ystep:1, ylabStep:2, w:420});
const NOIX=[28,30,34,35,30,36,33,37,28,31,32,37,29,36,37,36,35,31,35,37,36,31,31,36,35,37,36,32,37,35,30,34,36,30,37,33,31,34,30,37,33,32,31,33,34,31,29,36,37,35];
const VG=[42,43,40,47,44,48,35,39,53,30,36,46,56,30,40,39,46,39,58,43,61,44,51,44,27,39,41,53,30,34,46,45,46];
const LP=[3.45,5.2,5.35,4.3,6.1,4.28,5.18,4.9,6.21,5.36,5.22,4.9,3.95,4.72,5.5,6.13,5.6,4.19,4.75,5.04,4.88,5.6,6.04,5.43];
const SMS=[1,1,2,3,4,8,25,7,5,6,40,20,2,2,1,20];
const lst=(v,sep=" – ")=>v.map(x=>N(x)).join(sep);
const cls=(v,a,w,n)=>Array.from({length:n},(_,i)=>v.filter(x=>x>=a+i*w&&x<a+(i+1)*w).length);

/* ===================== schémas ===================== */
const S_FREQ=sch("La fréquence", `<p class="calc">fréquence = {effectif de la valeur/effectif total}</p><p class="schN">4 élèves sur 20 ont 14 ans : {4/20} = 0,2 = 20 %. Une fréquence est comprise entre 0 et 1.</p>`);
const S_ET=sch("L'étendue", `<p class="calc">étendue = valeur maximale − valeur minimale</p><p class="schN">Âges de 10 à 14 ans : 14 − 10 = 4. Plus l'étendue est grande, plus la série est dispersée.</p>`);
const S_MOY=sch("La moyenne", `<p class="calc">M = {somme des valeurs/effectif total}</p><p>Avec un tableau :</p><p class="calc">M = {2 × 10 + 8 × 11 + 2 × 12 + 4 × 13 + 4 × 14/20}<br>M = {240/20}<br>M = 12</p>`);
const S_MED=sch("La médiane", `<p class="schN">On range les valeurs dans l'ordre croissant.</p><p class="schN">Effectif impair (29) : 29 ÷ 2 = 14,5 → la 15<sup>e</sup> valeur.</p><p class="schN">Effectif pair (12) : 12 ÷ 2 = 6 → la moyenne de la 6<sup>e</sup> et de la 7<sup>e</sup> valeur.</p><p class="schN">Il y a autant de valeurs inférieures ou égales à la médiane que de valeurs supérieures ou égales.</p>`);
const S_HIS=sch("Classes et histogramme", `${histo({b:[40,45,50,55], eff:[2,8,6], xlab:"Masse (en kg)", ymax:8, ystep:2, w:300, H:220, show:true})}<p class="schN">« 45 ≤ m &lt; 50 » : 45 inclus, 50 exclu. Les barres sont accolées ; leurs hauteurs sont proportionnelles aux effectifs.</p>`);

/* ---------- générateurs du QCM ---------- */
const serie=(n,lo,hi)=>Array.from({length:n},()=>ri(lo,hi));

CH["3e-11"] = {
intro:"Lire une série statistique (liste ou tableau d'effectifs), calculer une fréquence, l'étendue, la moyenne et la médiane, les interpréter, et regrouper des données en classes pour construire un histogramme.",
savoir:[
  "lire une série statistique donnée sous forme de liste ou de tableau d'effectifs ;",
  "calculer la fréquence d'une valeur ;",
  "calculer et interpréter l'étendue d'une série ;",
  "calculer et interpréter la moyenne d'une série ;",
  "déterminer et interpréter la médiane d'une série (effectif pair ou impair) ;",
  "regrouper des données en classes et les représenter par un histogramme."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Une série statistique", h:`
  <h4>a) Série statistique sous forme de liste</h4>
  <div class="retenir" data-l="Définition"><p>Une série statistique peut être donnée sous forme d'une <b>liste</b> : les données y sont indiquées sans être classées ni regroupées.</p></div>
  <p><b>Exemple 1 :</b> on a demandé à 20 élèves d'un collège leur âge. Voici les résultats obtenus :</p><p class="calc" style="white-space:normal">${lst(AGES)}</p>
  <h4>b) Série statistique sous forme d'un tableau d'effectifs</h4>
  <div class="retenir" data-l="Définition"><p>La plupart du temps, il y a beaucoup de données à traiter. Elles sont alors souvent données dans un <b>tableau d'effectifs</b> : les valeurs sont rangées dans l'ordre croissant et on indique l'effectif de chaque valeur.</p><p>C'est donc plus facile à lire.</p></div>
  <p><b>Exemple 1 :</b> on reprend la série des âges des élèves, qu'on présente dans un tableau.</p>${te(["Âge des élèves","10","11","12","13","14"],["Effectifs","2","8","2","4","4"])}`},
{k:"II", t:"La fréquence d'une valeur", h:`
  <div class="retenir" data-l="Définition"><p>La <b>fréquence</b> d'une valeur est la proportion d'apparition de cette valeur dans la série :</p><p class="calc">fréquence = {effectif de la valeur/effectif total}</p><p>Une fréquence est un <b>nombre compris entre 0 et 1</b>. Elle peut être donnée en écriture fractionnaire, en écriture décimale ou en pourcentage.</p></div>
  <p><b>Exemple 1 :</b> 4 élèves sur les 20 au total ont 14 ans.</p><p>Donc la fréquence des élèves qui ont 14 ans dans la série est {4/20} (ou 0,2 ou 20 %).</p>`},
{k:"III", t:"Indicateur de dispersion : l'étendue", h:`
  <div class="retenir" data-l="Définition"><p>L'<b>étendue</b> est la différence entre la valeur maximale et la valeur minimale de la série.</p></div>
  <p><b>Exemple 1 :</b> l'âge le plus haut est 14, l'âge le plus bas est 10.</p><p class="calc">14 − 10 = 4</p><p>L'étendue est donc de 4 : il y a 4 ans d'écart entre le plus jeune et le plus âgé des élèves interrogés. La série n'est pas très dispersée.</p>`},
{k:"IV", t:"Indicateur de position : la moyenne", h:`
  <div class="retenir" data-l="Définition"><p>La <b>moyenne</b> d'une série statistique est le nombre obtenu :</p><ul><li>en additionnant toutes les valeurs ;</li><li>puis en divisant cette somme par l'effectif total de la série.</li></ul></div>
  <p><b>Exemple 1 :</b></p><p class="calc" style="white-space:normal">M = {${AGES.join(" + ")}/20}</p><p class="calc">M = {240/20}<br>M = 12</p>
  <p>Ou, <b>avec le tableau</b> (méthode plus rapide) :</p><p class="calc">M = {2 × 10 + 8 × 11 + 2 × 12 + 4 × 13 + 4 × 14/20}<br>M = {240/20}<br>M = 12</p>
  <p>En moyenne, les élèves interrogés ont 12 ans.</p>
  <div class="retenir" data-l="Interprétation"><p>La somme des âges aurait été la même si chaque élève avait eu 12 ans.</p></div>`},
{k:"V", t:"Indicateur de position : la médiane", h:`
  <div class="retenir" data-l="Définition"><p>Les valeurs de la série sont rangées dans l'ordre croissant.</p><ul><li>Si l'<b>effectif total</b> est <b>impair</b>, la médiane est « la valeur centrale » de la série.</li><li>Si l'<b>effectif total</b> est <b>pair</b>, on additionne « les deux valeurs centrales » de la série, puis on divise cette somme par 2.</li></ul></div>
  <h4>L'effectif total est impair</h4>
  <p><b>Exemple :</b> dans la classe n° 2, le professeur d'allemand a corrigé l'évaluation de ses 29 élèves. Voici les notes qu'il a attribuées sur 20 :</p>
  <p><b>Avec une série :</b></p><p class="calc" style="white-space:normal">9 – 12 – 12,5 – 9 – 15 – 11 – 11 – 12 – 14 – 14 – 15 – 11 – 11 – 11 – 11 – 9 – 12,5 – 12,5 – 14 – 11 – 9 – 9 – 9 – 12 – 12 – 12 – 12 – 14 – 14</p>
  <p><b>1)</b> L'effectif total est 29, donc impair. 29 ÷ 2 = 14,5 : la médiane sera la 15<sup>e</sup> note (arrondi supérieur).</p>
  <p><b>2)</b> On range les valeurs dans l'ordre croissant :</p><p class="calc" style="white-space:normal">9 ≤ 9 ≤ 9 ≤ 9 ≤ 9 ≤ 9 ≤ 11 ≤ 11 ≤ 11 ≤ 11 ≤ 11 ≤ 11 ≤ 11 ≤ 12 ≤ <b>12</b> ≤ 12 ≤ 12 ≤ 12 ≤ 12 ≤ 12,5 ≤ 12,5 ≤ 12,5 ≤ 14 ≤ 14 ≤ 14 ≤ 14 ≤ 14 ≤ 15 ≤ 15</p>
  <p>La 15<sup>e</sup> note de la série est 12. La médiane est donc égale à <b>12</b>.</p>
  <p><b>Avec un tableau d'effectifs :</b></p>${te(["Notes",...C2v.map(x=>N(x)),"Total"],["Effectifs",...C2e.map(String),"29"])}
  <p><b>1)</b> L'effectif total est 29, donc impair. 29 ÷ 2 = 14,5 : la médiane sera la 15<sup>e</sup> note.</p><p><b>2)</b> 6 + 7 = 13 : il y a 13 notes inférieures ou égales à 11.</p><p>13 + 6 = 19 : il y a 19 notes inférieures ou égales à 12.</p><p>La 15<sup>e</sup> note de la série est donc 12. La médiane est égale à <b>12</b>.</p>
  <div class="retenir" data-l="Interprétation"><p>Dans la classe n° 2, il y a autant d'élèves qui ont une note inférieure ou égale à 12 que d'élèves qui ont une note supérieure ou égale à 12.</p></div>
  <h4>L'effectif total est pair</h4>
  <p><b>Exemple :</b> dans la classe n° 1, le professeur d'allemand a corrigé l'évaluation de ses 12 élèves. Voici les notes qu'il a attribuées sur 20 :</p>
  <p><b>Avec une série :</b></p><p class="calc">${C1.join(" ; ")}</p>
  <p><b>1)</b> L'effectif total est 12, donc pair. 12 ÷ 2 = 6 : pour trouver la médiane, je repère la 6<sup>e</sup> et la 7<sup>e</sup> note.</p>
  <p><b>2)</b> On range les valeurs dans l'ordre croissant :</p><p class="calc">4 ≤ 6 ≤ 7 ≤ 7 ≤ 10 ≤ <b>10</b> ≤ <b>11</b> ≤ 16 ≤ 18 ≤ 18 ≤ 18 ≤ 18</p>
  <p><b>3)</b></p><p class="calc">{10 + 11/2} = 10,5</p><p>La médiane est donc égale à <b>10,5</b>.</p>
  <p><b>Avec un tableau d'effectifs :</b></p>${te(["Notes","4","6","7","10","11","16","18"],["Effectifs","1","1","2","2","1","1","4"])}
  <p><b>1)</b> L'effectif total est 12, donc pair : je repère la 6<sup>e</sup> et la 7<sup>e</sup> note.</p><p><b>2)</b> 1 + 1 + 2 + 2 = 6 : il y a 6 notes inférieures ou égales à 10.</p><p>6 + 1 = 7 : il y a 7 notes inférieures ou égales à 11.</p><p>La 6<sup>e</sup> note de la série est 10 et la 7<sup>e</sup> note est 11.</p><p class="calc">{10 + 11/2} = 10,5</p><p>La médiane est donc égale à <b>10,5</b>.</p>
  <div class="retenir" data-l="Interprétation"><p>Dans la classe n° 1, il y a autant d'élèves qui ont une note inférieure ou égale à 10,5 que d'élèves qui ont une note supérieure ou égale à 10,5.</p></div>`},
{k:"VI", t:"Série regroupée en classes et histogramme", h:`
  <p>Dans le cas de nombreuses données numériques, on peut les regrouper en <b>classes</b> pour faciliter la présentation des effectifs et des fréquences.</p>
  <div class="retenir" data-l="Règle"><p>Pour représenter des données numériques regroupées en classes, on utilise un <b>histogramme</b> (diagramme à barres accolées).</p><p>Pour des classes de <b>même amplitude</b>, les <b>hauteurs</b> des barres d'un histogramme sont <b>proportionnelles</b> aux effectifs (ou aux fréquences) de chaque classe.</p></div>
  <p><b>Exemple :</b> regroupement en classes des masses à la naissance, en kg, de seize poulains.</p><p class="calc" style="white-space:normal">${lst(POUL," ; ")}</p>
  <p>On présente les effectifs en regroupant les masses en classes de même amplitude (ici 5 kg).</p>${te(["Masse m (en kg)","40 ≤ m &lt; 45","45 ≤ m &lt; 50","50 ≤ m &lt; 55"],["Effectif","2","8","6"])}
  <p>« 50 ≤ m &lt; 55 » : 6 poulains ont une masse comprise entre 50 kg (inclus) et 55 kg (exclu).</p>
  <p>On représente les effectifs par un histogramme :</p>${H_POUL}`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Moyenne, étendue et fréquence", e:[
  {n:"Activité 1", t:"Résultats à une évaluation", w:"Sur ton cahier", h:`<p>Le professeur d'allemand a corrigé l'évaluation de ses élèves dans deux classes. Voici les notes qu'il a attribuées sur 20.</p>
   <p><b>Résultats des 12 élèves de la classe n° 1 :</b></p><p class="calc">${C1.join(" ; ")}</p><p><b>Résultats des 29 élèves de la classe n° 2</b>, présentés dans un tableau d'effectifs :</p>${te(["Notes",...C2v.map(x=>N(x)),"Total"],["Effectifs",...C2e.map(String),"29"])}
   <p><b>Question 1 :</b></p><p><b>a)</b> Dans la classe 1, le nombre total de points distribués par le professeur aurait été le même si chaque élève avait obtenu environ <b>11,9/20</b>. Quel calcul faut-il faire pour trouver ce nombre ? Que représente-t-il ? Explique.</p><p><b>b)</b> Même question pour la classe 2, avec environ <b>11,7/20</b>.</p>
   <p><b>Question 2 :</b></p><p><b>a)</b> Dans la classe 1, calcule l'écart entre la plus haute note et la plus basse.</p><p><b>b)</b> Même question pour la classe 2.</p>`,
   c:`<p><b>Question 1 a)</b> On additionne toutes les notes, puis on divise par le nombre d'élèves :</p><p class="calc">M = {${C1.join(" + ")}/12}<br>M = {143/12}<br>M ≈ 11,9</p><p>C'est la <b>moyenne</b> de la classe 1.</p>
   <p><b>b)</b></p><p class="calc">M = {6 × 9 + 7 × 11 + 6 × 12 + 3 × 12,5 + 5 × 14 + 2 × 15/29}<br>M = {340,5/29}<br>M ≈ 11,7</p><p>C'est la <b>moyenne</b> de la classe 2.</p>
   <p><b>Question 2 a)</b> 18 − 4 = <b>14</b>. <b>b)</b> 15 − 9 = <b>6</b>. Cet écart s'appelle l'<b>étendue</b> : les notes de la classe 1 sont beaucoup plus dispersées.</p>`},
  {n:"Exercice 1", t:"Au cinéma le lundi après-midi", w:"Sur ton cahier", h:`<p>Un cinéma de quartier propose cinq tarifs :</p><ul><li>4,00 € pour les moins de 14 ans ;</li><li>6,00 € pour les étudiants ;</li><li>6,40 € pour les abonnés ;</li><li>7,50 € pour les seniors ;</li><li>9,50 € en tarif normal.</li></ul>
   <p>Le caissier comptabilise les 15 entrées de ce lundi après-midi en notant les prix ci-dessous :</p><p class="calc" style="white-space:normal">4 – 6,40 – 6,40 – 6 – 7,50 – 9,50 – 6,40 – 4 – 4 – 6,40 – 6 – 6,40 – 4 – 4 – 7,50</p>
   <p><b>1) a)</b> Détermine le <b>prix moyen</b> d'une place.</p><p><b>b)</b> Détermine l'<b>étendue</b> des prix.</p><p><b>2)</b> Interprète les nombres trouvés à la question 1, en complétant chaque phrase :</p><p><b>a)</b> « L'écart de prix entre la place la plus chère et la place la moins chère est de ……… €. »</p><p><b>b)</b> « La recette (la rentrée d'argent) de ce lundi aurait été la même si chaque client avait payé sa place ……… €. »</p>`,
   c:`<p><b>1) a)</b> On compte les places de chaque prix : 5 places à 4 €, 2 à 6 €, 5 à 6,40 €, 2 à 7,50 € et 1 à 9,50 € (15 places).</p><p class="calc">M = {5 × 4 + 2 × 6 + 5 × 6,40 + 2 × 7,50 + 1 × 9,50/15}<br>M = {20 + 12 + 32 + 15 + 9,50/15}<br>M = {88,50/15}<br>M = 5,90</p><p>Le prix moyen d'une place est de <b>5,90 €</b>.</p><p><b>b)</b> 9,50 − 4 = <b>5,50 €</b>.</p><p><b>2) a)</b> « … est de <b>5,50 €</b>. » <b>b)</b> « … si chaque client avait payé sa place <b>5,90 €</b>. »</p>`},
  {n:"Exercice 2", t:"Pointures", w:"Sur ton cahier", h:`<p>Un club de football a acheté des chaussures pour ses 60 joueurs. Les pointures des joueurs sont relevées dans le tableau :</p>${te(["Pointure","39","40","41","42","43","44","45"],["Effectif","2","4","8","15","14","10","7"])}
   <p><b>a)</b> Calcule l'étendue des pointures.</p><p><b>b)</b> Calcule la pointure moyenne de ces joueurs. Donne un arrondi au dixième.</p><p><b>c)</b> Détermine, en écriture fractionnaire, la fréquence des footballeurs qui chaussent du 41 dans le club.</p>
   <p><i>Rappel : il y a 2 footballeurs sur 60 qui chaussent du 39. Donc la fréquence des footballeurs qui chaussent du 39 est {2/60} (environ 0,03, soit environ 3 %).</i></p>`,
   c:`<p><b>a)</b> 45 − 39 = <b>6</b>.</p><p><b>b)</b></p><p class="calc">M = {2 × 39 + 4 × 40 + 8 × 41 + 15 × 42 + 14 × 43 + 10 × 44 + 7 × 45/60}<br>M = {2 553/60}<br>M = 42,55</p><p>La pointure moyenne est d'environ <b>42,6</b>.</p><p><b>c)</b> {8/60} = <b>{2/15}</b> (environ 0,13, soit environ 13 %).</p>`},
  {n:"Exercice 3", t:"Temps d'attente en caisse", w:"Sur ton cahier", h:`<p>Un directeur de supermarché a relevé les temps d'attente aux caisses, en min, de 50 clients et a construit ce diagramme en bâtons.</p>${batons({...ATT, xlab:"Temps d'attente (en min)", ymax:15, ystep:1, ylabStep:5, w:420, H:270})}
   <p><b>1) a)</b> Quelle est la fréquence des clients qui ont attendu 3 min ? Justifie.</p><p><b>b)</b> Combien de clients ont attendu 5 minutes ou plus ? Justifie.</p><p><b>2)</b> Le directeur ouvre une caisse supplémentaire si le temps moyen d'attente aux caisses dépasse 3 min. Montre que le directeur devra ouvrir une caisse supplémentaire.</p>`,
   c:`<p>On lit les effectifs :</p>${te(["Temps (min)",...ATT.vals.map(String)],["Effectif",...ATT.eff.map(String)])}<p><b>1) a)</b> 13 clients sur 50 ont attendu 3 min. Leur fréquence f :</p><p class="calc">f = {13/50}<br>f = 0,26<br>f = <b>26 %</b></p><p><b>b)</b> 9 + 3 + 1 = <b>13 clients</b>.</p>
   <p><b>2)</b></p><p class="calc">M = {4 × 1 + 9 × 2 + 13 × 3 + 11 × 4 + 9 × 5 + 3 × 6 + 1 × 7/50}<br>M = {175/50}<br>M = 3,5</p><p>3,5 min &gt; 3 min : le directeur devra ouvrir une caisse supplémentaire.</p>`},
  {n:"Exercice 4", t:"Vente de macarons (brevet, juin 2016)", w:"Sur ton cahier", h:`<p>Une nouvelle boutique a ouvert à Paris. Elle vend exclusivement des macarons (petites pâtisseries). L'extrait de tableur ci-dessous indique le nombre de macarons vendus une semaine.</p>
   ${tab(["","A","B","C","D","E","F","G","H","I"],[["1","","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche","Total"],["2","Nombre de macarons vendus","324","240","310","204","318","386","468",""]])}
   <p><b>1)</b> Quelle formule doit être saisie dans la case I2 pour calculer le nombre total de macarons vendus dans la semaine ?</p><p><b>2) a)</b> Calcule le nombre moyen de macarons vendus par jour. Arrondis le résultat à l'unité.</p><p><b>b)</b> Interprète le résultat trouvé à la question 2 a).</p>`,
   c:`<p><b>1)</b> En I2, il faut saisir la formule <b>=SOMME(B2:H2)</b>.</p><p><b>2) a)</b></p><p class="calc">m = {324 + 240 + 310 + 204 + 318 + 386 + 468/7}<br>m = {2 250/7}<br>m ≈ 321</p><p>Le nombre moyen de macarons vendus par jour est d'environ <b>321</b>.</p><p><b>b)</b> Si la boutique avait vendu le même nombre de macarons chaque jour, elle en aurait vendu environ 321 par jour.</p>`}
 ]},
{t:"La médiane", e:[
  {n:"Activité 2", t:"Résultats à une évaluation", w:"Sur ton cahier", h:`<p>On reprend les notes de l'activité 1.</p><p><b>Classe n° 1 :</b> ${C1.join(" ; ")}</p>${te(["Classe n° 2 : notes",...C2v.map(x=>N(x))],["Effectifs",...C2e.map(String)])}
   <p><b>a)</b> Dans la classe 1, il y a autant d'élèves qui ont eu 10,5/20 ou moins que d'élèves qui ont eu 10,5/20 ou plus. Comment déterminer ce nombre ? Que représente-t-il ? Explique.</p><p><b>b)</b> Dans la classe 2, il y a autant d'élèves qui ont eu 12/20 ou moins que d'élèves qui ont eu 12/20 ou plus. Comment déterminer ce nombre ? Que représente-t-il ? Explique.</p>`,
   c:`<p>Ce nombre est la <b>médiane</b> de la série.</p><p><b>a) Classe 1 :</b></p>${medList(C1).txt}<p><b>b) Classe 2 :</b></p>${medTab(C2v,C2e).txt}`},
  {n:"Exercice 5", t:"Au bowling !", w:"Sur ton cahier", h:`<p><b>Équipe 1 :</b> voici les scores obtenus par les onze joueurs de l'équipe 1 :</p><p class="calc">97 – 90 – 127 – 94 – 108 – 132 – 100 – 134 – 99 – 133 – 96</p><p><b>Équipe 2 :</b> voici les scores obtenus par les dix joueurs de l'équipe 2 :</p><p class="calc">103 – 177 – 78 – 105 – 117 – 92 – 98 – 101 – 147 – 82</p><p>Pour chaque équipe, calcule la médiane de la série des scores.</p>`,
   c:`<p><b>Équipe 1 :</b></p>${medList([97,90,127,94,108,132,100,134,99,133,96]).txt}<p><b>Équipe 2 :</b></p>${medList([103,177,78,105,117,92,98,101,147,82]).txt}`},
  {n:"Exercice 6", t:"Poids des cartables", w:"Sur ton cahier", h:`<p>Dans un collège, une enquête a été menée sur le poids des cartables. On a pesé le cartable de 25 élèves. Voici les résultats :</p>${te(["Poids du cartable (en kg)","4","5","6","7","8","9","10"],["Effectifs","1","4","8","5","3","3","1"])}<p>Calcule le poids médian d'un cartable.</p>`,
   c:medTab([4,5,6,7,8,9,10],[1,4,8,5,3,3,1]," kg").txt},
  {n:"Exercice 7", t:"Temps d'attente en caisse", w:"Sur ton cahier", h:`<p>On reprend le diagramme en bâtons de l'exercice 3 (temps d'attente de 50 clients).</p>${batons({...ATT, xlab:"Temps d'attente (en min)", ymax:15, ystep:1, ylabStep:5, w:420, H:270})}<p>Calcule le temps médian d'attente aux caisses. Interprète ce résultat.</p>`,
   c:`${medTab(ATT.vals,ATT.eff," min").txt}<p>Interprétation : la moitié des clients au moins ont attendu 3 min ou moins, et la moitié au moins ont attendu 3 min ou plus.</p>`},
  {n:"Exercice 8", t:"Différence entre moyenne et médiane", w:"Sur ton cahier", h:`<p>Le tableau ci-dessous donne la répartition des salaires mensuels d'une entreprise, pour l'année 2021, selon la catégorie des employés.</p>${tab(["","Débutants","Employés","Ouvriers spécialisés","Cadres","Patrons"],[["Salaire mensuel (en €)","940","1 250","1 450","2 300","3 950"],["Effectifs","1","20","7","2","1"]])}
   <p><b>1)</b> Calcule le salaire moyen des salariés de cette entreprise.</p><p><b>2)</b> Calcule le salaire médian des salariés de cette entreprise.</p><p><b>3)</b> Comment peut-on expliquer l'écart entre le salaire médian et le salaire moyen ?</p>`,
   c:`<p><b>1)</b> Effectif total : 1 + 20 + 7 + 2 + 1 = 31.</p><p class="calc">M = {1 × 940 + 20 × 1 250 + 7 × 1 450 + 2 × 2 300 + 1 × 3 950/31}<br>M = {44 640/31}<br>M = 1 440</p><p>Le salaire moyen est de <b>1 440 €</b>.</p><p><b>2)</b> ${medTab([940,1250,1450,2300,3950],[1,20,7,2,1]," €").txt.replace(/^<p>/,"").replace(/<\/p>$/,"")}</p><p><b>3)</b> Les quelques salaires très élevés (cadres et patron) font augmenter la moyenne, mais pas la médiane : la majorité des salariés (20 sur 31) gagnent 1 250 €.</p>`},
  {n:"Exercice 9", t:"Aux JO, le cyclisme (brevet, avril 2014)", w:"Sur ton cahier", h:`<p>Voici le classement des médailles d'or reçues par les pays participant aux Jeux olympiques pour le cyclisme masculin (source : Wikipédia).</p><p><b>Bilan des médailles d'or de 1896 à 2008 :</b></p>
   ${tab(["Nation","Or","Nation","Or"],[["France","40","Russie","4"],["Italie","32","Suisse","3"],["Royaume-Uni","18","Suède","3"],["Pays-Bas","15","Tchécoslovaquie","2"],["États-Unis","14","Norvège","2"],["Australie","13","Canada","1"],["Allemagne","13","Afrique du Sud","1"],["Union soviétique","11","Grèce","1"],["Belgique","6","Nouvelle-Zélande","1"],["Danemark","6","Autriche","1"],["Allemagne de l'Ouest","6","Estonie","1"],["Espagne","5","Lettonie","1"],["Allemagne de l'Est","4","Argentine","1"]])}
   <p><b>1)</b> Voici un extrait du tableur :</p>${tab(["","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O"],[["1","Nombre de médailles d'or","1","2","3","4","5","6","11","13","14","15","18","32","40",""],["2","Effectif","8","2","2","2","1","3","1","2","1","1","1","1","1","26"]])}
   <p>Quelle formule a-t-on saisie dans la cellule O2 pour obtenir le nombre total de pays ayant eu une médaille d'or ?</p><p><b>2) a)</b> Calcule la moyenne de cette série (arrondis à l'unité).</p><p><b>b)</b> Détermine la médiane de cette série.</p><p><b>c)</b> En observant les valeurs prises par la série, donne un argument qui explique pourquoi la moyenne et la médiane sont différentes.</p><p><b>3)</b> Pour le cyclisme masculin, 70 % des pays médaillés ont obtenu au moins une médaille d'or. Quel est le nombre de pays qui n'ont obtenu que des médailles d'argent ou de bronze (arrondis à l'unité) ?</p>`,
   c:`<p><b>1)</b> Dans la cellule O2, on a saisi la formule <b>=SOMME(B2:N2)</b>.</p><p><b>2) a)</b></p><p class="calc" style="white-space:normal">M = {8 × 1 + 2 × 2 + 2 × 3 + 2 × 4 + 1 × 5 + 3 × 6 + 1 × 11 + 2 × 13 + 1 × 14 + 1 × 15 + 1 × 18 + 1 × 32 + 1 × 40/26}</p><p class="calc">M = {205/26}<br>M ≈ 8</p><p>La moyenne de cette série est d'environ <b>8 médailles</b>.</p>
   <p><b>b)</b> L'effectif de la série est 26. 26 est pair et 26 ÷ 2 = 13 : la médiane est comprise entre la 13<sup>e</sup> et la 14<sup>e</sup> valeur de la série rangée dans l'ordre croissant.</p><p>8 + 2 + 2 = 12 et 12 + 2 = 14 : la 13<sup>e</sup> et la 14<sup>e</sup> valeur sont égales à 4.</p><p class="calc">{4 + 4/2} = 4</p><p>La médiane de cette série est égale à <b>4 médailles</b>.</p>
   <p><b>c)</b> La médiane (4) indique qu'il y a autant de pays qui ont obtenu 4 médailles ou moins que de pays qui en ont obtenu 4 ou plus. Mais parmi les 14 pays qui en ont obtenu 4 ou plus, certains ont reçu un grand nombre de médailles (15, 18, 32, 40). Ces valeurs font nettement augmenter la moyenne : c'est pourquoi la moyenne (environ 8) est nettement supérieure à la médiane (4).</p>
   <p><b>3)</b> Les 26 pays qui ont au moins une médaille d'or représentent 70 % des pays médaillés.</p>${te(["Pays ayant au moins une médaille d'or","70","26"],["Pays médaillés","100","?"])}<p class="calc">{26 × 100/70} ≈ 37</p><p>Il y a environ 37 pays médaillés. 37 − 26 = 11 : <b>11 pays</b> n'ont reçu que des médailles d'argent ou de bronze.</p>`}
 ]},
{t:"Séries regroupées en classes et histogrammes", e:[
  {n:"Activité 3", t:"Regrouper des données en classes", w:"Sur ton cahier", h:`<p>Pour entretenir des terrains et des espaces verts sans engins mécaniques ni produits phytosanitaires, une communauté de douze communes a fait appel à des moutons. Voici la répartition des moutons par commune :</p>
   ${te(["Commune","A","B","C","D","E","F","G","H","I","J","K","L"],["Nombre de moutons","2","10","5","7","2","4","12","8","6","2","11","5"])}
   <p><b>1)</b> Recopie et complète ce tableau d'effectifs (de 0 à 12 moutons) :</p>${te(["Nombre n de moutons","0","1","2","3","4","5","…"],["Nombre de communes","0","0","3","0","1","2","…"])}
   <p><b>2) a)</b> Pour remédier à la longueur du tableau précédent, on regroupe les données en classes d'amplitude 5. Recopie et complète ce tableau :</p>${te(["Nombre n de moutons","0 ≤ n &lt; 5","5 ≤ n &lt; 10","10 ≤ n &lt; 15"],["Nombre de communes","","",""])}<p><i>« 10 ≤ n &lt; 15 » : n est compris entre 10 (inclus) et 15 (exclu).</i></p>
   <p><b>b)</b> Cite un inconvénient de ce tableau par rapport à celui de la question 1.</p><p><b>c)</b> Parmi ces douze communes, combien ont au moins 5 moutons ? Justifie.</p>
   <p><b>3)</b> Représente les données du tableau de la question 2 par un histogramme (un diagramme dont les barres sont accolées), comme dans l'exemple des poulains du cours. La première barre est déjà tracée :</p>${histo({b:[0,5,10,15], eff:[4,0,0], xlab:"Nombre de moutons", ylab:"Nombre de communes", ymax:6, ystep:1, w:340, H:260})}`,
   c:`<p><b>1)</b></p>${te(["n","0","1","2","3","4","5","6","7","8","9","10","11","12"],["Communes","0","0","3","0","1","2","1","1","1","0","1","1","1"])}
   <p><b>2) a)</b></p>${te(["Nombre n de moutons","0 ≤ n &lt; 5","5 ≤ n &lt; 10","10 ≤ n &lt; 15"],["Nombre de communes","4","5","3"])}<p><b>b)</b> On ne connaît plus le nombre exact de moutons de chaque commune : on perd des informations.</p><p><b>c)</b> 5 + 3 = <b>8 communes</b> ont au moins 5 moutons.</p><p><b>3)</b></p>${histo({b:[0,5,10,15], eff:[4,5,3], xlab:"Nombre de moutons", ylab:"Nombre de communes", ymax:6, ystep:1, w:340, H:260, show:true})}`},
  {n:"Exercice 10", t:"Histogramme et précipitations", w:"Sur ton cahier", h:`<p>Représente par un histogramme ces précipitations P, en mm, relevées en un même lieu.</p>${te(["P","0 ≤ P &lt; 3","3 ≤ P &lt; 6","6 ≤ P &lt; 9","9 ≤ P &lt; 12"],["Effectif","10","6","7","8"])}`,
   c:`<p>Les classes ont la même amplitude (3 mm) : les hauteurs des barres sont proportionnelles aux effectifs.</p>${histo({b:[0,3,6,9,12], eff:[10,6,7,8], xlab:"Précipitations P (en mm)", ymax:12, ystep:1, ylabStep:2, w:400, show:true})}`},
  {n:"Exercice 11", t:"Calibre de noix", w:"Sur ton cahier", h:`<p>Un producteur de noix trie un échantillon de 50 noix selon leur calibre, en mm.</p>${te(["Calibres",...NOIX.slice(0,10)],["",...NOIX.slice(10,20)],["",...NOIX.slice(20,30)]).replace("</tbody>",`<tr><th></th>${NOIX.slice(30,40).map(x=>`<td>${x}</td>`).join("")}</tr><tr><th></th>${NOIX.slice(40).map(x=>`<td>${x}</td>`).join("")}</tr></tbody>`)}
   <p><b>a)</b> On regroupe ces calibres c en classes d'amplitude 2 mm. Recopie et complète ce tableau :</p>${te(["Calibre","28 ≤ c &lt; 30","30 ≤ c &lt; 32","…"],["Effectif","","","…"])}
   <p><b>b)</b> Combien de noix de ce lot ont un calibre :</p><ul><li>compris entre 32 mm (inclus) et 34 mm (exclu) ?</li><li>au moins égal à 30 mm ?</li><li>strictement inférieur à 36 mm ?</li></ul>`,
   c:`<p><b>a)</b></p>${te(["Calibre","28 ≤ c &lt; 30","30 ≤ c &lt; 32","32 ≤ c &lt; 34","34 ≤ c &lt; 36","36 ≤ c &lt; 38","Total"],["Effectif",...cls(NOIX,28,2,5).map(String),"50"])}<p><b>b)</b></p><ul><li>entre 32 mm (inclus) et 34 mm (exclu) : <b>7 noix</b> ;</li><li>au moins 30 mm : 50 − 4 = <b>46 noix</b> ;</li><li>strictement moins de 36 mm : 4 + 12 + 7 + 10 = <b>33 noix</b>.</li></ul>`},
  {n:"Exercice 12", t:"Le Vendée Globe", w:"Sur ton cahier", h:`<p>Le Vendée Globe, célèbre course en solitaire autour du monde, a rassemblé 33 voiliers dans son édition 2020. Voici les âges des skippers au départ de la course :</p>${te(["Âges",...VG.slice(0,11)],["",...VG.slice(11,22)],["",...VG.slice(22)])}
   <p><b>a)</b> Pour remédier à la longueur de cette série, on regroupe les âges en classes d'amplitude 10 ans. Recopie et complète le tableau :</p>${te(["Âge","20 ≤ a &lt; 30","30 ≤ a &lt; 40","…"],["Effectif","1","","…"])}
   <p><b>b)</b> Représente les données du tableau par un histogramme. Sur papier à petits carreaux, choisis comme unités : 1 cm pour 10 ans sur l'axe horizontal et 5 mm pour un effectif égal à 1 sur l'axe vertical.</p>`,
   c:`<p><b>a)</b></p>${te(["Âge","20 ≤ a &lt; 30","30 ≤ a &lt; 40","40 ≤ a &lt; 50","50 ≤ a &lt; 60","60 ≤ a &lt; 70","Total"],["Effectif",...cls(VG,20,10,5).map(String),"33"])}<p><b>b)</b></p>${histo({b:[20,30,40,50,60,70], eff:cls(VG,20,10,5), xlab:"Âge (en années)", ymax:18, ystep:1, ylabStep:2, w:420, H:300, show:true})}`}
 ]},
{t:"Exercices de révision", e:[
  {n:"Révision 1", t:"Température", w:"Sur ton cahier", h:`<p>Un médecin a relevé les températures, en degrés Celsius, de sept patients :</p><p class="calc">37,2 / 39,4 / 38 / 38,2 / 39 / 38,6 / 40,2</p><p><b>1)</b> Calcule la température moyenne de ces sept patients.</p><p><b>2)</b> Quelle est la température médiane de ces sept patients ?</p><p><b>3)</b> Calcule l'étendue des températures.</p>`,
   c:`<p><b>1)</b></p><p class="calc">M = {37,2 + 39,4 + 38 + 38,2 + 39 + 38,6 + 40,2/7}<br>M = {270,6/7}<br>M ≈ 38,7</p><p>La température moyenne est d'environ <b>38,7 °C</b>.</p><p><b>2)</b> ${medList([37.2,39.4,38,38.2,39,38.6,40.2]).txt.replace(/^<p>/,"").replace(/<\/p>$/,"")} La température médiane est de 38,6 °C.</p><p><b>3)</b> 40,2 − 37,2 = <b>3 °C</b>.</p>`},
  {n:"Révision 2", t:"Lancer de poids", w:"Sur ton cahier", h:`<p>On a relevé les performances, en mètres, obtenues par les élèves d'une classe au lancer de poids :</p><p class="calc" style="white-space:normal">${lst(LP," ; ")}</p><p><b>1)</b> Calcule la moyenne de la série (arrondis au centième).</p><p><b>2)</b> Calcule la médiane de la série.</p><p><b>3)</b> Calcule l'étendue de la série.</p>`,
   c:`<p><b>1)</b> Il y a 24 performances. On les additionne, puis on divise par 24 :</p><p class="calc" style="white-space:normal">M = {${lst(LP," + ")}/24}</p><p class="calc">M = {122,28/24}<br>M = 5,095<br>M ≈ 5,10</p><p>La moyenne est d'environ <b>5,10 m</b>.</p><p><b>2)</b></p>${medList(LP).txt}<p><b>3)</b> 6,21 − 3,45 = <b>2,76 m</b>.</p>`},
  {n:"Révision 3", t:"Envoi de messages", w:"Sur ton cahier", h:`<p>On demande à un groupe de 16 élèves combien de SMS ils ont envoyés depuis le début de la journée. Voici leurs réponses :</p><p class="calc">${SMS.join(" ; ")}</p><p><b>1)</b> Calcule le nombre moyen de SMS envoyés.</p><p><b>2)</b> Calcule le nombre médian de SMS envoyés. Interprète ce résultat dans cette situation.</p>`,
   c:`<p><b>1)</b> Il y a 16 élèves. On additionne les réponses, puis on divise par 16 :</p><p class="calc" style="white-space:normal">M = {${SMS.join(" + ")}/16}</p><p class="calc">M = {147/16}<br>M ≈ 9,2</p><p>En moyenne, chaque élève a envoyé environ <b>9,2 SMS</b>.</p><p><b>2)</b></p>${medList(SMS).txt}<p>La moitié des élèves ont envoyé 4,5 SMS ou moins, l'autre moitié 4,5 SMS ou plus. Quelques élèves qui envoient beaucoup de SMS (20, 25, 40) font monter la moyenne.</p>`},
  {n:"Activité rapide", t:"Moyenne, médiane et étendue", w:"Sur ton cahier", h:`<p>9 élèves ont répondu à la question : « Combien de livres avez-vous lus cette année ? ». Voici les réponses obtenues :</p><p class="calc">1 – 5 – 3 – 3 – 2 – 1 – 2 – 8 – 3</p><p><b>a)</b> Quelle est l'étendue du nombre de livres lus par ces 9 élèves ? Interprète cette valeur.</p><p><b>b)</b> Quel est le nombre moyen de livres lus ? Interprète cette valeur.</p><p><b>c)</b> Quel est le nombre médian de livres lus ? Interprète cette valeur.</p>`,
   c:`<p><b>a)</b> 8 − 1 = <b>7</b> : il y a 7 livres d'écart entre l'élève qui a lu le plus et celui qui a lu le moins.</p><p><b>b)</b></p><p class="calc">M = {1 + 5 + 3 + 3 + 2 + 1 + 2 + 8 + 3/9}<br>M = {28/9}<br>M ≈ <b>3,1</b></p><p>Si tous les élèves avaient lu le même nombre de livres, chacun en aurait lu environ 3,1.</p><p><b>c)</b></p>${medList([1,5,3,3,2,1,2,8,3]).txt}<p>Au moins la moitié des élèves ont lu 3 livres ou moins, et au moins la moitié 3 livres ou plus.</p>`},
  {n:"Révision 4", t:"Frères et sœurs", w:"Sur ton cahier", h:`<p>On a demandé à un groupe de personnes le nombre de frères et sœurs qu'elles avaient. Le tableau ci-dessous regroupe les réponses :</p>${te(["Nombre de frères et sœurs","0","1","2","3","4","5","6"],["Effectif","3","6","7","9","5","2","1"])}<p>Calcule la moyenne, la médiane et l'étendue de cette série.</p>`,
   c:`<p><b>Moyenne :</b></p><p class="calc">M = {3 × 0 + 6 × 1 + 7 × 2 + 9 × 3 + 5 × 4 + 2 × 5 + 1 × 6/33}<br>M = {83/33}<br>M ≈ 2,5</p><p><b>Médiane :</b></p>${medTab([0,1,2,3,4,5,6],[3,6,7,9,5,2,1]).txt}<p><b>Étendue :</b> 6 − 0 = <b>6</b>.</p>`},
  {n:"Révision 5", t:"Notes à l'évaluation de maths", w:"Sur ton cahier", h:`<p>Ce diagramme en bâtons indique la répartition des notes des 27 élèves d'une classe de 3<sup>e</sup> à leur dernière évaluation de mathématiques.</p>${batons({...NOTES, title:"Répartition des notes (sur 20)", xlab:"Notes obtenues", ylab:"Nombre d'élèves", ymax:10, ystep:1, ylabStep:1, w:420, H:290})}
   <p><b>1) a)</b> Combien d'élèves ont obtenu 5/20 ?</p><p><b>b)</b> Quelle est la fréquence des élèves qui ont obtenu 15/20 ? Justifie.</p><p><b>2)</b> Quelle est la moyenne de la classe à cette évaluation ?</p><p><b>3)</b> Quelle est la note médiane ? Interprète cette valeur.</p>`,
   c:`<p><b>1) a)</b> <b>2 élèves</b>. <b>b)</b> 4 élèves sur 27 : {4/27} ≈ 0,15, soit environ <b>15 %</b>.</p><p><b>2)</b></p><p class="calc">M = {2 × 5 + 3 × 8 + 1 × 10 + 5 × 12 + 9 × 13 + 4 × 15 + 3 × 18/27}<br>M = {335/27}<br>M ≈ 12,4</p><p><b>3)</b></p>${medTab(NOTES.vals,NOTES.eff).txt}<p>Au moins la moitié des élèves ont eu 13 ou moins, et au moins la moitié 13 ou plus.</p>`},
  {n:"Révision 6", t:"Vente de macarons (brevet, juin 2016) : le sujet complet", w:"Sur ton cahier", h:`<p>On reprend l'extrait de tableur de l'exercice 4 (macarons vendus du lundi au dimanche : 324 ; 240 ; 310 ; 204 ; 318 ; 386 ; 468).</p><p><b>1)</b> Quelle formule doit être saisie dans la case I2 pour calculer le nombre total de macarons vendus dans la semaine ?</p><p><b>2)</b> Calcule le nombre moyen de macarons vendus par jour. Arrondis le résultat à l'unité.</p><p><b>3)</b> Quel est le nombre médian de macarons ? Justifie la réponse.</p><p><b>4)</b> Calcule la différence entre le nombre de macarons vendus le dimanche et ceux vendus le jeudi. À quel terme statistique correspond cette valeur ?</p>`,
   c:`<p><b>1)</b> =SOMME(B2:H2).</p><p><b>2)</b></p><p class="calc">m = {2 250/7}<br>m ≈ <b>321</b></p><p><b>3)</b> On range les valeurs dans l'ordre croissant : 204 ; 240 ; 310 ; 318 ; 324 ; 386 ; 468. L'effectif est 7 (impair) et {7 + 1/2} = 4 : la médiane est la 4<sup>e</sup> valeur de la série ordonnée, c'est-à-dire <b>318</b>.</p><p><b>4)</b> 468 − 204 = <b>264</b>. Cette valeur correspond à l'<b>étendue</b> de la série.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La fréquence", schema:S_FREQ, q:{
 1:[ {g:()=>{ const t=pick([20,25,50]), n=ri(1,t-1), p=n*100/t; return {q:`${n} élèves sur ${t} ont 14 ans. Quelle est la fréquence de cette valeur, en pourcentage ?`, rep:[N(p), N(p)+" %", N(p)+"%"], ex:`<br>f = {${n}/${t}}<br>f = ${N(n/t)}<br>f = ${N(p)} %`, sx:S_FREQ}; }} ],
 2:[ {g:()=>{ const t=pick([24,30,36,40,48,60]); let n; do{ n=ri(2,t-2); }while(gcd(n,t)===1); return {q:`Dans un club de ${t} joueurs, ${n} chaussent du 41. Quelle est la fréquence de cette pointure, en fraction irréductible ?`, c:shuf(uniq(irr(n,t),[F(n,t-n), irr(t-n,t), F(t/gcd(n,t),n/gcd(n,t))])), rep:irr(n,t), ex:`{${n}/${t}} = ${irr(n,t)}.`, sx:S_FREQ}; }} ],
 3:[ {g:()=>{ const e=[ri(1,6),ri(3,10),ri(5,14),ri(3,10),ri(1,5)], vals=[1,2,3,4,5], i=ri(0,4), n=sum(e); return {q:`Voici les temps d'attente de ${n} clients. Quelle est la fréquence de la valeur ${vals[i]} min, arrondie au centième ?`, fig:batons({vals:vals.map(String), eff:e, xlab:"Temps (min)", ymax:Math.max(...e)+1, ystep:1, ylabStep:2, w:360, H:230}), rep:[N(rd(e[i]/n,2)), rd(e[i]/n,2).toFixed(2).replace(".",",")], ex:`Effectif total : ${e.join(" + ")} = ${n}. {${e[i]}/${n}} ${Math.abs(e[i]/n-rd(e[i]/n,2))<1e-9?"=":"≈"} ${N(rd(e[i]/n,2))}.`, sx:S_FREQ}; }} ]
}},
{nom:"L'étendue", schema:S_ET, q:{
 1:[ {g:()=>{ const v=serie(ri(6,9),4,20); return {q:`Quelle est l'étendue de la série : ${v.join(" ; ")} ?`, rep:[String(Math.max(...v)-Math.min(...v))], ex:`${Math.max(...v)} − ${Math.min(...v)} = ${Math.max(...v)-Math.min(...v)}.`, sx:S_ET}; }} ],
 2:[ {g:()=>{ const vals=[39,40,41,42,43,44,45].slice(0,ri(5,7)), a=ri(0,1); const e=vals.map((_,i)=>i<a?0:ri(1,12)); const used=vals.filter((_,i)=>e[i]>0); return {q:`Quelle est l'étendue des pointures ?`, fig:te(["Pointure",...vals.map(String)],["Effectif",...e.map(String)]), rep:[String(used[used.length-1]-used[0])], ex:`On ne garde que les valeurs d'effectif non nul : ${used[used.length-1]} − ${used[0]} = ${used[used.length-1]-used[0]}.`, sx:S_ET}; }} ],
 3:[ {g:()=>{ const mn=ri(3,12), e=ri(5,15); return {q:`Une série a pour étendue ${e} et pour plus petite valeur ${mn}. Quelle est sa plus grande valeur ?`, c:uniq(String(mn+e),[String(e-mn>0?e-mn:e+1),String(e),String(mn*e)]), rep:String(mn+e), ex:`max − ${mn} = ${e}, donc max = ${mn} + ${e} = ${mn+e}.`, sx:S_ET}; }} ]
}},
{nom:"La moyenne", schema:S_MOY, q:{
 1:[ {g:()=>{ const n=pick([4,5,6]); let v; do{ v=serie(n,3,19); }while(sum(v)%n); return {q:`Calcule la moyenne de la série : ${v.join(" ; ")}.`, rep:[String(sum(v)/n)], ex:`<br>M = {${v.join(" + ")}/${n}}<br>M = {${sum(v)}/${n}}<br>M = ${sum(v)/n}`, sx:S_MOY}; }} ],
 2:[ {g:()=>{ let vals,e,M; do{ const a=ri(9,12); vals=[a,a+1,a+2,a+3,a+4]; e=vals.map(()=>ri(1,8)); M=meanTab(vals,e); }while(!Number.isInteger(rd(M.m*10,6))); return {q:`Quelle est la moyenne d'âge de ce groupe ?`, fig:te(["Âge",...vals.map(String)],["Effectif",...e.map(String)]), rep:[N(M.m)], ex:`<br>${M.ch()}<br>M = ${N(M.m)}`, sx:S_MOY}; }} ],
 3:[ {g:()=>{ let vals,e,M; do{ vals=[ri(8,12)*100+ri(0,9)*10]; vals.push(vals[0]+ri(2,6)*50, vals[0]+ri(8,14)*50, vals[0]+ri(25,45)*100); e=[ri(5,20),ri(2,8),ri(1,3),1]; M=meanTab(vals,e); }while(!Number.isInteger(M.m) || medTab(vals,e).m===M.m); const md=medTab(vals,e).m; return {q:`Dans une entreprise, ${M.n} salariés gagnent : ${vals.map((v,i)=>`${e[i]} × ${N(v)} €`).join(", ")}. Quel est le salaire moyen ?`, c:uniq(N(M.m)+" €",[N(md)+" €", N(rd(sum(vals)/vals.length,0))+" €"]), rep:N(M.m)+" €", ex:`<br>${M.ch()}<br>M = ${N(M.m)} €<br>La médiane (${N(md)} €) est plus petite : le gros salaire fait monter la moyenne.`, sx:S_MOY}; }} ]
}},
{nom:"La médiane", schema:S_MED, q:{
 1:[ {g:()=>{ const n=pick([5,7,9,11]), v=serie(n,2,20), m=sortN(v)[(n-1)/2]; return {q:`Quelle est la médiane de la série : ${v.join(" ; ")} ?`, rep:[String(m)], ex:`On range : ${range(v)}. Effectif ${n} (impair) : la ${(n+1)/2}<sup>e</sup> valeur est ${m}.`, sx:S_MED}; }} ],
 2:[ {g:()=>{ const n=pick([6,8,10,12]), v=serie(n,2,20), s=sortN(v), m=(s[n/2-1]+s[n/2])/2; return {q:`Quelle est la médiane de la série : ${v.join(" ; ")} ?`, rep:[N(m)], ex:`On range : ${range(v)}. Effectif ${n} (pair) : {${s[n/2-1]} + ${s[n/2]}/2} = ${N(m)}.`, sx:S_MED}; }} ],
 3:[ {g:()=>{ const vals=[4,5,6,7,8,9,10], e=vals.map(()=>ri(1,7)), r=medTab(vals,e," kg"); return {q:`Voici le poids des cartables de ${r.n} élèves. Quel est le poids médian (en kg) ?`, fig:te(["Poids (kg)",...vals.map(String)],["Effectif",...e.map(String)]), rep:[N(r.m), N(r.m)+" kg"], ex:r.txt.replace(/<\/?p>/g," "), sx:S_MED}; }},
     {q:"La médiane d'une série d'effectif 29 est…", c:["la 15<sup>e</sup> valeur de la série rangée","la moyenne de la 14<sup>e</sup> et de la 15<sup>e</sup> valeur","la 14<sup>e</sup> valeur de la série rangée"], rep:"la 15<sup>e</sup> valeur de la série rangée", ex:"29 ÷ 2 = 14,5 : on prend l'arrondi supérieur, la 15<sup>e</sup> valeur (14 valeurs avant, 14 après).", sx:S_MED} ]
}},
{nom:"Classes et histogramme", schema:S_HIS, q:{
 1:[ {g:()=>{ const a=pick([10,20,30,40]), w=pick([2,5,10]); return {q:`Dans la classe « ${a} ≤ n &lt; ${a+w} », lequel de ces nombres est compté ?`, c:[String(a),String(a+w),String(a-1)], rep:String(a), ex:`${a} est inclus et ${a+w} est exclu.`, sx:S_HIS}; }} ],
 2:[ {g:()=>{ const v=serie(12,0,14), e=cls(v,0,5,3), i=ri(0,2); return {q:`Voici le nombre de moutons de 12 communes : ${v.join(" ; ")}. Combien de communes sont dans la classe « ${i*5} ≤ n &lt; ${i*5+5} » ?`, rep:[String(e[i])], ex:`On compte les valeurs de ${i*5} (inclus) à ${i*5+5} (exclu) : ${v.filter(x=>x>=i*5&&x<i*5+5).join(", ")||"aucune"}. Il y en a ${e[i]}.`, sx:S_HIS}; }} ],
 3:[ {g:()=>{ const e=[ri(1,6),ri(3,10),ri(2,8),ri(1,5)], b=[40,45,50,55,60], k=ri(1,3); return {q:`D'après cet histogramme, combien de valeurs sont supérieures ou égales à ${b[k]} ?`, fig:histo({b, eff:e, xlab:"Masse (en kg)", ymax:Math.max(...e)+1, ystep:1, ylabStep:2, w:360, H:240}), rep:[String(sum(e.slice(k)))], ex:`On additionne les effectifs des classes à partir de ${b[k]} : ${e.slice(k).join(" + ")} = ${sum(e.slice(k))}.`, sx:S_HIS}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 11", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Écris tes calculs et une phrase de réponse.",
comp:[
  ["CALCULER","Je calcule l'étendue, la moyenne, la médiane et une fréquence.","Ex. 1 a) à c) et ex. 2 (9 points)"],
  ["COMMUNIQUER","J'interprète la médiane avec une phrase.","Ex. 1 d) (1 point)"],
  ["REPRÉSENTER","Je lis un diagramme en bâtons, je regroupe des données en classes et je trace un histogramme.","Ex. 3 et 4 (7 points)"],
  ["CONNAÎTRE","Je connais les définitions de la médiane, de la moyenne et de l'étendue.","Ex. 5 (3 points)"]
],
exos:[
{t:"Les notes d'un groupe", p:5, h:`<p>Voici les notes, sur 20, de 9 élèves à un contrôle :</p><p class="calc">8 ; 14 ; 11 ; 9 ; 16 ; 12 ; 7 ; 15 ; 12</p><p><b>a)</b> Calcule l'étendue de la série.</p><p><b>b)</b> Calcule la moyenne de la série. Arrondis au dixième.</p><p><b>c)</b> Détermine la médiane de la série.</p><p><b>d)</b> Interprète la médiane par une phrase.</p>`,
 c:`<p><b>a)</b> 16 − 7 = <b>9</b>. <i>(1 point)</i></p><p><b>b)</b></p><p class="calc">M = {8 + 14 + 11 + 9 + 16 + 12 + 7 + 15 + 12/9}<br>M = {104/9}<br>M ≈ <b>11,6</b></p><p><i>(1,5 point)</i></p><p><b>c)</b> 7 ≤ 8 ≤ 9 ≤ 11 ≤ <b>12</b> ≤ 12 ≤ 14 ≤ 15 ≤ 16. L'effectif 9 est impair : la médiane est la 5<sup>e</sup> valeur, <b>12</b>. <i>(1,5 point)</i></p><p><b>d)</b> Au moins la moitié des élèves ont eu 12 ou moins, et au moins la moitié 12 ou plus. <i>(1 point)</i></p>`},
{t:"Les livres des vacances", p:5, h:`<p>On a demandé à 30 élèves combien de livres ils ont lus pendant les vacances.</p>${te(["Nombre de livres","0","1","2","3","4","5"],["Effectif","4","7","9","5","3","2"])}<p><b>a)</b> Quelle est la fréquence, en pourcentage, des élèves qui ont lu 2 livres ?</p><p><b>b)</b> Calcule le nombre moyen de livres lus. Arrondis au dixième.</p><p><b>c)</b> Détermine la médiane de la série.</p><p><b>d)</b> Calcule l'étendue de la série.</p>`,
 c:`<p><b>a)</b></p><p class="calc">f = {9/30}<br>f = 0,3<br>f = <b>30 %</b></p><p><i>(1 point)</i></p><p><b>b)</b></p><p class="calc">M = {4 × 0 + 7 × 1 + 9 × 2 + 5 × 3 + 3 × 4 + 2 × 5/30}<br>M = {62/30}<br>M ≈ <b>2,1</b></p><p><i>(1,5 point)</i></p><p><b>c)</b> 30 est pair : on repère la 15<sup>e</sup> et la 16<sup>e</sup> valeur. 4 + 7 = 11 et 11 + 9 = 20 : la 15<sup>e</sup> et la 16<sup>e</sup> valeur valent 2. La médiane est <b>2</b>. <i>(1,5 point)</i></p><p><b>d)</b> 5 − 0 = <b>5</b>. <i>(1 point)</i></p>`},
{t:"Le temps de trajet", p:3, h:`<p>Le diagramme en bâtons donne le temps de trajet, en minutes, de 25 élèves pour venir au collège.</p>${batons({vals:["5","10","15","20","25","30"], eff:[3,6,8,5,2,1], xlab:"Temps de trajet (en min)", ymax:9, ystep:1, ylabStep:1, w:420, H:270})}<p><b>a)</b> Combien d'élèves mettent 20 min ou plus ?</p><p><b>b)</b> Détermine la médiane de la série.</p>`,
 c:`<p><b>a)</b> 5 + 2 + 1 = <b>8 élèves</b>. <i>(1 point)</i></p><p><b>b)</b> 25 est impair : la médiane est la 13<sup>e</sup> valeur. 3 + 6 = 9 et 9 + 8 = 17 : la 13<sup>e</sup> valeur est 15. La médiane est <b>15 min</b>. <i>(2 points)</i></p>`},
{t:"Les plants de tomates", p:4, h:`<p>Voici la taille, en cm, de 20 plants de tomates :</p><p class="calc" style="white-space:normal">12 ; 18 ; 25 ; 14 ; 21 ; 9 ; 16 ; 23 ; 27 ; 11 ; 19 ; 15 ; 22 ; 8 ; 17 ; 24 ; 13 ; 20 ; 26 ; 16</p><p><b>a)</b> Recopie et complète le tableau :</p>${te(["Taille t (en cm)","5 ≤ t &lt; 10","10 ≤ t &lt; 15","15 ≤ t &lt; 20","20 ≤ t &lt; 25","25 ≤ t &lt; 30"],["Effectif","","","","",""])}<p><b>b)</b> Combien de plants mesurent au moins 15 cm ?</p><p><b>c)</b> Représente ces données par un histogramme.</p>`,
 c:`<p><b>a)</b></p>${te(["Taille t (en cm)","5 ≤ t &lt; 10","10 ≤ t &lt; 15","15 ≤ t &lt; 20","20 ≤ t &lt; 25","25 ≤ t &lt; 30"],["Effectif","2","4","6","5","3"])}<p><i>(2 points)</i></p><p><b>b)</b> 6 + 5 + 3 = <b>14 plants</b>. <i>(1 point)</i></p><p><b>c)</b> <i>(1 point)</i></p>${histo({b:[5,10,15,20,25,30], eff:[2,4,6,5,3], xlab:"Taille (en cm)", ymax:7, ystep:1, ylabStep:1, w:400, show:true})}`},
{t:"QCM", p:3, h:`<p>Pour chaque question, une seule réponse est exacte. Écris le numéro de la question et la lettre de la bonne réponse.</p>${tab(["Question","A","B","C"],[["<b>1)</b> La médiane de la série 3 ; 7 ; 7 ; 9 ; 14 est :","7","8","9"],["<b>2)</b> La moyenne de la série 4 ; 10 ; 13 ; 13 est :","10","11,5","13"],["<b>3)</b> Une série a pour étendue 12 et pour plus petite valeur 5. Sa plus grande valeur est :","7","12","17"]])}`,
 c:`<p><b>1)</b> A (la 3<sup>e</sup> valeur sur 5) · <b>2)</b> A ({40/4} = 10) · <b>3)</b> C (5 + 12 = 17)</p><p><i>(1 point par bonne réponse)</i></p>`}
]}
};
})();
