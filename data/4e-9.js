/* 4e — Chapitre 9 : Grandeurs composées (« Proportionnalité 2 – Durée et grandeurs composées », C2)
   Sources : cours, fiche d'exercices « Exercice grandeurs composées », tableau des volumes et des capacités, fiche séquence C2 de M. Staal.
   Pas de corrigé dans les documents : toutes les corrections ont été rédigées et vérifiées. */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const F=(a,b)=>`{${a}/${b}}`;
const exact=x=>Math.abs(x*100-Math.round(x*100))<1e-6;   /* au plus 2 décimales */
const ap=x=>exact(x)?"= "+N(x):"≈ "+N(x,2);               /* « = 25 » ou « ≈ 13,89 » */
const ans=(x,u)=>{ const v=N(exact(x)?x:rd(x,2),2); const L=[v]; if(/,\d$/.test(v)) L.push(v+"0"); return u?[...L,...L.map(s=>s+" "+u),...L.map(s=>s+u)]:L; };
const m2=n=>String(n).padStart(2,"0");
const hm=min=>`${Math.floor(min/60)} h ${Math.round(min%60)} min`;
const hms=s=>`${Math.floor(s/3600)} h ${Math.floor(s%3600/60)} min ${s%60} s`;
const cub=u=>`${u}<sup>3</sup>`, M3="m³";

/* tableau de proportionnalité avec flèche à droite (× 60…) */
let AID=0;
function ptab(o){
  const {h1,h2,r1,r2,side=null}=o, id="ah49_"+(AID++), len=s=>String(s).replace(/<[^>]*>/g,"").replace(/^!/,"").length;
  const cw=r1.map((v,i)=>Math.max(62,Math.max(len(v),len(r2[i]))*9.6+24)), hw=Math.max(len(h1),len(h2))*9.3+28, RH=38, mt=4, mr=side?len(side)*9+58:6;
  const xs=[4+hw]; cw.forEach(w=>xs.push(xs[xs.length-1]+w)); const xe=xs[xs.length-1], W=Math.round(xe+mr), H=2*RH+8, cx=i=>xs[i]+cw[i]/2;
  const cell=(t,x,y,b)=>{ const a=/^!/.test(t); return `<text x="${x.toFixed(1)}" y="${y}" text-anchor="middle" style="font-size:16px;${b?"font-weight:700;":""}${a?"fill:var(--c);font-weight:700":""}">${String(t).replace(/^!/,"")}</text>`; };
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt||"Tableau de proportionnalité"}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--c)"/></marker></defs>`;
  s+=`<rect x="4" y="${mt}" width="${hw}" height="${2*RH}" style="fill:color-mix(in srgb,var(--c) 10%,transparent)"/>`+cell(h1,4+hw/2,mt+RH/2+6,1)+cell(h2,4+hw/2,mt+1.5*RH+6,1);
  s+=`<rect x="4" y="${mt}" width="${(xe-4).toFixed(1)}" height="${2*RH}" class="thin"/><line x1="4" y1="${mt+RH}" x2="${xe.toFixed(1)}" y2="${mt+RH}" class="thin"/>`;
  xs.slice(0,-1).forEach(x=>{ s+=`<line x1="${x.toFixed(1)}" y1="${mt}" x2="${x.toFixed(1)}" y2="${mt+2*RH}" class="thin"/>`; });
  r1.forEach((v,i)=>{ s+=cell(v,cx(i),mt+RH/2+6)+cell(r2[i],cx(i),mt+1.5*RH+6); });
  if(side){ const y1=mt+RH/2, y2=mt+1.5*RH; s+=`<path d="M${(xe+4).toFixed(1)} ${y1} C${(xe+40).toFixed(1)} ${y1} ${(xe+40).toFixed(1)} ${y2} ${(xe+6).toFixed(1)} ${y2}" class="arrw" marker-end="url(#${id})"/><text x="${(xe+42).toFixed(1)}" y="${mt+RH+6}" class="alab" style="text-anchor:start">${side}</text>`; }
  return s+"</svg>";
}
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map((h,i)=>`<th>${i?h:`<b>${h}</b>`}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* tableau des volumes et des capacités (document de M. Staal) */
const VOL=(()=>{ const U=["km","hm","dam","m","dm","cm","mm"], CAP={11:"kL",12:"hL",13:"daL",14:"L",15:"dL",16:"cL",17:"mL"};
  let h=`<div class="scroll"><table class="std" style="text-align:center"><thead><tr>${U.map(u=>`<th colspan="3" style="text-align:right">${cub(u)}</th>`).join("")}</tr></thead><tbody><tr>`;
  for(let i=0;i<21;i++) h+=`<td style="min-width:30px;padding:6px 2px">${CAP[i]?`<b>${CAP[i]}</b>`:""}</td>`;
  return h+`</tr><tr>${"<td></td>".repeat(21)}</tr></tbody></table></div><p class="calc">1 L = 1 dm<sup>3</sup> · 1 m<sup>3</sup> = 1 000 L · 1 cm<sup>3</sup> = 1 mL</p>`; })();

window.P49={ptab, tab, N, F, ans, ap, exact, rd, hm, hms, m2, cub, M3};

/* ===================== schémas ===================== */
const S_DUR=sch("Convertir des durées", ptab({h1:"Durée (en h)",h2:"Durée (en min)",r1:["1","0,6"],r2:["60","!36"],side:"× 60"})+`<p class="calc">1 h = 60 min · 1 min = 60 s · 1 h = 3 600 s</p><p class="calc"><i>t</i> = 35,6 h<br><i>t</i> = 35 h + 0,6 × 60 min<br><i>t</i> = 35 h 36 min</p><p class="schN">Dans l'autre sens, je divise par 60 :</p><p class="calc"><i>t</i> = 25 min<br><i>t</i> = 25 ÷ 60 h<br><i>t</i> ≈ 0,42 h</p>`);
const S_GC=sch("Grandeurs produits et grandeurs quotients", `<p class="schN"><b>Produit</b> (on multiplie) : aire en m × m = m<sup>2</sup> ; volume en ${M3} ; énergie en kW × h = kWh.</p><p class="schN"><b>Quotient</b> (on divise) : vitesse en km/h ou m/s ; débit en ${M3}/h ou L/s ; prix au kilo en €/kg ; consommation en L/100 km ; densité en hab/km<sup>2</sup>.</p>`);
const S_V=sch("La vitesse", `<p class="calc">v = ${F("d","t")}</p><p class="schN">d en km et t en h : v en km/h. d en m et t en s : v en m/s.</p><p class="calc">37 km en 21 min : 21 min = 0,35 h et 37 ÷ 0,35 ≈ 105,71 km/h</p>`);
const S_CV=sch("Convertir une vitesse", `<p class="calc"><i>v</i> = 90 km/h<br><i>v</i> = ${F("90 km","1 h")}<br><i>v</i> = ${F("90 000 m","3 600 s")}<br><i>v</i> = 25 m/s</p><p class="calc"><i>v</i> = 28 m/s<br><i>v</i> = ${F("28 m","1 s")}<br><i>v</i> = ${F("28 × 3 600 m","3 600 s")}<br><i>v</i> = ${F("100 800 m","1 h")}<br><i>v</i> = 100,8 km/h</p><p class="schN">km/h → m/s : je divise par 3,6. m/s → km/h : je multiplie par 3,6.</p>`);
const S_DEB=sch("Convertir un débit", `<p class="calc"><i>D</i> = 1 620 ${M3}/h<br><i>D</i> = ${F("1 620 "+M3,"3 600 s")}<br><i>D</i> = 0,45 ${M3}/s</p><p class="calc"><i>D</i> = 0,45 ${M3}/s<br><i>D</i> = ${F("450 L","1 s")}<br><i>D</i> = 450 L/s</p><p class="schN">1 h = 3 600 s et 1 ${M3} = 1 000 L.</p>`);

/* ---------- générateurs ---------- */
const decH=()=>{ const m=pick([3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57]); const h=ri(1,12); return {h, m, x:rd(h+m/60)}; };   /* h décimal exact au centième */

CH["4e-9"] = {
intro:"Convertir des durées (heures, minutes, secondes), reconnaître des grandeurs produits et des grandeurs quotients, calculer une vitesse moyenne et convertir des vitesses (km/h, m/s) et des débits (m³/h, m³/s, L/s).",
savoir:[
  "convertir des durées : heures décimales, heures et minutes, secondes ;",
  "reconnaître une grandeur produit et une grandeur quotient, et donner son unité ;",
  "calculer une vitesse moyenne avec v = d ÷ t ;",
  "convertir une vitesse de km/h en m/s et inversement ;",
  "convertir un débit (m³/h, m³/s, L/s, L/min) ;",
  "utiliser la proportionnalité pour résoudre un problème avec des grandeurs composées."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Conversion de durées", h:`
  <div class="retenir" data-l="À connaître"><p class="calc">1 h = 60 min · 1 min = 60 s · 1 h = 3 600 s</p></div>
  <p><b>Exercice 1 :</b> sur mon bulletin de paye, c'est indiqué que j'ai travaillé 35,6 h ce mois-ci.</p><p>Combien de temps, en heures et minutes, ai-je travaillé ce mois ?</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">35,6 h = 35 h + 0,6 h</p><p class="calc"><i>t</i> = 0,6 h<br><i>t</i> = 0,6 × 60 min<br><i>t</i> = 36 min</p>${ptab({h1:"Durée (en h)",h2:"Durée (en min)",r1:["1","0,6"],r2:["60","!36"],side:"× 60"})}<p>J'ai travaillé <b>35 h 36 min</b>.</p></div></details>
  <p><b>Exercice 2 :</b> ce soir, j'ai fait 25 min de temps supplémentaire à mon travail.</p><p>À combien d'heures cela correspond-il ? Arrondis le nombre au centième près.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc"><i>t</i> = 25 min<br><i>t</i> = ${F(25,60)} h<br><i>t</i> = 25 ÷ 60 h<br><i>t</i> ≈ 0,42 h</p><p>Cela correspond à environ <b>0,42 h</b>.</p></div></details>
  <p><b>Exercice 3 :</b> convertis.</p><p><b>a)</b> 265 min = ……. h ……. min</p><p><b>b)</b> 946 min = ……. h ……. min</p><p><b>c)</b> 25 792 s = …. h …. min … s</p>
  <details><summary>Voir la correction</summary><div class="corr"><p><b>a)</b> 265 = 4 × 60 + 25, donc 265 min = <b>4 h 25 min</b>.</p><p><b>b)</b> 946 = 15 × 60 + 46, donc 946 min = <b>15 h 46 min</b>.</p>
   <p><b>c)</b> 25 792 = 7 × 3 600 + 592 et 592 = 9 × 60 + 52.</p><p>Donc 25 792 s = <b>7 h 9 min 52 s</b>.</p></div></details>
  <div class="retenir" data-l="Méthode"><p><b>Heures décimales → heures et minutes :</b> je multiplie la partie décimale par 60. Exemple :</p><p class="calc"><i>t</i> = 0,6 h<br><i>t</i> = 0,6 × 60 min<br><i>t</i> = 36 min</p><p><b>Minutes → heures :</b> je divise par 60.</p><p><b>Minutes → heures et minutes :</b> je cherche combien de fois 60 il y a dans le nombre de minutes, le reste donne les minutes.</p></div>`},
{k:"2", t:"Grandeurs composées", h:`
  <h4>a) Définitions de grandeurs produits et grandeurs quotients</h4>
  <div class="retenir" data-l="Définition"><p>Une <b>grandeur produit</b> est obtenue en multipliant des grandeurs.</p></div>
  <p><b>Exemples :</b></p>${tab(["Grandeurs produits","Unités"],[["Aire","m × m = m<sup>2</sup> ou cm × cm = cm<sup>2</sup>"],["Volume",`m × m × m = ${M3}`],["Énergie","kW × h = kWh (se lit « kilowattheure »)"]])}
  <p>Un lave-vaisselle a une puissance de 1 kW et il lave pendant 3 h : il consomme une énergie de 1 kW × 3 h = 3 kWh.</p>
  <div class="retenir" data-l="Définition"><p>Une <b>grandeur quotient</b> est obtenue en divisant deux grandeurs.</p></div>
  <p><b>Exemples :</b></p>${tab(["Grandeurs quotients","Unités"],[["Vitesse","km/h ou m/s"],["Débit",`${M3}/h ou L/s`],["Prix au kilo","€/kg"],["Consommation d'essence","L/100 km"],["Densité de population","hab/km<sup>2</sup>"]])}
  <h4>b) Formules de la vitesse</h4>
  <div class="retenir" data-l="Propriété"><p>La vitesse <i>v</i> est le quotient de la distance <i>d</i> par le temps <i>t</i> :</p><p class="calc"><i>v</i> = ${F("d","t")}</p><p>Si la distance <i>d</i> est en m et le temps <i>t</i> en s, alors la vitesse <i>v</i> sera en <b>m/s</b>.</p><p>Si la distance <i>d</i> est en km et le temps <i>t</i> en h, alors la vitesse <i>v</i> sera en <b>km/h</b>.</p></div>
  <p><b>Exercice :</b></p><p><b>a)</b> J'ai parcouru 37 km en voiture en 21 min. Quelle a été ma vitesse moyenne en km/h ? Arrondis au centième.</p><p><b>b)</b> J'ai parcouru 90 km en voiture en une heure et 34 min. Quelle a été ma vitesse moyenne en m/s ? Arrondis au centième.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p><b>a)</b> La durée :</p><p class="calc"><i>t</i> = 21 min<br><i>t</i> = 21 ÷ 60 h<br><i>t</i> = 0,35 h</p><p class="calc"><i>v</i> = ${F("37 km","0,35 h")}<br><i>v</i> ≈ 105,71 km/h</p>
   <p><b>b)</b> La durée :</p><p class="calc"><i>t</i> = 1 h 34 min<br><i>t</i> = 94 min<br><i>t</i> = 94 × 60 s<br><i>t</i> = 5 640 s</p><p>Et 90 km = 90 000 m.</p><p class="calc"><i>v</i> = ${F("90 000 m","5 640 s")}<br><i>v</i> ≈ 15,96 m/s</p></div></details>
  <h4>c) Conversion de grandeurs composées</h4>
  <div class="retenir" data-l="Méthode"><p>On écrit la grandeur comme un quotient, puis on convertit chaque unité :</p><p class="calc"><i>v</i> = 132 km/h<br><i>v</i> = ${F("132 km","1 h")}<br><i>v</i> = ${F("132 000 m","3 600 s")}<br><i>v</i> ≈ 36,67 m/s</p><p>On utilise 1 h = 3 600 s, 1 km = 1 000 m et 1 ${M3} = 1 000 L.</p></div>
  <div class="retenir" data-l="À retenir"><p><b>Tableau des volumes et des capacités</b> (1 L = 1 dm<sup>3</sup>) :</p>${VOL}</div>
  <p><b>Exercice :</b></p><p><b>a)</b> Convertis la vitesse de 90 km/h en m/s.</p><p><b>b)</b> Convertis la vitesse de 28 m/s en km/h.</p><p><b>c)</b> Convertis le débit de 1 900 ${M3}/h en ${M3}/s (arrondi au centième), puis en L/s.</p><p><b>d)</b> Convertis le débit de 0,326 ${M3}/s en ${M3}/h.</p>
  <details><summary>Voir la correction</summary><div class="corr">
   <p><b>a)</b></p><p class="calc"><i>v</i> = 90 km/h<br><i>v</i> = ${F("90 km","1 h")}<br><i>v</i> = ${F("90 000 m","3 600 s")}<br><i>v</i> = <b>25 m/s</b></p>
   <p><b>b)</b></p><p class="calc"><i>v</i> = 28 m/s<br><i>v</i> = ${F("28 m","1 s")}<br><i>v</i> = ${F("28 × 3 600 m","3 600 s")}<br><i>v</i> = ${F("100 800 m","1 h")}<br><i>v</i> = <b>100,8 km/h</b></p>
   <p><b>c)</b></p><p class="calc"><i>D</i> = 1 900 ${M3}/h<br><i>D</i> = ${F("1 900 "+M3,"3 600 s")}<br><i>D</i> ≈ <b>0,53 ${M3}/s</b></p><p>1 900 ${M3} = 1 900 000 L, donc :</p><p class="calc"><i>D</i> = 1 900 ${M3}/h<br><i>D</i> = ${F("1 900 000 L","3 600 s")}<br><i>D</i> ≈ <b>527,78 L/s</b></p><p>(Environ 530 L/s si on part de 0,53 ${M3}/s.)</p>
   <p><b>d)</b></p><p class="calc"><i>D</i> = 0,326 ${M3}/s<br><i>D</i> = ${F("0,326 × 3 600 "+M3,"3 600 s")}<br><i>D</i> = ${F("1 173,6 "+M3,"1 h")}<br><i>D</i> = <b>1 173,6 ${M3}/h</b></p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Conversions de durées", e:[
  {n:"Exercice sur les durées", t:"Convertir des durées", w:"Sur ton cahier", h:`<p>Écris tes calculs à côté de chaque conversion.</p>
   <p><b>1) Convertis des heures en heures et minutes.</b></p><p><b>a)</b> 1,3 h = ……. h ……. min · <b>b)</b> 3,25 h = ……. h ……. min · <b>c)</b> 2,35 h = ……. h ……. min</p>
   <p><b>2) Convertis des minutes en heures.</b></p><p><b>a)</b> 24 min = ……. h · <b>b)</b> 3 min = ……. h · <b>c)</b> 48 min = ……. h</p>
   <p><b>3) Convertis des heures et minutes en heures.</b></p><p><b>a)</b> 1 h 27 = ……. h · <b>b)</b> 2 h 54 = ……. h · <b>c)</b> 2 h 06 = ……. h</p>
   <p><b>4) Convertis des minutes en heures et minutes.</b></p><p><b>a)</b> 74 min · <b>b)</b> 129 min · <b>c)</b> 387 min · <b>d)</b> 514 min · <b>e)</b> 1 352 min</p>
   <p><b>5) Convertis des secondes en heures, minutes et secondes.</b></p><p><b>a)</b> 8 643 s · <b>b)</b> 10 567 s · <b>c)</b> 27 465 s</p>`,
   c:`<p><b>1)</b> <b>a)</b> 0,3 × 60 = 18 : 1,3 h = <b>1 h 18 min</b> · <b>b)</b> 0,25 × 60 = 15 : 3,25 h = <b>3 h 15 min</b> · <b>c)</b> 0,35 × 60 = 21 : 2,35 h = <b>2 h 21 min</b></p>
   <p><b>2)</b> <b>a)</b> 24 ÷ 60 = <b>0,4 h</b> · <b>b)</b> 3 ÷ 60 = <b>0,05 h</b> · <b>c)</b> 48 ÷ 60 = <b>0,8 h</b></p>
   <p><b>3)</b> <b>a)</b> 27 ÷ 60 = 0,45 : 1 h 27 = <b>1,45 h</b> · <b>b)</b> 54 ÷ 60 = 0,9 : 2 h 54 = <b>2,9 h</b> · <b>c)</b> 6 ÷ 60 = 0,1 : 2 h 06 = <b>2,1 h</b></p>
   <p><b>4)</b> <b>a)</b> 74 = 60 + 14 : <b>1 h 14 min</b> · <b>b)</b> 129 = 2 × 60 + 9 : <b>2 h 9 min</b> · <b>c)</b> 387 = 6 × 60 + 27 : <b>6 h 27 min</b> · <b>d)</b> 514 = 8 × 60 + 34 : <b>8 h 34 min</b> · <b>e)</b> 1 352 = 22 × 60 + 32 : <b>22 h 32 min</b></p>
   <p><b>5)</b> <b>a)</b> 8 643 = 2 × 3 600 + 1 443 et 1 443 = 24 × 60 + 3 : <b>2 h 24 min 3 s</b></p><p><b>b)</b> 10 567 = 2 × 3 600 + 3 367 et 3 367 = 56 × 60 + 7 : <b>2 h 56 min 7 s</b></p><p><b>c)</b> 27 465 = 7 × 3 600 + 2 265 et 2 265 = 37 × 60 + 45 : <b>7 h 37 min 45 s</b></p>`}
 ]},
{t:"Prix au kilo et débits", e:[
  {n:"Activité 1", t:"Le prix des courgettes", w:"Sur ton cahier", h:`<p>J'ai acheté 3 kilos de courgettes à 7,23 €.</p><p><b>a)</b> Quel est le prix d'un kilo de courgettes ?</p><p><b>b)</b> Le prix que tu as trouvé à la question a) est affiché dans les supermarchés. Comment l'appelle-t-on ?</p>`,
   c:`<p><b>a)</b> 7,23 ÷ 3 = 2,41 : un kilo de courgettes coûte <b>2,41 €</b>.</p><p><b>b)</b> C'est le <b>prix au kilo</b> : 2,41 €/kg. C'est une grandeur quotient (un prix divisé par une masse).</p>`},
  {n:"Exercice 1", t:"Le débit d'une rivière", w:"Sur ton cahier", h:`<p>En 4 s, la rivière Dordogne a fait couler 1 800 ${M3} d'eau.</p><p><b>a)</b> La quantité d'eau qui coule en 1 s définit le débit. Quel est donc le débit de cette rivière ?</p><p><b>b)</b> Quelle est l'unité qui permet d'exprimer ce débit ?</p>`,
   c:`<p><b>a)</b> 1 800 ÷ 4 = 450 : le débit est de <b>450 ${M3}</b> par seconde.</p><p><b>b)</b> On l'exprime en <b>${M3}/s</b> (mètres cubes par seconde).</p>`},
  {n:"Exercice 2", t:"Le débit d'un aqueduc", w:"Sur ton cahier", h:`<p>Le pont du Gard est la partie la plus connue d'un aqueduc long de 50 km qui amenait de l'eau d'Uzès jusqu'à Nîmes.</p><p>Son débit était de 1 620 ${M3}/h au moment de la construction.</p><p>Exprime ce débit en ${M3}/s.</p>`,
   c:`<p class="calc"><i>D</i> = 1 620 ${M3}/h<br><i>D</i> = ${F("1 620 "+M3,"1 h")}<br><i>D</i> = ${F("1 620 "+M3,"3 600 s")}<br><i>D</i> = 0,45 ${M3}/s</p><p>Le débit était de <b>0,45 ${M3}/s</b>.</p>`},
  {n:"Exercice 3", t:"Convertir des débits", w:"Sur ton cahier", h:`<p>Convertis :</p><p><b>a)</b> 2 412 ${M3}/h en ${M3}/s.</p><p><b>b)</b> 2 052 ${M3}/h en ${M3}/s, puis en L/s.</p><p><b>c)</b> 3 180 ${M3}/h en L/min.</p><p>Tu peux t'aider du tableau des volumes et des capacités :</p>${VOL}`,
   c:`<p><b>a)</b></p><p class="calc"><i>D</i> = 2 412 ${M3}/h<br><i>D</i> = ${F("2 412 "+M3,"3 600 s")}<br><i>D</i> = <b>0,67 ${M3}/s</b></p><p><b>b)</b></p><p class="calc"><i>D</i> = 2 052 ${M3}/h<br><i>D</i> = ${F("2 052 "+M3,"3 600 s")}<br><i>D</i> = <b>0,57 ${M3}/s</b></p><p>Et 0,57 ${M3} = 570 L, donc 0,57 ${M3}/s = <b>570 L/s</b>.</p>
   <p><b>c)</b> 3 180 ${M3} = 3 180 000 L et 1 h = 60 min, donc :</p><p class="calc"><i>D</i> = 3 180 ${M3}/h<br><i>D</i> = ${F("3 180 000 L","60 min")}<br><i>D</i> = <b>53 000 L/min</b></p>`}
 ]},
{t:"Vitesses", e:[
  {n:"Exercice 4", t:"La vitesse d'une voiture", w:"Sur ton cahier", h:`<p><b>a)</b> Une voiture roule à 75 km/h. Quelle est sa vitesse en m/s ? Arrondis au centième près.</p><p><b>b)</b> Une voiture roule à 12 m/s. Quelle est sa vitesse en km/h ?</p>`,
   c:`<p><b>a)</b></p><p class="calc"><i>v</i> = 75 km/h<br><i>v</i> = ${F("75 000 m","3 600 s")}<br><i>v</i> ≈ <b>20,83 m/s</b></p><p><b>b)</b></p><p class="calc"><i>v</i> = 12 m/s<br><i>v</i> = ${F("12 × 3 600 m","3 600 s")}<br><i>v</i> = ${F("43 200 m","1 h")}<br><i>v</i> = <b>43,2 km/h</b></p>`},
  {n:"Exercice 5", t:"Convertir des vitesses", w:"Sur ton cahier", h:`<p>Convertis :</p><p><b>a)</b> 108 km/h en m/s.</p><p><b>b)</b> 50 km/h en m/s.</p><p><b>c)</b> 40 m/s en km/h.</p><p><b>d)</b> 50 m/s en km/h.</p>`,
   c:`<p><b>a)</b></p><p class="calc"><i>v</i> = 108 km/h<br><i>v</i> = ${F("108 000 m","3 600 s")}<br><i>v</i> = <b>30 m/s</b></p><p><b>b)</b></p><p class="calc"><i>v</i> = 50 km/h<br><i>v</i> = ${F("50 000 m","3 600 s")}<br><i>v</i> ≈ <b>13,89 m/s</b></p><p><b>c)</b> 40 m/s : 40 × 3 600 = 144 000 m en 1 h, soit <b>144 km/h</b></p><p><b>d)</b> 50 m/s : 50 × 3 600 = 180 000 m en 1 h, soit <b>180 km/h</b></p>`},
  {n:"Exercice 5 bis", t:"Course à pied", w:"Sur ton cahier", h:`<p>Arrondis chaque résultat au centième.</p><p><b>a)</b> J'ai couru 4 km en 22 min. Quelle est ma vitesse moyenne en m/s ?</p><p><b>b)</b> J'ai couru 9 km en 38 min. Quelle est ma vitesse moyenne en km/h ?</p><p><b>c)</b> Course de 15 km en 1 h 12 min. Vitesse moyenne en m/s ?</p><p><b>d)</b> Course de 20 km en 1 h 28 min. Vitesse moyenne en km/h ?</p>`,
   c:`<p><b>a)</b> 4 km = 4 000 m et 22 min = 1 320 s :</p><p class="calc"><i>v</i> = ${F("4 000 m","1 320 s")}<br><i>v</i> ≈ <b>3,03 m/s</b></p>
   <p><b>b)</b> 38 min = ${F(38,60)} h :</p><p class="calc"><i>v</i> = 9 ÷ ${F(38,60)}<br><i>v</i> = ${F("9 × 60",38)}<br><i>v</i> ≈ <b>14,21 km/h</b></p>
   <p><b>c)</b> 15 km = 15 000 m et :</p><p class="calc"><i>t</i> = 1 h 12 min<br><i>t</i> = 72 min<br><i>t</i> = 4 320 s</p><p class="calc"><i>v</i> = ${F("15 000 m","4 320 s")}<br><i>v</i> ≈ <b>3,47 m/s</b></p>
   <p><b>d)</b></p><p class="calc"><i>t</i> = 1 h 28 min<br><i>t</i> = 88 min<br><i>t</i> = ${F(88,60)} h</p><p class="calc"><i>v</i> = 20 ÷ ${F(88,60)}<br><i>v</i> = ${F("20 × 60",88)}<br><i>v</i> ≈ <b>13,64 km/h</b></p>`},
  {n:"Exercice 6", t:"Course à pied", w:"Sur ton cahier", h:`<p>Ludivine court en moyenne à 10 km/h.</p><p><b>a)</b> Quelle distance parcourra-t-elle en 24 min ?</p><p><b>b)</b> Combien de temps mettra-t-elle, en heures et minutes, pour parcourir 39 km ?</p>`,
   c:`${ptab({h1:"Durée (en h)",h2:"Distance (en km)",r1:["1","0,4","!3,9"],r2:["10","!4","39"],side:"× 10"})}<p><b>a)</b> La durée :</p><p class="calc"><i>t</i> = 24 min<br><i>t</i> = 24 ÷ 60 h<br><i>t</i> = 0,4 h</p><p>Distance : 10 × 0,4 = <b>4 km</b>.</p><p><b>b)</b> 39 ÷ 10 = 3,9 h. Et 0,9 × 60 = 54 min. Elle mettra <b>3 h 54 min</b>.</p>`}
 ]},
{t:"Découvrir d'autres grandeurs composées", e:[
  {n:"Exercice 7", t:"Découverte de grandeurs composées", w:"Sur ton cahier", h:`<p><b>a)</b> Le débit <i><b>D</b></i> d'une connexion Internet est le quotient de la quantité de données <i><b>Q</b></i> (en bits) par la durée <i><b>t</b></i> (en s). Dans quelle unité est exprimé le débit <i><b>D</b></i> ?</p><p><b>b)</b> En physique, l'énergie <i><b>E</b></i> est égale au produit de la puissance <i><b>P</b></i> (en watts) par la durée <i><b>t</b></i> (en h). Dans quelle unité est exprimée l'énergie <i><b>E</b></i> ?</p>`,
   c:`<p><b>a)</b> <i>D</i> = ${F("Q","t")} : le débit s'exprime en <b>bits/s</b> (bits par seconde). C'est une grandeur quotient.</p><p><b>b)</b> <i>E</i> = <i>P</i> × <i>t</i> : l'énergie s'exprime en W × h = <b>Wh</b> (wattheure). C'est une grandeur produit.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Conversions de durées", schema:S_DUR, q:{
 1:[ {g:()=>{ const m=pick([6,12,15,18,24,30,36,42,45,48,54]); return {q:`Convertis ${m} min en heures (nombre décimal).`, rep:ans(m/60,"h"), ex:`${m} ÷ 60 = ${N(m/60)} h.`, sx:S_DUR}; }},
     {g:()=>{ const h=ri(1,9), m=ri(5,55); return {q:`Combien de minutes y a-t-il dans ${h} h ${m2(m)} ?`, rep:ans(h*60+m,"min"), ex:`${h} × 60 + ${m} = ${h*60+m} min.`, sx:S_DUR}; }} ],
 2:[ {g:()=>{ const D=decH(); return {q:`${N(D.x)} h = … h … min`, t:"□ h □ min", r:[String(D.h),String(D.m)], ex:`0,${String(N(D.x)).split(",")[1]} × 60 = ${D.m} : ${N(D.x)} h = ${D.h} h ${D.m} min.`, sx:S_DUR}; }},
     {g:()=>{ const t=ri(65,1400); return {q:`${N(t)} min = … h … min`, t:"□ h □ min", r:[String(Math.floor(t/60)),String(t%60)], ex:`${N(t)} = ${Math.floor(t/60)} × 60 + ${t%60}.`, sx:S_DUR}; }} ],
 3:[ {g:()=>{ const s=ri(3700,36000); return {q:`${N(s)} s = … h … min … s`, t:"□ h □ min □ s", r:[String(Math.floor(s/3600)),String(Math.floor(s%3600/60)),String(s%60)], ex:`${N(s)} = ${Math.floor(s/3600)} × 3 600 + ${N(s%3600)} et ${N(s%3600)} = ${Math.floor(s%3600/60)} × 60 + ${s%60}.`, sx:S_DUR}; }},
     {g:()=>{ const D=decH(); const bad=`${D.h} h ${String(N(D.x)).split(",")[1]||0} min`; const good=`${D.h} h ${D.m} min`; return {q:`Que vaut ${N(D.x)} h ?`, c:uniq(good,[bad,`${D.h+1} h ${D.m} min`]), rep:good, ex:`Attention : 0,${String(N(D.x)).split(",")[1]} h n'est pas ${String(N(D.x)).split(",")[1]} min ! 0,${String(N(D.x)).split(",")[1]} × 60 = ${D.m} min.`, sx:S_DUR}; }} ]
}},
{nom:"Grandeurs produits et quotients", schema:S_GC, q:{
 1:[ {g:()=>{ const L=[["une vitesse","quotient"],["un débit","quotient"],["un prix au kilo","quotient"],["une densité de population","quotient"],["une consommation d'essence","quotient"],["une aire","produit"],["un volume","produit"],["une énergie en kWh","produit"]]; const [g,r]=pick(L); return {q:`${g[0].toUpperCase()+g.slice(1)} est une grandeur…`, c:["produit","quotient"], rep:r, ex:r==="produit"?"On l'obtient en multipliant des grandeurs.":"On l'obtient en divisant deux grandeurs.", sx:S_GC}; }} ],
 2:[ {g:()=>{ const L=[["de vitesse","km/h",["km × h","kg/m"]],["de débit",`${M3}/h`,[`${M3} × h`,"m/s"]],["de densité de population","hab/km<sup>2</sup>",["hab × km<sup>2</sup>","km/h"]],["d'énergie","kWh",["kW/h","W/s"]],["de prix au kilo","€/kg",["€ × kg","kg/€"]]]; const [g,u,b]=pick(L); return {q:`Quelle est une unité ${g} ?`, c:uniq(u,b), rep:u, ex:`${u} est une unité ${g}.`, sx:S_GC}; }} ],
 3:[ {g:()=>{ const P=pick([0.5,1,1.5,2,2.5]), t=pick([2,3,4,1.5]); return {q:`Un appareil de puissance ${N(P)} kW fonctionne pendant ${N(t)} h. Quelle énergie consomme-t-il (en kWh) ?`, rep:ans(P*t,"kWh"), ex:`<br>E = P × t<br>E = ${N(P)} kW × ${N(t)} h<br>E = ${N(P*t)} kWh`, sx:S_GC}; }} ]
}},
{nom:"Calculer une vitesse", schema:S_V, q:{
 1:[ {g:()=>{ const v=pick([40,45,50,60,70,80,90,110]), t=pick([2,3,4,1.5,2.5]); return {q:`Une voiture parcourt ${N(v*t)} km en ${N(t)} h. Quelle est sa vitesse moyenne en km/h ?`, rep:ans(v,"km/h"), ex:`<br>v = ${F(N(v*t)+" km",N(t)+" h")}<br>v = ${v} km/h`, sx:S_V}; }} ],
 2:[ {g:()=>{ let v,m; do{ v=pick([60,72,80,90,100,120]); m=pick([15,20,30,45,40]); }while(!Number.isInteger(v*m/60)); return {q:`À ${v} km/h, quelle distance (en km) parcourt-on en ${m} min ?`, rep:ans(v*m/60,"km"), ex:exact(m/60)?`${m} min = ${N(m/60)} h ; ${v} × ${N(m/60)} = ${N(v*m/60)} km.`:`${m} min = ${F(m,60)} h.<br>d = ${v} × ${F(m,60)}<br>d = ${F(`${v} × ${m}`,60)}<br>d = ${N(v*m/60)} km`, sx:S_V}; }} ],
 3:[ {g:()=>{ let d,m,v; do{ d=ri(5,40); m=ri(15,58); v=d/(m/60); }while(exact(v)); return {q:`J'ai parcouru ${d} km en ${m} min. Quelle est ma vitesse moyenne en km/h ? (arrondi au centième)`, rep:ans(v,"km/h"), ex:`${m} min = ${F(m,60)} h.<br>v = ${F(`${d} × 60`,m)}<br>v ≈ ${N(v,2)} km/h`, sx:S_V}; }},
     {g:()=>{ const v=pick([8,10,12,15]); let d; do{ d=ri(5,45); }while(!Number.isInteger(d*60/v)); const T=d*60/v; return {q:`Ludivine court à ${v} km/h. Combien de temps met-elle pour parcourir ${d} km ?`, t:"□ h □ min", r:[String(Math.floor(T/60)),String(T%60)], ex:`<br>t = ${d} ÷ ${v} h<br>t = ${F(`${d} × 60`,v)} min<br>t = ${T} min<br>t = ${hm(T)}`, sx:S_V}; }} ]
}},
{nom:"Convertir des vitesses", schema:S_CV, q:{
 1:[ {g:()=>{ const v=pick([18,36,54,72,90,108,126,144]); return {q:`Convertis ${v} km/h en m/s.`, rep:ans(v/3.6,"m/s"), ex:`${F(N(v*1000)+" m","3 600 s")} = ${N(v/3.6)} m/s.`, sx:S_CV}; }} ],
 2:[ {g:()=>{ const v=ri(5,60); return {q:`Convertis ${v} m/s en km/h.`, rep:ans(v*3.6,"km/h"), ex:`${v} × 3 600 = ${N(v*3600)} m en 1 h, soit ${N(v*3.6)} km/h.`, sx:S_CV}; }} ],
 3:[ {g:()=>{ let v; do{ v=ri(20,130); }while(exact(v/3.6)); return {q:`Convertis ${v} km/h en m/s (arrondi au centième).`, rep:ans(v/3.6,"m/s"), ex:`${F(N(v*1000)+" m","3 600 s")} ≈ ${N(v/3.6,2)} m/s.`, sx:S_CV}; }},
     {q:"Pour passer de km/h à m/s, on…", c:["divise par 3,6","multiplie par 3,6","divise par 60"], rep:"divise par 3,6", ex:"1 km/h = 1 000 m ÷ 3 600 s, donc on divise par 3 600 ÷ 1 000 = 3,6.", sx:S_CV} ]
}},
{nom:"Convertir des débits", schema:S_DEB, q:{
 1:[ {g:()=>{ const s=pick([0.25,0.3,0.45,0.5,0.6,0.75,0.8]); return {q:`Convertis ${N(s*3600)} ${M3}/h en ${M3}/s.`, rep:ans(s,"m³/s"), ex:`${F(N(s*3600)+" "+M3,"3 600 s")} = ${N(s)} ${M3}/s.`, sx:S_DEB}; }} ],
 2:[ {g:()=>{ const s=pick([0.25,0.3,0.45,0.57,0.6,0.67,0.8]); return {q:`Convertis ${N(s)} ${M3}/s en L/s.`, rep:ans(s*1000,"L/s"), ex:`1 ${M3} = 1 000 L, donc ${N(s)} ${M3}/s = ${N(s*1000)} L/s.`, sx:S_DEB}; }},
     {g:()=>{ const s=rd(ri(100,900)/1000,3); return {q:`Convertis ${N(s)} ${M3}/s en ${M3}/h.`, rep:ans(s*3600,"m³/h"), ex:`${N(s)} × 3 600 = ${N(s*3600)} ${M3}/h.`, sx:S_DEB}; }} ],
 3:[ {g:()=>{ const q=pick([60,120,180,240,300,600,1200,3180]); return {q:`Convertis ${N(q)} ${M3}/h en L/min.`, rep:ans(q*1000/60,"L/min"), ex:`${N(q)} ${M3} = ${N(q*1000)} L et 1 h = 60 min : ${F(N(q*1000)+" L","60 min")} = ${N(q*1000/60)} L/min.`, sx:S_DEB}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 9", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Les calculs et les unités doivent être écrits",
comp:[
  ["CALCULER","Je convertis des durées.","Ex. 1 (5 points)"],
  ["CONNAÎTRE","Je reconnais une grandeur produit et une grandeur quotient.","Ex. 2 (3 points)"],
  ["CALCULER","Je calcule une vitesse et je convertis des vitesses et des débits.","Ex. 3 et 4 (8 points)"],
  ["MODÉLISER","J'utilise les grandeurs composées pour résoudre un problème.","Ex. 5 (4 points)"]
],
exos:[
{t:"Des durées", p:5, h:`<p>Convertis en écrivant tes calculs.</p><p>a) 2,7 h = …… h …… min</p><p>b) 45 min = …… h</p><p>c) 3 h 12 min = …… h</p><p>d) 200 min = …… h …… min</p><p>e) 9 875 s = …… h …… min …… s</p>`,
 c:`<p>a) 0,7 × 60 = 42 : 2,7 h = 2 h 42 min · b) 45 ÷ 60 = 0,75 h · c) 12 ÷ 60 = 0,2 : 3 h 12 min = 3,2 h · d) 200 = 3 × 60 + 20 : 3 h 20 min</p><p>e) 9 875 = 2 × 3 600 + 2 675 et 2 675 = 44 × 60 + 35 : 9 875 s = 2 h 44 min 35 s</p><p><i>(1 point par conversion)</i></p>`},
{t:"Produit ou quotient ?", p:3, h:`<p>Pour chaque grandeur, indique si c'est une grandeur produit ou une grandeur quotient.</p><p>a) une masse volumique en g/cm<sup>3</sup> · b) une énergie en kWh · c) un débit en L/min</p><p>d) une aire en m<sup>2</sup> · e) une vitesse en km/h · f) un volume en dm<sup>3</sup></p>`,
 c:`<p>a) g/cm<sup>3</sup> : on divise une masse par un volume : <b>quotient</b> · b) kWh = kW × h : on multiplie : <b>produit</b> · c) L/min : on divise : <b>quotient</b></p><p>d) m<sup>2</sup> = m × m : <b>produit</b> · e) km/h : on divise : <b>quotient</b> · f) dm<sup>3</sup> = dm × dm × dm : <b>produit</b></p><p><i>(0,5 point par réponse)</i></p>`},
{t:"La sortie à vélo", p:4, h:`<p>Inès parcourt 42 km à vélo en 1 h 45 min.</p><p>a) Convertis 1 h 45 min en heures.</p><p>b) Calcule sa vitesse moyenne en km/h.</p><p>c) Convertis cette vitesse en m/s. Arrondis au centième.</p><p>d) À cette vitesse, combien de temps lui faut-il pour parcourir 60 km ? Donne la réponse en heures et minutes.</p>`,
 c:`<p>a) 45 ÷ 60 = 0,75 : 1 h 45 min = 1,75 h <i>(1 point)</i></p><p>b)</p><p class="calc"><i>v</i> = ${F("42 km","1,75 h")}<br><i>v</i> = 24 km/h</p><p><i>(1 point)</i></p><p>c)</p><p class="calc"><i>v</i> = 24 km/h<br><i>v</i> = ${F("24 000 m","3 600 s")}<br><i>v</i> ≈ 6,67 m/s</p><p><i>(1 point)</i></p><p>d)</p><p class="calc"><i>t</i> = 60 ÷ 24<br><i>t</i> = 2,5 h<br><i>t</i> = 2 h 30 min</p><p><i>(1 point)</i></p>`},
{t:"Conversions", p:4, h:`<p>a) Convertis 72 km/h en m/s.</p><p>b) Convertis 15 m/s en km/h.</p><p>c) Un fleuve a un débit de 2 700 ${M3}/h. Convertis ce débit en ${M3}/s, puis en L/s.</p>`,
 c:`<p>a)</p><p class="calc"><i>v</i> = 72 km/h<br><i>v</i> = ${F("72 000 m","3 600 s")}<br><i>v</i> = 20 m/s</p><p><i>(1 point)</i></p><p>b)</p><p class="calc"><i>v</i> = 15 m/s<br><i>v</i> = ${F("15 × 3 600 m","1 h")}<br><i>v</i> = ${F("54 000 m","1 h")}<br><i>v</i> = 54 km/h</p><p><i>(1 point)</i></p><p>c)</p><p class="calc"><i>D</i> = 2 700 ${M3}/h<br><i>D</i> = ${F("2 700 "+M3,"3 600 s")}<br><i>D</i> = 0,75 ${M3}/s</p><p><i>(1 point)</i></p><p>0,75 ${M3} = 750 L, donc 0,75 ${M3}/s = 750 L/s <i>(1 point)</i></p>`},
{t:"Remplir la piscine", p:4, h:`<p>Pour remplir une piscine de 54 ${M3}, on utilise un robinet dont le débit est de 15 L/min.</p><p>a) Convertis 54 ${M3} en litres.</p><p>b) Combien de minutes faut-il pour remplir la piscine ?</p><p>c) Convertis cette durée en heures.</p><p>d) Exprime le débit du robinet en ${M3}/h.</p>`,
 c:`<p>a) 1 ${M3} = 1 000 L, donc 54 ${M3} = 54 000 L <i>(1 point)</i></p><p>b) 54 000 ÷ 15 = 3 600 min <i>(1 point)</i></p><p>c) 3 600 ÷ 60 = 60 h <i>(1 point)</i></p><p>d)</p><p class="calc"><i>D</i> = 15 L/min<br><i>D</i> = ${F("15 × 60 L","1 h")}<br><i>D</i> = 900 L/h<br><i>D</i> = 0,9 ${M3}/h</p><p><i>(1 point)</i></p>`}
]}
};
})();
