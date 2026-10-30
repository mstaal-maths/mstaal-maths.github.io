/* 3e — Chapitre 23 : Le ratio (cours « Proportionnalité 3 – Le ratio », feuille d'exercices et exercices corrigés de M. Staal,
   plus l'activité 1 et deux exercices de sa progression). Les collections de symboles et la bande de partage sont dessinées en SVG. */
(function(){
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const R=a=>a.join(" : ");   /* écriture d'un ratio : 2 : 3 */
const sum=a=>a.reduce((x,y)=>x+y,0);
const tab=(head, rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ------------------------------------------------------------------
   Collection de symboles : rows = ["SSXSS", …] avec
   S carré · X étoile · H cœur · T triangle · M lune · C disque · B bonbon
------------------------------------------------------------------ */
const DE=w=>/^[aeiouéè]/i.test(w)?"d'"+w:"de "+w;
const SYM_NOM={S:"carré",X:"étoile",H:"cœur",T:"triangle",M:"lune",C:"cercle"};
function sym(c,x,y){ const s=26;
  if(c==="S") return `<rect x="${x+2}" y="${y+2}" width="${s-4}" height="${s-4}" style="fill:#bfe3ec;stroke:#1b2a44;stroke-width:2"/>`;
  if(c==="X"){ let p=[]; for(let k=0;k<10;k++){ const r=k%2?5.5:12.5, a=-Math.PI/2+k*Math.PI/5; p.push((x+s/2+r*Math.cos(a)).toFixed(1)+","+(y+s/2+1+r*Math.sin(a)).toFixed(1)); } return `<polygon points="${p.join(" ")}" style="fill:#ffe27a;stroke:#9a7d10;stroke-width:1.2"/>`; }
  if(c==="H") return `<path d="M${x+13} ${y+23} C ${x-6} ${y+10}, ${x+3} ${y-3}, ${x+13} ${y+7} C ${x+23} ${y-3}, ${x+32} ${y+10}, ${x+13} ${y+23} Z" style="fill:#f5b8f0;stroke:#a0559a;stroke-width:1.2"/>`;
  if(c==="T") return `<polygon points="${x+13},${y+2} ${x+25},${y+24} ${x+1},${y+24}" style="fill:#dfe9a8;stroke:#6d7a2a;stroke-width:1.2"/>`;
  if(c==="M") return `<path d="M${x+17} ${y+2} A 11 11 0 1 0 ${x+17} ${y+24} A 9 11 0 1 1 ${x+17} ${y+2} Z" style="fill:#d9c2ef;stroke:#6b4f8f;stroke-width:1.2"/>`;
  if(c==="C") return `<circle cx="${x+13}" cy="${y+13}" r="11" style="fill:#f7b39e;stroke:#a8573f;stroke-width:1.2"/>`;
  return "";
}
function syms(rows, alt){
  const s=30, w=Math.max(...rows.map(r=>r.length))*s+4, H=rows.length*s+4;
  let o=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="${alt||"Une collection de symboles"}">`;
  rows.forEach((r,j)=>[...r].forEach((c,i)=>{ o+=sym(c,2+i*s,2+j*s); }));
  return o+"</svg>";
}
/* range n1 symboles a et n2 symboles b mélangés, par rangées de 8 */
function mix(a,n1,b,n2){ const L=shuf([...Array(n1).fill(a),...Array(n2).fill(b)]); const rows=[]; for(let i=0;i<L.length;i+=8) rows.push(L.slice(i,i+8).join("")); return rows; }

/* ------------------------------------------------------------------
   Bande de partage : ratio [2,3], noms ["Mona","Ninon"]
------------------------------------------------------------------ */
const COLS=["#9a9a9a","#ffffff","#cfe3f7","#f7e0b5"];
function bande(r, noms, val){
  const n=sum(r), u=Math.min(58, 420/n), w=n*u+20, H=val?96:78;
  let o=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="Bande partagée en ${n} parts égales">`, x=10;
  r.forEach((k,j)=>{ for(let i=0;i<k;i++){ o+=`<rect x="${(x+i*u).toFixed(1)}" y="8" width="${u.toFixed(1)}" height="36" style="fill:${COLS[j%COLS.length]};stroke:#1b2a44;stroke-width:2"/>`; if(val) o+=`<text x="${(x+i*u+u/2).toFixed(1)}" y="31" text-anchor="middle" style="font-size:13px;fill:#1b2a44">${val}</text>`; }
    o+=`<text x="${(x+k*u/2).toFixed(1)}" y="${val?66:64}" text-anchor="middle" style="font-size:15px;font-style:italic;fill:var(--ink)">${noms[j]}</text>`; x+=k*u; });
  return o+"</svg>";
}
window.RAT3={N, R, gcd, sum, tab, syms, mix, bande, SYM_NOM, rd, DE};

/* correction type d'un partage */
const partage=(Q,r,noms,u="€")=>{ const n=sum(r), p=Q/n; return `<p>${r.join(" + ")} = ${n} : il y a <b>${n} parts</b>.</p><p>${N(Q)} ÷ ${n} = ${N(p)} : une part vaut ${N(p)}\u00a0${u}.</p>`+r.map((k,i)=>{ const [a,b]=[].concat(noms[i]); return `<p>${k} × ${N(p)} = ${N(k*p)} : ${a} <b>${N(k*p)}\u00a0${u}${b?" "+b:""}</b>.</p>`; }).join(""); };
window.RAT3.partage = partage;

/* ===================== schémas ===================== */
const S_ECR = sch("Écrire un ratio", `${syms(["MMHMMHMH","H"],"5 lunes et 4 cœurs")}<p class="schN">5 lunes pour 4 cœurs : le ratio des lunes pour les cœurs est 5 : 4 (dans cet ordre).</p>`);
const S_PART = sch("Partager selon un ratio", `${bande([2,3],["Mona","Ninon"],"48 €")}<p class="calc">2 + 3 = 5 parts · 240 ÷ 5 = 48<br>Mona : 2 × 48 = 96 € · Ninon : 3 × 48 = 144 €</p>`.replace(/ · /g," ; "));
const S_EG = sch("Ratios égaux", `<p class="calc">a et b sont dans le ratio 2 : 3 si {a/2} = {b/3}</p><p class="schN">96 et 144 : {96/2} = 48 et {144/3} = 48, donc 96 et 144 sont dans le ratio 2 : 3. On peut multiplier ou diviser les nombres d'un ratio par un même nombre : 2 : 3 = 4 : 6.</p>`);

CH["3e-23"] = {
intro:"Comprendre ce qu'est un ratio, écrire le ratio de deux ou trois quantités, partager une quantité selon un ratio et reconnaître des ratios égaux.",
savoir:[
  "comprendre et écrire un ratio « a pour b », noté a : b ;",
  "partager une quantité selon un ratio (avec deux ou trois parts) ;",
  "reconnaître des ratios égaux ;",
  "utiliser la définition : a et b sont dans le ratio 2 : 3 si {a/2} = {b/3}."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Vocabulaire", h:`
  <div class="retenir" data-l="Vocabulaire"><p>On utilise la notion de <b>ratio</b> dans des cas de partage, pour exprimer une quantité par rapport à une autre.</p><p>Le ratio « a pour b » se note <b>a : b</b>.</p></div>
  <p><b>Exemple :</b> 240 € sont partagés entre Mona et Ninon dans le ratio 2 : 3.</p><p>Cela signifie que Mona reçoit 2 parts de la somme globale et que Ninon reçoit 3 parts de la somme globale.</p>`},
{k:"II", t:"Partage d'une quantité selon un ratio", h:`
  <div class="retenir" data-l="Méthode"><p>Pour partager une quantité selon un ratio donné :</p><p><b>1)</b> on ajoute les valeurs du ratio entre elles ;</p><p><b>2)</b> on divise la quantité initiale par cette somme ;</p><p><b>3)</b> on multiplie chaque valeur du ratio par le résultat de la division.</p></div>
  <p><b>Exemple :</b> 240 € sont partagés entre Mona et Ninon dans le ratio 2 : 3. Combien chacune d'elles reçoit-elle ?</p>
  ${bande([2,3],["Part de Mona","Part de Ninon"])}
  <h4>Méthode 1 : en utilisant les fractions</h4>
  <p>Mona reçoit 2 parts quand Ninon en reçoit 3. Cela représente 5 parts au total.</p><p>Donc Mona reçoit les {2/5} de la somme, alors que Ninon en reçoit les {3/5}.</p>
  <p class="calc">240 ÷ 5 = 48 : {1/5} de la somme représente 48 €.<br>48 × 2 = 96 : Mona a donc reçu 96 €.<br>48 × 3 = 144 : Ninon a reçu 144 €.</p>
  <h4>Méthode 2 : en utilisant un tableau de proportionnalité</h4>
  <p>Mona reçoit 2 parts quand Ninon en reçoit 3. Cela représente 5 parts au total, qui correspondent à un total de 240 €.</p>
  ${tab(["Nombre de parts","5","2","3"],[["Argent (en €)","240","96","144"]])}
  <p class="calc">{2 × 240/5} = 96 : Mona a donc reçu 96 €.<br>{3 × 240/5} = 144 : Ninon a reçu 144 €.</p>`},
{k:"III", t:"Ratios égaux", h:`
  <p>Partager 240 € dans le ratio 2 : 3 revient également à partager 240 € dans le ratio <b>4 : 6</b> (on a multiplié 2 et 3 par 2), ou encore 6 : 9, 20 : 30…</p>
  <div class="retenir" data-l="À retenir"><p>On obtient un ratio égal en multipliant (ou en divisant) toutes les valeurs du ratio par un même nombre non nul.</p></div>`},
{k:"IV", t:"Définition", h:`
  <div class="retenir" data-l="Définition"><p>On dit, par exemple :</p><ul><li>que deux nombres <b>a</b> et <b>b</b> sont dans le ratio <b>2 : 3</b> si {a/2} = {b/3} ;</li><li>que trois nombres <b>a</b>, <b>b</b> et <b>c</b> sont dans le ratio <b>2 : 3 : 7</b> si {a/2} = {b/3} = {c/7}.</li></ul></div>
  <p><b>Exemple :</b> les nombres 96 et 144 sont dans le ratio 2 : 3.</p><p class="calc">Car {96/2} = 48 et {144/3} = 48. Donc {96/2} = {144/3}.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Écrire un ratio", e:[
  {n:"Exercice 1", t:"Quel est le ratio ?", w:"Sur ton cahier", h:`<p>Quel est le ratio…</p>
   <p><b>1)</b> … d'étoiles par rapport aux carrés ?</p>${syms(["SSXSSSSS","SSXSXXSS","SSX"],"Des carrés et des étoiles")}
   <p><b>2)</b> … de lunes pour les cœurs ?</p>${syms(["MMHMMHMH","H"],"Des lunes et des cœurs")}
   <p><b>3)</b> … de cœurs pour les triangles ?</p>${syms(["HHTTTHTT","TTTTTHTH","HHHTTHTH","HHH"],"Des cœurs et des triangles")}
   <p><b>4)</b> … de carrés pour les cercles ?</p>${syms(["CCCCSCCC","CSCCCCC"],"Des cercles et des carrés")}`,
   c:`<p><b>1)</b> 5 étoiles et 14 carrés : <b>5 : 14</b>.</p><p><b>2)</b> 5 lunes et 4 cœurs : <b>5 : 4</b>.</p><p><b>3)</b> 13 cœurs et 14 triangles : <b>13 : 14</b>.</p><p><b>4)</b> 2 carrés et 13 cercles : <b>2 : 13</b>.</p>`},
  {n:"Exercice en + 1", t:"Ratios de bonbons", w:"Sur ton cahier", h:`<p><b>Explication de cours :</b> la notion de ratio est très utile dans divers domaines (en économie, en géographie…).</p><p>Par exemple, le <b>sexe-ratio</b> à la naissance est un indicateur démographique : il exprime le nombre de garçons par rapport au nombre de filles d'une population donnée.</p><p>En France, on dit que le sexe-ratio des naissances est de 105 : 100, parce qu'il naît environ 105 garçons pour 100 filles.</p>
   <p><b>a)</b> Un paquet de bonbons contient 7 bonbons à la fraise et 10 au cola. Dans quel ratio sont les bonbons à la fraise et au cola ?</p><p><b>b)</b> Un paquet contient 3 bonbons à la fraise, 10 au cola et 5 au citron. Dans quel ratio sont les bonbons à la fraise, au cola et au citron ?</p><p><b>c)</b> Un paquet contient 12 bonbons à la fraise et 10 au cola. Dans quel ratio sont les bonbons à la fraise et au cola ?</p>`,
   c:`<p><b>a)</b> <b>7 : 10</b>.</p><p><b>b)</b> <b>3 : 10 : 5</b>.</p><p><b>c)</b> <b>12 : 10</b>, c'est-à-dire aussi <b>6 : 5</b> (on divise 12 et 10 par 2).</p>`}
 ]},
{t:"Partager une quantité selon un ratio", e:[
  {n:"Activité 1", t:"Le partage de Mona et Ninon", w:"Sur ton cahier", h:`<p>240 € sont partagés entre Mona et Ninon dans le ratio 2 : 3.</p><p><i>Cela signifie que Mona reçoit 2 parts de la somme globale et que Ninon reçoit 3 parts de la somme globale.</i></p><p>Combien chacune d'elles reçoit-elle ?</p>`,
   c:`${bande([2,3],["Mona","Ninon"],"48 €")}<p>2 + 3 = 5 : il y a 5 parts.</p><p>240 ÷ 5 = 48 : une part vaut 48 €.</p><p>Mona : 2 × 48 = <b>96 €</b>. Ninon : 3 × 48 = <b>144 €</b>.</p>`},
  {n:"Exercice 2", t:"La vinaigrette", w:"Sur ton cahier", h:`<p>Retrouve la quantité d'huile et de vinaigre pour 500 mL de vinaigrette réalisée dans le ratio 3 : 1.</p>`,
   c:`<p>Il y a 4 portions (3 + 1).</p><p>500 ÷ 4 = 125 : il y a 125 mL par portion.</p><p>125 × 3 = 375 : il y aura <b>375 mL d'huile</b>.</p><p>125 × 1 = 125 : il y aura <b>125 mL de vinaigre</b>.</p>`},
  {n:"Exercice 3", t:"Les biscuits sablés", w:"Sur ton cahier", h:`<p>Une recette de biscuits sablés commence par la fabrication d'un « sable » réalisé avec de la farine, du beurre et du sucre dans le ratio 10 : 6 : 5.</p><p>Une pâte homogène est ensuite fabriquée avec ce sable et un peu de lait.</p><p>Quelles masses de farine, de beurre et de sucre doit-on prendre pour créer ce « sable » de 630 g ?</p>`,
   c:`<p>Il y a 21 portions (10 + 6 + 5).</p><p>630 ÷ 21 = 30 : il y a 30 g par portion.</p><p>10 × 30 = 300 : il y aura <b>300 g de farine</b>.</p><p>6 × 30 = 180 : il y aura <b>180 g de beurre</b>.</p><p>5 × 30 = 150 : il y aura <b>150 g de sucre</b>.</p>`},
  {n:"Exercice 4", t:"Les chocolats", w:"Sur ton cahier", h:`<p>Les 3 enfants Horatio, William et Juliette ont respectivement 5, 9 et 11 ans.</p><p>On décide de partager 100 chocolats dans le ratio « de leurs âges » 5 : 9 : 11.</p><p>Combien de chocolats aura chaque enfant ?</p>`,
   c:`<p>5 + 9 + 11 = 25 : il y a donc 25 parts.</p><p>Une part représente 100 ÷ 25 = 4 chocolats.</p><p>Horatio aura 5 × 4, soit <b>20 chocolats</b>.</p><p>William aura 9 × 4, soit <b>36 chocolats</b>.</p><p>Juliette aura 11 × 4, soit <b>44 chocolats</b>.</p>`},
  {n:"Exercice 5", t:"L'investissement", w:"Sur ton cahier", h:`<p>J'ai investi 300 € et toi 500 € dans une société.</p><p>Celle-ci a pris de la valeur et nous avons maintenant 11 000 € à nous partager proportionnellement à nos mises.</p><p>Combien chacun de nous va-t-il obtenir ?</p>`,
   c:`<p>Le ratio est de 300 : 500, ou encore 3 : 5. Il y a donc 8 parts.</p><p>11 000 ÷ 8 = 1 375 : une part vaut 1 375 €.</p><p>3 × 1 375 = 4 125 : je récupérerai <b>4 125 €</b>.</p><p>5 × 1 375 = 6 875 : tu récupéreras <b>6 875 €</b>.</p>`},
  {n:"Exercice en + 2", t:"Le loto", w:"Sur ton cahier", h:`<p>Deux amis ont joué au loto. Leur mise s'est faite selon le ratio 3 : 5.</p><p>Ils gagnent 64 €.</p><p>Quelle est la somme d'argent qui revient à chacun d'eux ?</p>`,
   c:`<p>3 + 5 = 8 : il y a 8 parts.</p><p>64 ÷ 8 = 8 : une part vaut 8 €.</p><p>Le premier ami reçoit 3 × 8 = <b>24 €</b> et le second 5 × 8 = <b>40 €</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Écrire un ratio", schema:S_ECR, q:{
 1:[ {g:()=>{ const P=pick([["X","S"],["M","H"],["H","T"],["S","C"]]); let a,b; do{ a=ri(2,9); b=ri(2,12); }while(a===b);
       return {q:`Quel est le ratio ${DE(SYM_NOM[P[0]]+"s")} pour les ${SYM_NOM[P[1]]}s ?`, fig:syms(mix(P[0],a,P[1],b),"Collection de symboles"), c:uniq(R([a,b]),[R([b,a]),R([a,a+b])]), rep:R([a,b]), ex:`On compte ${a} ${SYM_NOM[P[0]]}${a>1?"s":""} et ${b} ${SYM_NOM[P[1]]}${b>1?"s":""} : le ratio est ${R([a,b])}, dans cet ordre.`, sx:S_ECR}; }} ],
 2:[ {g:()=>{ let a,b,c; do{ a=ri(2,12); b=ri(2,12); c=ri(2,12); }while(a===b||b===c||a===c); return {q:`Un paquet contient ${a} bonbons à la fraise, ${b} au cola et ${c} au citron. Dans quel ratio sont les bonbons à la fraise, au cola et au citron ?`, c:uniq(R([a,b,c]),[R([c,b,a]),R([b,a,c]),R([a,b,a+b+c])]), rep:R([a,b,c]), ex:`On écrit les nombres dans l'ordre de la question : ${R([a,b,c])}.`, sx:S_ECR}; }} ],
 3:[ {g:()=>{ const k=pick([2,3,4,5]); let a,b; do{ a=ri(1,7); b=ri(1,7); }while(a===b||gcd(a,b)>1); return {q:`Un paquet contient ${a*k} bonbons à la fraise et ${b*k} au cola. Quel ratio écrit avec les plus petits nombres entiers possibles convient ?`, c:uniq(R([a,b]),[R([b,a]),R([a*k-1,b*k-1].map(x=>Math.max(x,1))),R([a+1,b+1])]), rep:R([a,b]), ex:`${R([a*k,b*k])} : on divise ${a*k} et ${b*k} par ${k}. On obtient ${R([a,b])}.`, sx:S_EG}; }} ]
}},
{nom:"Partager selon un ratio", schema:S_PART, q:{
 1:[ {g:()=>{ const r=pick([[1,2],[2,3],[3,1],[1,4],[3,5],[2,5]]), n=sum(r), p=ri(3,30), Q=n*p, i=ri(0,1), who=["Mona","Ninon"][i]; return {q:`${N(Q)} € sont partagés entre Mona et Ninon dans le ratio ${R(r)}. Combien reçoit ${who} (en €) ?`, rep:[N(r[i]*p), N(r[i]*p)+" €"], ex:`${r.join(" + ")} = ${n} parts. ${N(Q)} ÷ ${n} = ${p} € par part. ${who} : ${r[i]} × ${p} = ${N(r[i]*p)} €.`, sx:S_PART}; }} ],
 2:[ {g:()=>{ const r=pick([[3,1],[2,1],[4,1],[3,2]]), n=sum(r), V=n*ri(5,40)*10; return {q:`On prépare ${N(V)} mL de vinaigrette avec de l'huile et du vinaigre dans le ratio ${R(r)}. Quelle quantité d'huile faut-il (en mL) ?`, rep:[N(V/n*r[0]), N(V/n*r[0])+" mL"], ex:`${n} portions : ${N(V)} ÷ ${n} = ${N(V/n)} mL. Huile : ${r[0]} × ${N(V/n)} = ${N(V/n*r[0])} mL.`, sx:S_PART}; }},
     {g:()=>{ const r=pick([[3,5],[2,3],[1,3],[4,5],[5,7]]), n=sum(r), p=pick([25,50,75,125,250,1375]), Q=n*p; return {q:`Deux associés partagent ${N(Q)} € dans le ratio ${R(r)}. Combien vaut une part (en €) ?`, rep:[N(p), N(p)+" €"], ex:`${r.join(" + ")} = ${n} parts. ${N(Q)} ÷ ${n} = ${N(p)} €.`, sx:S_PART}; }} ],
 3:[ {g:()=>{ const r=pick([[10,6,5],[5,9,11],[1,2,3],[2,3,5],[3,4,5],[1,3,4]]), n=sum(r), p=ri(2,30), Q=n*p, i=ri(0,2), noms=["la farine","le beurre","le sucre"]; return {q:`Un « sable » de ${N(Q)} g est fait de farine, de beurre et de sucre dans le ratio ${R(r)}. Quelle masse de ${noms[i].replace(/^l[ea] /,"")} faut-il (en g) ?`, rep:[N(r[i]*p), N(r[i]*p)+" g"], ex:`${r.join(" + ")} = ${n} parts. ${N(Q)} ÷ ${n} = ${p} g par part. ${r[i]} × ${p} = ${N(r[i]*p)} g.`, sx:S_PART}; }},
     {g:()=>{ const a=pick([100,200,300,400,500]), b=pick([200,300,500,600,700]); if(a===b) return {q:"J'ai investi 300 € et toi 500 €. Nous partageons 11 000 € proportionnellement à nos mises. Combien vais-je obtenir (en €) ?", rep:["4 125","4 125 €"], ex:"Ratio 3 : 5, 8 parts, 1 375 € la part : 3 × 1 375 = 4 125 €.", sx:S_PART};
       const g=gcd(a,b), r=[a/g,b/g], n=sum(r), p=pick([100,250,500,1000]), Q=n*p; return {q:`J'ai investi ${a} € et toi ${b} € dans une société. Nous partageons ${N(Q)} € proportionnellement à nos mises. Combien vais-je obtenir (en €) ?`, rep:[N(r[0]*p), N(r[0]*p)+" €"], ex:`Ratio ${R([a,b])} = ${R(r)} ; ${r.join(" + ")} = ${n} parts. ${N(Q)} ÷ ${n} = ${N(p)} €. Moi : ${r[0]} × ${N(p)} = ${N(r[0]*p)} €.`, sx:S_PART}; }} ]
}},
{nom:"Ratios égaux", schema:S_EG, q:{
 1:[ {g:()=>{ let a,b; do{ a=ri(1,6); b=ri(2,9); }while(a===b||gcd(a,b)>1); const k=ri(2,5); return {q:`Partager une somme dans le ratio ${R([a,b])} revient à la partager dans le ratio…`, c:uniq(R([a*k,b*k]),[R([b,a]),R([a+k,b+k]),R([a*k,b])]), rep:R([a*k,b*k]), ex:`On multiplie ${a} et ${b} par ${k} : ${R([a*k,b*k])}.`, sx:S_EG}; }} ],
 2:[ {g:()=>{ const r=pick([[2,3],[3,4],[1,2],[3,5],[4,5]]), p=ri(4,30), ok=Math.random()<0.5, a=r[0]*p, b=ok?r[1]*p:r[1]*p+pick([1,2,-1]); return {q:`Les nombres ${a} et ${b} sont-ils dans le ratio ${R(r)} ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`{${a}/${r[0]}} = ${N(a/r[0],3)} et {${b}/${r[1]}} ${Number.isInteger(b/r[1])?"=":"≈"} ${N(b/r[1],3)} : ${ok?"les quotients sont égaux.":"les quotients ne sont pas égaux."}`, sx:S_EG}; }} ],
 3:[ {g:()=>{ const r=pick([[2,3],[1,4],[3,5],[2,7],[4,3]]), a=r[0]*ri(2,15); const b=a/r[0]*r[1]; return {q:`Les nombres ${a} et b sont dans le ratio ${R(r)}. Combien vaut b ?`, rep:[N(b)], ex:`{${a}/${r[0]}} = {b/${r[1]}}, donc :<br>b = ${a/r[0]} × ${r[1]}<br>b = ${N(b)}`, sx:S_EG}; }},
     {g:()=>{ const r=pick([[2,3,7],[1,2,3],[2,5,6],[3,4,5]]), p=ri(2,9), ok=Math.random()<0.5, v=r.map(x=>x*p); if(!ok) v[2]+=1; return {q:`Les nombres ${v.join(", ")} sont-ils dans le ratio ${R(r)} ?`, c:["Oui","Non"], rep:ok?"Oui":"Non", ex:`{${v[0]}/${r[0]}} = ${p}, {${v[1]}/${r[1]}} = ${p} et {${v[2]}/${r[2]}} ${ok?"=":"≈"} ${N(v[2]/r[2],2)}.`, sx:S_EG}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 23", duree:45, info:"Durée : 45 min · Calculatrice autorisée · Écris tes calculs et une phrase de réponse.",
comp:[
  ["REPRÉSENTER","J'écris le ratio de deux quantités dans le bon ordre.","Ex. 1 (3 points)"],
  ["CALCULER","Je partage une quantité selon un ratio de deux ou trois nombres.","Ex. 2, 3 et 6 (11 points)"],
  ["RAISONNER","Je reconnais des ratios égaux et j'utilise la définition.","Ex. 4 et 5 (6 points)"]
],
exos:[
{t:"Écrire un ratio", p:3, h:`${syms(["XSSXSSXS","SXSSXS","X"],"Des étoiles et des carrés")}<p><b>a)</b> Quel est le ratio des étoiles par rapport aux carrés ?</p><p><b>b)</b> Quel est le ratio des carrés pour les étoiles ?</p><p><b>c)</b> Écris le ratio du a) avec les plus petits nombres entiers possibles.</p>`,
 c:`<p>On compte 6 étoiles et 9 carrés.</p><p><b>a)</b> <b>6 : 9</b> <i>(1 point)</i></p><p><b>b)</b> <b>9 : 6</b> <i>(1 point)</i></p><p><b>c)</b> On divise 6 et 9 par 3 : <b>2 : 3</b>. <i>(1 point)</i></p>`},
{t:"Le partage", p:3, h:`<p>Léo et Inès partagent 360 € dans le ratio 4 : 5.</p><p>Combien chacun reçoit-il ?</p>`,
 c:`<p>4 + 5 = 9 parts. <i>(1 point)</i></p><p>360 ÷ 9 = 40 : une part vaut 40 €. <i>(1 point)</i></p><p>Léo : 4 × 40 = <b>160 €</b> ; Inès : 5 × 40 = <b>200 €</b>. <i>(1 point)</i></p>`},
{t:"Le béton", p:4, h:`<p>Pour fabriquer du béton, un maçon mélange du ciment, du sable et du gravier dans le ratio 1 : 3 : 4.</p><p>Il veut obtenir 96 kg de mélange.</p><p>Quelles masses de ciment, de sable et de gravier doit-il utiliser ?</p>`,
 c:`<p>1 + 3 + 4 = 8 parts. <i>(1 point)</i></p><p>96 ÷ 8 = 12 : une part vaut 12 kg. <i>(1 point)</i></p><p>Ciment : 1 × 12 = <b>12 kg</b> ; sable : 3 × 12 = <b>36 kg</b> ; gravier : 4 × 12 = <b>48 kg</b>. <i>(2 points)</i></p>`},
{t:"Des ratios égaux", p:3, h:`<p><b>a)</b> Les nombres 84 et 126 sont-ils dans le ratio 2 : 3 ? Justifie.</p><p><b>b)</b> Donne un autre ratio égal à 2 : 3.</p>`,
 c:`<p><b>a)</b> {84/2} = 42 et {126/3} = 42. Donc {84/2} = {126/3} : <b>oui</b>, 84 et 126 sont dans le ratio 2 : 3. <i>(2 points)</i></p><p><b>b)</b> Par exemple <b>4 : 6</b> (on multiplie 2 et 3 par 2). <i>(1 point)</i></p>`},
{t:"QCM", p:3, h:`<p>Pour chaque question, une seule réponse est exacte. Écris le numéro de la question et la lettre de la bonne réponse.</p>${tab(["Question","A","B","C"],[["<b>1)</b> Partager une somme dans le ratio 2 : 3 revient à la partager dans le ratio :","3 : 2","4 : 6","2 : 5"],["<b>2)</b> Un paquet contient 15 bonbons à la fraise et 10 au cola. Le ratio fraise : cola est :","3 : 2","2 : 3","15 : 25"],["<b>3)</b> a et b sont dans le ratio 1 : 4 et a = 7. Alors b est égal à :","11","28","1,75"]])}`,
 c:`<p><b>1)</b> B · <b>2)</b> A (15 : 10 = 3 : 2) · <b>3)</b> B ({7/1} = {b/4}, donc b = 28)</p><p><i>(1 point par bonne réponse)</i></p>`},
{t:"Le bénéfice", p:4, h:`<p>Sam a investi 400 € et Tom 600 € dans une petite entreprise.</p><p>Ils se partagent un bénéfice de 2 500 € proportionnellement à leurs mises.</p><p>Combien chacun reçoit-il ?</p>`,
 c:`<p>Le ratio est 400 : 600, c'est-à-dire 2 : 3. <i>(1 point)</i></p><p>2 + 3 = 5 parts et 2 500 ÷ 5 = 500 : une part vaut 500 €. <i>(1 point)</i></p><p>Sam : 2 × 500 = <b>1 000 €</b> ; Tom : 3 × 500 = <b>1 500 €</b>. <i>(2 points)</i></p>`}
]}
};
})();
