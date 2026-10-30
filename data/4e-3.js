/* 4e — Chapitre 3 : Proportionnalité et quatrième proportionnelle
   Sources : cours « La proportionnalité » (C1), activité rapide, fiches d'exercices 1, 2 et 3, « Exercices en + » (défis) de M. Staal.
   Pas de corrigé dans les documents : toutes les corrections ont été rédigées et vérifiées.
   Les tableaux avec flèches et les figures sont dessinés en SVG (outil window.P43). */
(function(){
const VF=["Vrai","Faux"], ON=["Oui","Non"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
/* écriture française : 1 000 · 7,5 */
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* prix : 2 décimales si le nombre n'est pas entier (7,50) */
const E=x=>{ const v=rd(x,2); return Number.isInteger(v)?N(v):N(v,2).replace(/,(\d)$/,(m,d)=>","+d+"0"); };
const F=(a,b)=>`{${a}/${b}}`;
/* réponses tapées acceptées : 7,5 · 7,50 · 7,5 € … */
const ans=(x,u="")=>{ const a=[N(x), E(x)]; const s=[...new Set(a)]; return u ? [...s, ...s.map(v=>v+u), ...s.map(v=>v+" "+u)] : s; };
const len=s=>String(s).replace(/<[^>]*>/g,"").replace(/^!/,"").length;
const sum=a=>a.reduce((x,y)=>x+y,0);

/* ------------------------------------------------------------------
   Tableau de proportionnalité en SVG, avec flèches
   h1, h2 : titres des lignes · r1, r2 : cellules (« !7,50 » = réponse écrite en couleur)
   top [[i,j,"× 2"]] flèche au-dessus de la 1re ligne, de la colonne i à la colonne j
   bot [[i,j,"× 2"]] flèche sous la 2e ligne · side "× 7,5" flèche à droite, de la 1re ligne vers la 2e
------------------------------------------------------------------ */
let AID=0;
function ptab(o){
  const {h1="",h2="",r1,r2,top=[],bot=[],side=null} = o, id="ah43_"+(AID++);
  const cw=r1.map((v,i)=>Math.max(62, Math.max(len(v),len(r2[i]))*9.6+24));
  const hw=(h1||h2)?Math.max(len(h1),len(h2))*9.3+28:0, RH=38;
  const mt=top.length?50:4, mb=bot.length?50:4, mr=side?(len(side)*9+58):6;
  const xs=[4+hw]; cw.forEach(w=>xs.push(xs[xs.length-1]+w));
  const xe=xs[xs.length-1], W=Math.round(xe+mr), H=mt+2*RH+mb, cx=i=>xs[i]+cw[i]/2;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt||"Tableau de proportionnalité"}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--c)"/></marker></defs>`;
  const cell=(t,x,y,b)=>{ const a=/^!/.test(t); return `<text x="${x.toFixed(1)}" y="${y}" text-anchor="middle" style="font-size:16px;${b?"font-weight:700;":""}${a?"fill:var(--c);font-weight:700":""}">${String(t).replace(/^!/,"")}</text>`; };
  if(hw){ s+=`<rect x="4" y="${mt}" width="${hw}" height="${2*RH}" style="fill:color-mix(in srgb,var(--c) 10%,transparent)"/>`;
    s+=cell(h1,4+hw/2,mt+RH/2+6,1)+cell(h2,4+hw/2,mt+1.5*RH+6,1); }
  s+=`<rect x="4" y="${mt}" width="${(xe-4).toFixed(1)}" height="${2*RH}" class="thin"/><line x1="4" y1="${mt+RH}" x2="${xe.toFixed(1)}" y2="${mt+RH}" class="thin"/>`;
  xs.slice(0,-1).forEach((x,i)=>{ if(i||hw) s+=`<line x1="${x.toFixed(1)}" y1="${mt}" x2="${x.toFixed(1)}" y2="${mt+2*RH}" class="thin"/>`; });
  r1.forEach((v,i)=>{ s+=cell(v,cx(i),mt+RH/2+6)+cell(r2[i],cx(i),mt+1.5*RH+6); });
  const arc=(i,j,y,dy,lab)=>{ const a=cx(i)+(j>i?6:-6), b=cx(j)+(j>i?-6:6), m=(a+b)/2;
    return `<path d="M${a.toFixed(1)} ${y} Q${m.toFixed(1)} ${y+dy} ${b.toFixed(1)} ${y}" class="arrw" marker-end="url(#${id})"/><text x="${m.toFixed(1)}" y="${y+dy*0.62+(dy<0?0:12)}" class="alab">${lab}</text>`; };
  top.forEach(([i,j,l])=>{ s+=arc(i,j,mt-3,-40,l); });
  bot.forEach(([i,j,l])=>{ s+=arc(i,j,mt+2*RH+3,40,l); });
  if(side){ const y1=mt+RH/2, y2=mt+1.5*RH; s+=`<path d="M${(xe+4).toFixed(1)} ${y1} C${(xe+40).toFixed(1)} ${y1} ${(xe+40).toFixed(1)} ${y2} ${(xe+6).toFixed(1)} ${y2}" class="arrw" marker-end="url(#${id})"/><text x="${(xe+42).toFixed(1)}" y="${mt+RH+6}" class="alab" style="text-anchor:start">${side}</text>`; }
  return s+"</svg>";
}
/* l'égalité des produits en croix : tableau a c / b d avec ses deux diagonales */
function croix(a,b,c,d,o={}){
  const w=Math.max(92, Math.max(len(a),len(b),len(c),len(d))*11+40), RH=50, x0=4, y0=4;
  let s=`<svg class="fig" viewBox="0 0 ${2*w+8} ${2*RH+8}" width="${2*w+8}" role="img" aria-label="Produits en croix">`;
  s+=`<rect x="${x0}" y="${y0}" width="${2*w}" height="${2*RH}" class="thin"/><line x1="${x0}" y1="${y0+RH}" x2="${x0+2*w}" y2="${y0+RH}" class="thin"/><line x1="${x0+w}" y1="${y0}" x2="${x0+w}" y2="${y0+2*RH}" class="thin"/>`;
  s+=`<line x1="${x0+w*0.5+12}" y1="${y0+RH*0.5+4}" x2="${x0+w*1.5-12}" y2="${y0+RH*1.5-4}" style="stroke:var(--c);stroke-width:2.2"/><line x1="${x0+w*0.5+12}" y1="${y0+RH*1.5-4}" x2="${x0+w*1.5-12}" y2="${y0+RH*0.5+4}" style="stroke:#d9730d;stroke-width:2.2;stroke-dasharray:6 4"/>`;
  [[a,0,0],[c,1,0],[b,0,1],[d,1,1]].forEach(([t,i,j])=>{ const v=String(t), A=/^!/.test(v); s+=`<text x="${x0+w*(i+0.5)}" y="${y0+RH*(j+0.5)+6}" text-anchor="middle" style="font-size:17px;font-weight:700;${A?"fill:var(--c)":""}">${v.replace(/^!/,"")}</text>`; });
  return s+"</svg>";
}
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map((h,i)=>`<th>${i?h:`<b>${h}</b>`}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* ---------- figures du « Défi 2 » et de « Attention au volant ! » ---------- */
function boite(x0,y0,w,h,d,col,lw,lh,ld,nom){ const k=13, dx=d*k*0.55, dy=d*k*0.45, W=w*k, H=h*k;
  const P=(x,y)=>`${(x0+x).toFixed(1)},${(y0+y).toFixed(1)}`;
  let s=`<polygon points="${P(0,dy)} ${P(W,dy)} ${P(W,dy+H)} ${P(0,dy+H)}" style="fill:${col};fill-opacity:.35;stroke:var(--ink);stroke-width:1.8"/>`;
  s+=`<polygon points="${P(0,dy)} ${P(dx,0)} ${P(W+dx,0)} ${P(W,dy)}" style="fill:${col};fill-opacity:.2;stroke:var(--ink);stroke-width:1.8"/>`;
  s+=`<polygon points="${P(W,dy)} ${P(W+dx,0)} ${P(W+dx,H)} ${P(W,dy+H)}" style="fill:${col};fill-opacity:.25;stroke:var(--ink);stroke-width:1.8"/>`;
  s+=`<path d="M${P(0,dy+H)} L${P(dx,H)} L${P(W+dx,H)} M${P(dx,H)} L${P(dx,0)}" style="fill:none;stroke:var(--muted);stroke-width:1.4;stroke-dasharray:5 4"/>`;
  s+=`<text x="${(x0+W/2).toFixed(1)}" y="${(y0+dy+H+20).toFixed(1)}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:#c0392b">${lw}</text>`;
  s+=`<text transform="translate(${(x0-8).toFixed(1)} ${(y0+dy+H/2).toFixed(1)}) rotate(-90)" text-anchor="middle" style="font-size:15px;font-weight:600;fill:#c0392b">${lh}</text>`;
  s+=`<text x="${(x0+W+dx/2+16).toFixed(1)}" y="${(y0+dy/2+H+12).toFixed(1)}" text-anchor="start" style="font-size:15px;font-weight:600;fill:#c0392b">${ld}</text>`;
  s+=`<circle cx="${(x0+W/2).toFixed(1)}" cy="${(y0+dy+H+40).toFixed(1)}" r="11" style="fill:#c0392b"/><text x="${(x0+W/2).toFixed(1)}" y="${(y0+dy+H+45).toFixed(1)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:#fff">${nom}</text>`;
  return s; }
const FLACONS=`<svg class="fig" viewBox="0 0 590 205" width="590" role="img" aria-label="Trois flacons : A (4 cm, 4 cm, 6 cm), B (6 cm, 4 cm, 8 cm), C (10 cm, 5 cm, 6 cm)">
 ${boite(30,26,4,6,4,"#6fa8dc","4 cm","6 cm","4 cm","A")}${boite(190,0,6,8,4,"#f4b183","6 cm","8 cm","4 cm","B")}${boite(370,22,10,6,5,"#a9d18e","10 cm","6 cm","5 cm","C")}</svg>`;
function immeuble(x,et,v){ const hh=et*6.2+14, y=200-hh; return `<rect x="${x}" y="${y}" width="58" height="${hh}" style="fill:color-mix(in srgb,var(--ink) 12%,transparent);stroke:var(--ink);stroke-width:1.6"/>
  <text x="${x+29}" y="${y-36}" text-anchor="middle" style="font-size:15px;font-weight:700">${et}<tspan dy="-6" style="font-size:11px">e</tspan><tspan dy="6"> étage</tspan></text>
  <circle cx="${x+29}" cy="${y-14}" r="15" style="fill:#fff;stroke:#c0392b;stroke-width:4"/><text x="${x+29}" y="${y-9}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#1a1a1a">${v}</text>`; }
const VOLANT=`<svg class="fig" viewBox="0 0 330 210" width="330" role="img" aria-label="Être renversé à 50 km/h, c'est comme tomber du 3e étage ; à 90 km/h, du 11e étage ; à 130 km/h, du 22e étage">${immeuble(20,3,50)}${immeuble(130,11,90)}${immeuble(240,22,130)}<line x1="6" y1="200" x2="324" y2="200" class="ln"/></svg>`;

window.P43={ptab, croix, tab, N, E, F, ans, rd, sum, FLACONS, VOLANT};

/* ===================== figures du cours ===================== */
const H1="Nombre d'heures", H2="Salaire en €";
const C_CLAIRE = ptab({h1:H1,h2:H2,r1:["8","1","16","!9","6"],r2:["60","!7,50","!120","67,50","!45"]});
const C_COEF = ptab({h1:H1,h2:H2,r1:["8","1"],r2:["60","!7,50"],side:"× 7,5"});
const C_MUL = ptab({h1:H1,h2:H2,r1:["8","16"],r2:["60","!120"],top:[[0,1,"× 2"]],bot:[[0,1,"× 2"]]});
const C_ADD = ptab({h1:H1,h2:H2,r1:["8","!1","!9"],r2:["60","!7,50","67,50"],bot:[[0,2,"+"],[1,2,""]]});
const C_NON = ptab({h1:H1,h2:H2,r1:["8","16"],r2:["60","68 ✗"],top:[[0,1,"+ 8"]],bot:[[0,1,"+ 8"]]});
const C_CROIX = croix("a","b","c","d");
const C_SIT1 = ptab({h1:"Nombre de macarons",h2:"Prix (en €)",r1:["6","10","15"],r2:["8,4","14","21"]});
const C_SIT2 = ptab({h1:"Durée de location (en h)",h2:"Prix (en €)",r1:["1","2","3"],r2:["11","19","30"]});

/* ===================== schémas (rappels en image) ===================== */
const S_COEF = sch("Le coefficient de proportionnalité", C_COEF+`<p class="calc">60 ÷ 8 = 7,5</p><p class="schN">On passe de la 1<sup>re</sup> ligne à la 2<sup>e</sup> en multipliant toujours par le même nombre : le coefficient de proportionnalité.</p>`);
const S_LIN = sch("Multiplier ou additionner des colonnes", `<div class="figs">${C_MUL}${C_ADD}</div><p class="schN">Si je multiplie une quantité par 2, l'autre est multipliée par 2. Si j'additionne deux colonnes, j'additionne les deux lignes. On ne peut pas ajouter le même nombre aux deux lignes !</p>`);
const S_CROIX = sch("L'égalité des produits en croix", C_CROIX+`<p class="calc">a × d = b × c</p><p class="schN">Pour trouver le nombre manquant : je multiplie les deux nombres de la diagonale complète, puis je divise par le troisième nombre.</p>`);
const S_REC = sch("Reconnaître un tableau de proportionnalité", ptab({h1:"Nombre de macarons",h2:"Prix (en €)",r1:["6","10","15"],r2:["8,4","14","21"]})+`<p class="calc">8,4 ÷ 6 = 1,4 · 14 ÷ 10 = 1,4 · 21 ÷ 15 = 1,4</p><p class="schN">Tous les quotients sont égaux : c'est un tableau de proportionnalité. Un seul quotient différent suffit pour dire « non ».</p>`);

/* ---------- petits générateurs du QCM ---------- */
const RATE=[7.5,8,9.5,10,12,6.5,8.5,11];
const qProp = ()=>{ for(let g=0;g<500;g++){ const k=pick([1.2,1.5,2.5,3,4,0.8,1.4,0.6]); const xs=TR3(); const ys=xs.map(x=>rd(x*k)); if(Math.random()<0.5) return {xs,ys,ok:true,k};
    const j=ri(1,2), ys2=[...ys]; ys2[j]=rd(ys[j]+pick([-1,1])*pick([1,2,0.5])); if(ys2[j]>0) return {xs,ys:ys2,ok:false,k,j}; } return {xs:[2,4,6],ys:[3,6,9],ok:true,k:1.5}; };
function TR3(){ const s=new Set(); while(s.size<3) s.add(ri(2,15)); return [...s].sort((a,b)=>a-b); }

CH["4e-3"] = {
intro:"Calculer une quatrième proportionnelle dans un tableau de proportionnalité (coefficient, multiplication, addition de colonnes, produits en croix) et démontrer qu'une situation est, ou n'est pas, une situation de proportionnalité.",
savoir:[
  "calculer une quatrième proportionnelle avec le coefficient de proportionnalité ;",
  "calculer une quatrième proportionnelle en multipliant, en divisant, en additionnant ou en soustrayant des colonnes ;",
  "calculer une quatrième proportionnelle avec l'égalité des produits en croix ;",
  "démontrer qu'un tableau est, ou n'est pas, un tableau de proportionnalité ;",
  "interpréter un résultat dans le contexte de l'exercice."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"Compléter un tableau de proportionnalité", h:`
  <div class="retenir" data-l="Définition"><p>Dans un tableau de proportionnalité, lorsqu'on connaît trois nombres non nuls (dont deux qui se correspondent), on peut calculer le quatrième nombre manquant.</p><p>Ce nombre manquant est appelé une <b>quatrième proportionnelle</b>.</p></div>
  ${ptab({r1:["connu","connu"],r2:["connu","??"],alt:"Trois nombres connus, un nombre à calculer"})}
  <p><b>Exercice :</b> le salaire de Claire est proportionnel au nombre d'heures travaillées.</p><p>Elle est payée 60 € pour une journée de 8 h.</p>
  ${tab([H1,"8","1","16","","6"],[[H2,"60","","","67,50",""]])}
  <h4>Voici différentes méthodes pour calculer une quatrième proportionnelle</h4>
  <div class="retenir" data-l="Méthode"><p><b>1) Utiliser le coefficient de proportionnalité :</b></p><p>60 ÷ 8 = 7,5. On multiplie le nombre d'heures par 7,5 pour obtenir le salaire.</p>${C_COEF}<p>Pour 1 h, Claire gagne 1 × 7,5 = 7,50 €.</p></div>
  <div class="retenir" data-l="Méthode"><p><b>2) Multiplier ou diviser une quantité par un nombre choisi :</b></p><p>16 = 8 × 2, donc le salaire est aussi multiplié par 2 : 60 × 2 = 120 €.</p>${C_MUL}</div>
  <div class="retenir" data-l="Méthode"><p><b>3) Additionner ou soustraire deux quantités :</b></p><p>67,50 = 60 + 7,50, donc le nombre d'heures est 8 + 1 = 9 h.</p>${C_ADD}</div>
  <div class="attention"><b>On ne peut pas !!!</b> ajouter (ou soustraire) un même nombre aux deux lignes.</div>
  ${C_NON}
  <p>16 = 8 + 8, mais le salaire n'est pas 60 + 8 = 68 € : c'est 120 € !</p>
  <p><b>Le tableau complet :</b> pour 6 h, Claire gagne 6 × 7,5 = 45 € (ou 60 − 15 = 45 €, car 6 = 8 − 2 et 2 h rapportent 15 €).</p>
  ${C_CLAIRE}
  <div class="retenir" data-l="Propriété"><p><b>4) Utiliser l'égalité des produits en croix :</b></p><p>Ce tableau est un tableau de proportionnalité : ${F("a","b")} = ${F("c","d")}.</p>${C_CROIX}<p>On peut donc écrire l'<b>égalité des produits en croix</b> :</p><p class="calc">a × d = b × c</p></div>
  <p><b>Exercice :</b> la quantité d'eau versée dans un aquarium est proportionnelle à la hauteur d'eau dans l'aquarium.</p>
  <p>Avec 54 L d'eau dans l'aquarium, la hauteur d'eau était de 7 cm.</p><p>Quelle quantité d'eau dois-je avoir dans l'aquarium pour avoir une hauteur d'eau de 60 cm ? Donner l'arrondi au centième près du résultat.</p>
  <details><summary>Voir la correction</summary><div class="corr">
   ${ptab({h1:"Quantité d'eau (en L)",h2:"Hauteur d'eau (en cm)",r1:["54","<tspan font-style='italic'>x</tspan>"],r2:["7","60"]})}
   <p>C'est une situation de proportionnalité. D'après l'égalité des produits en croix :</p>
   <p class="calc"><i>x</i> × 7 = 54 × 60<br><i>x</i> = ${F("54 × 60",7)}<br><i>x</i> = ${F("3 240",7)}<br><i>x</i> ≈ 462,86</p>
   <p>Il faut environ <b>462,86 L</b> d'eau pour avoir une hauteur d'eau de 60 cm.</p></div></details>`},
{k:"2", t:"Reconnaître une situation de proportionnalité", h:`
  <div class="retenir" data-l="Définition"><p>Un tableau de proportionnalité est un tableau dans lequel on obtient les nombres d'une ligne en multipliant ceux de l'autre ligne par un même nombre appelé <b>coefficient de proportionnalité</b>.</p></div>
  <p><b>Exercice :</b> démontre si ces situations sont des situations de proportionnalité ou non.</p>
  <p><b>Situation 1 :</b></p>${C_SIT1}
  <p><b>Situation 2 :</b></p>${C_SIT2}
  <details><summary>Voir la correction</summary><div class="corr">
   <p><b>Situation 1 :</b> je calcule les quotients prix ÷ nombre de macarons.</p><p class="calc">8,4 ÷ 6 = 1,4 · 14 ÷ 10 = 1,4 · 21 ÷ 15 = 1,4</p><p>Les quotients sont tous égaux : c'est une <b>situation de proportionnalité</b> (coefficient 1,4 : un macaron coûte 1,40 €).</p>
   <p><b>Situation 2 :</b> je calcule les quotients prix ÷ durée.</p><p class="calc">11 ÷ 1 = 11 · 19 ÷ 2 = 9,5</p><p>11 ≠ 9,5 : ce n'est <b>pas une situation de proportionnalité</b>.</p></div></details>
  <div class="retenir" data-l="Méthode"><p>Pour démontrer qu'un tableau est un tableau de proportionnalité :</p><p><b>1)</b> je calcule tous les quotients (nombre de la 2<sup>e</sup> ligne ÷ nombre correspondant de la 1<sup>re</sup> ligne) ;</p><p><b>2)</b> s'ils sont tous égaux, c'est un tableau de proportionnalité ;</p><p><b>3)</b> s'il y en a un seul différent, ce n'est pas un tableau de proportionnalité.</p></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Compléter un tableau sans le produit en croix", e:[
  {n:"Activité rapide", t:"Choisir la meilleure méthode", w:"Sur ton cahier", h:`<p>Ces situations sont toutes des situations de proportionnalité.</p><p>Trouve le nombre manquant en utilisant le moins possible ta calculatrice.</p>
   <p><b>a)</b></p>${tab(["Masse de fromage (en g)","40","120"],[["Apport calorique (en kcal)","130","…"]])}
   <p><b>b)</b> Hauteur d'eau dans l'aquarium :</p>${tab(["Hauteur d'eau (en cm)","5","9"],[["Nombre de litres","30","…"]])}
   <p><b>c)</b></p>${tab(["Nombre de croissants","8","12"],[["Prix (en €)","6,80","…"]])}`,
   c:`<p><b>a)</b> 120 = 40 × 3, donc 130 × 3 = <b>390 kcal</b>.</p>${ptab({h1:"Masse (en g)",h2:"Apport (en kcal)",r1:["40","120"],r2:["130","!390"],top:[[0,1,"× 3"]],bot:[[0,1,"× 3"]]})}
   <p><b>b)</b> 30 ÷ 5 = 6 (coefficient), donc 9 × 6 = <b>54 L</b>.</p>${ptab({h1:"Hauteur (en cm)",h2:"Nombre de litres",r1:["5","9"],r2:["30","!54"],side:"× 6"})}
   <p><b>c)</b> 12 = 8 + 4 et 4 croissants coûtent 6,80 ÷ 2 = 3,40 €. Donc 6,80 + 3,40 = <b>10,20 €</b>.</p>${ptab({h1:"Nombre de croissants",h2:"Prix (en €)",r1:["8","!4","12"],r2:["6,80","!3,40","!10,20"],top:[[0,1,"÷ 2"]],bot:[[0,1,"÷ 2"]]})}`},
  {n:"Activité 1", t:"Tableaux à compléter", w:"Sur ton cahier", h:`<p>Dans les deux cas ci-dessous, complète le tableau, si possible.</p>
   <p><b>a) Chez le boulanger</b></p><p>Le boulanger nous a vendu 2 baguettes au prix de 1,80 €.</p><p>Il n'y a pas d'offre en cours dans la boulangerie.</p>
   ${tab(["Nombre de baguettes","2","6","8","13"],[["Prix (en €)","1,80","","",""]])}
   <p><b>b) Chez le dentiste</b></p><p>Paul a rendez-vous chez le dentiste ce matin.</p><p>À 5 ans, il a aujourd'hui 20 dents.</p>
   ${tab(["Âge de Paul","5","10","20","30"],[["Nombre de dents","20","","",""]])}`,
   c:`<p><b>a)</b> Il n'y a pas d'offre : le prix est proportionnel au nombre de baguettes. Une baguette coûte 1,80 ÷ 2 = 0,90 €.</p>
   ${ptab({h1:"Nombre de baguettes",h2:"Prix (en €)",r1:["2","6","8","13"],r2:["1,80","!5,40","!7,20","!11,70"],side:"× 0,9"})}
   <p>6 × 0,90 = 5,40 € · 8 × 0,90 = 7,20 € · 13 × 0,90 = 11,70 €</p>
   <p><b>b)</b> On ne peut pas compléter ce tableau : le nombre de dents n'est pas proportionnel à l'âge.</p><p>À 10 ans, Paul n'aura pas 40 dents (un adulte en a au plus 32).</p><p>Ce n'est pas une situation de proportionnalité.</p>`},
  {n:"Exercice 1", t:"Prime annuelle (sans calculatrice)", w:"Sur ton cahier", h:`<p>La prime annuelle d'un vendeur est proportionnelle au montant de ses ventes.</p><p>Le directeur du magasin utilise le tableau suivant pour verser les primes à ses vendeurs.</p><p>Recopie et complète les cases vides.</p><p>Note les calculs et la méthode utilisée sur ton cahier.</p>
   ${tab(["Ventes (en €)","2 000","8 000","","18 000","20 000","38 000"],[["Primes (en €)","","500","1 000","1 125","1 250",""]])}`,
   c:`<p>On divise les ventes par 16 pour obtenir la prime : 8 000 ÷ 500 = 16 (coefficient ${F(1,16)}).</p>
   <p>• 2 000 = 8 000 ÷ 4, donc la prime est 500 ÷ 4 = <b>125 €</b>.</p><p>• 1 000 = 500 × 2, donc les ventes sont 8 000 × 2 = <b>16 000 €</b>.</p><p>• 38 000 = 18 000 + 20 000, donc la prime est 1 125 + 1 250 = <b>2 375 €</b>.</p>
   ${tab(["Ventes (en €)","2 000","8 000","<b>16 000</b>","18 000","20 000","38 000"],[["Primes (en €)","<b>125</b>","500","1 000","1 125","1 250","<b>2 375</b>"]])}`},
  {n:"Exercice 2", t:"Travaux de jardinage (calculatrice autorisée)", w:"Sur ton cahier", h:`<p>Gaspard effectue des travaux de jardinage. Il est payé à l'heure.</p><p>Cette semaine, pour 20 h de travail, il a gagné 213 €.</p>
   <p><b>a)</b> Combien est-il payé pour 1 h de travail ?</p><p><b>b)</b> La semaine prochaine, il prévoit de travailler 17 h. Quelle somme va-t-il gagner ?</p><p><b>c)</b> La semaine dernière, il a gagné 138,45 €. Combien d'heures a-t-il travaillé ?</p>`,
   c:`<p><b>a)</b> 213 ÷ 20 = 10,65 : il est payé <b>10,65 €</b> pour 1 h.</p><p><b>b)</b> 17 × 10,65 = 181,05 : il va gagner <b>181,05 €</b>.</p><p><b>c)</b> 138,45 ÷ 10,65 = 13 : il a travaillé <b>13 h</b>.</p>
   ${ptab({h1:"Nombre d'heures",h2:"Salaire (en €)",r1:["20","1","17","!13"],r2:["213","!10,65","!181,05","138,45"],side:"× 10,65"})}`},
  {n:"Exercice 3", t:"Au supermarché (calculatrice autorisée)", w:"Sur ton cahier", h:`<p>Les citrons sont vendus à 1 € l'unité.</p><p>Les carottes sont vendues à 1,80 €/kg.</p>
   <p><b>a)</b> Le prix des citrons est-il proportionnel à leur poids ?</p><p><b>b)</b> Peut-on dire la même chose des carottes ?</p><p><b>c)</b> Quel serait le prix de 1,5 kg de carottes ?</p><p><b>d)</b> Quel serait le prix de 1,340 kg de carottes ?</p>`,
   c:`<p><b>a)</b> Non : les citrons sont vendus à l'unité. Le prix dépend du nombre de citrons, pas de leur poids (deux citrons de poids différents coûtent le même prix).</p>
   <p><b>b)</b> Oui : les carottes sont vendues au kilogramme. Le prix est proportionnel au poids (coefficient 1,80).</p>
   <p><b>c)</b> 1,5 × 1,80 = 2,70 : <b>2,70 €</b>.</p><p><b>d)</b> 1,340 × 1,80 = 2,412 : environ <b>2,41 €</b>.</p>`},
  {n:"Exercice 4", t:"Restaurant asiatique", w:"Sur ton cahier", h:`<p>Anna et Philippe adorent la cuisine asiatique.</p><p>Ils décident d'acheter des nems et des samoussas à emporter pour les manger à la maison. Voici leur commande :</p>
   <div class="attention"><p>4 nems poulet ; 4 samoussas au bœuf ; 2 nems crevettes ;</p><p>4 nems crabe et 2 samoussas au porc ;</p><p>une part de porc au caramel de 0,420 kg avec une part de riz cantonais de 450 g.</p></div>
   <p>Le prix de chaque nem et samoussa est de 0,95 €.</p><p>Le prix du porc au caramel est de 19 €/kg.</p><p>Le prix du riz est de 7,90 €/kg.</p>
   <p><b>Philippe possède 30 € en liquide. Doit-il sortir sa carte bleue pour payer ou est-ce que sa monnaie suffira ?</b></p>`,
   c:`<p>Nems : 4 + 2 + 4 = 10. Samoussas : 4 + 2 = 6. Cela fait 16 nems et samoussas.</p>
   <p class="calc">Nems et samoussas : 16 × 0,95 = 15,20 €<br>Porc au caramel : 0,420 × 19 = 7,98 €<br>Riz : 450 g = 0,450 kg</p><p>Prix R du riz :</p><p class="calc">R = 0,450 × 7,90<br>R = 3,555<br>R ≈ 3,56 €</p>
   <p>Total T :</p><p class="calc">T = 15,20 + 7,98 + 3,555<br>T = 26,735<br>T ≈ 26,74 €</p>
   <p>26,74 € &lt; 30 € : <b>sa monnaie suffira</b>, il n'a pas besoin de sortir sa carte bleue.</p>`}
 ]},
{t:"Compléter un tableau avec le produit en croix", e:[
  {n:"Exercice 5", t:"Journaux à imprimer", w:"Sur ton cahier", h:`<p>Pour imprimer des journaux, on utilise des rouleaux de papier.</p><p>On considère que la masse d'un rouleau est proportionnelle à la longueur de papier.</p>
   ${tab(["Masse (en kg)","900","750"],[["Longueur (en km)","15","<i>y</i>"]])}
   <p><b>a)</b> Calcule la valeur de <i>y</i> dans ce tableau. Explique l'ensemble de tes calculs.</p><p><b>b)</b> Interprète ensuite ce résultat.</p>
   <div class="retenir" data-l="Définition"><p><b>Interpréter un résultat</b> signifie écrire une phrase qui explique ce résultat dans le contexte de l'exercice.</p></div>`,
   c:`<p><b>a)</b> C'est un tableau de proportionnalité. D'après l'égalité des produits en croix :</p>${croix("900","15","750","!y")}
   <p class="calc">900 × <i>y</i> = 15 × 750<br><i>y</i> = ${F("15 × 750",900)}<br><i>y</i> = ${F("11 250",900)}<br><i>y</i> = 12,5</p>
   <p><b>b)</b> Un rouleau de papier de 750 kg contient <b>12,5 km</b> de papier.</p>`},
  {n:"Exercice 6", t:"Voyage au Royaume-Uni", w:"Sur ton cahier", h:`<p>Le cours de la livre sterling est de 1,15 €. Ce qui signifie que : 1 £ = 1,15 €.</p><p>Avant de partir, j'ai échangé 40 € dans un bureau de change.</p><p>Combien ai-je de livres sterling pour mon voyage ?</p>`,
   c:`${tab(["Livres sterling (£)","1","<i>x</i>"],[["Euros (€)","1,15","40"]])}
   <p class="calc"><i>x</i> × 1,15 = 1 × 40<br><i>x</i> = 40 ÷ 1,15<br><i>x</i> ≈ 34,78</p><p>J'ai environ <b>34,78 £</b> pour mon voyage.</p>`},
  {n:"Exercice 7", t:"Voyage aux États-Unis", w:"Sur ton cahier", h:`<p>L'an dernier, Zoé a échangé 29 € contre 38,20 $.</p><p>Cette année, elle retourne aux États-Unis.</p><p>Le cours du dollar n'a pas changé et cette fois, elle échange avant de partir 60 €.</p><p>Combien aura-t-elle de dollars ?</p>`,
   c:`${tab(["Euros (€)","29","60"],[["Dollars ($)","38,20","<i>x</i>"]])}
   <p class="calc">29 × <i>x</i> = 38,20 × 60<br><i>x</i> = ${F("38,20 × 60",29)}<br><i>x</i> = ${F("2 292",29)}<br><i>x</i> ≈ 79,03</p><p>Zoé aura environ <b>79,03 $</b>.</p>`},
  {n:"Exercice 8", t:"Livre sterling", w:"Sur ton cahier", h:`<p>Le cours de la livre sterling est de 1,35 €.</p><p>Sophie achète sur internet deux places pour un concert à Londres.</p><p>Elle paie 102,4 livres sterling.</p><p><b>Combien coûte en euros une place de concert ?</b></p>`,
   c:`<p>1 £ = 1,35 €, donc le prix P en euros de 102,4 £ :</p><p class="calc">P = 102,4 × 1,35<br>P = 138,24 €</p><p>Pour une place : 138,24 ÷ 2 = 69,12.</p><p>Une place de concert coûte <b>69,12 €</b>.</p>`}
 ]},
{t:"Démontrer qu'un tableau est proportionnel", e:[
  {n:"Activité 2", t:"Bracelets en élastiques", w:"Sur ton cahier", h:`<p>Louise veut acheter des sachets d'élastiques pour réaliser des bracelets.</p><p>Après ses recherches, Louise a le choix entre ces deux possibilités :</p>
   ${tab(["Le Bazar","Netbracelet"],[["1,50 € le sachet","0,75 € le sachet + frais de port 5 €"]])}
   <p><b>a)</b> Recopie et complète les tableaux ci-dessous pour chaque proposition.</p><p>Ensuite, explique le choix de magasin que Louise va faire selon le nombre de sachets qu'elle va acheter.</p>
   ${tab(["Nombre de sachets achetés","4","8","10"],[["Prix chez « Le Bazar » en €","","",""]])}${tab(["Nombre de sachets achetés","4","8","10"],[["Prix chez « Netbracelet » en €","","",""]])}
   <p><b>b)</b> Indique pour chaque tableau si c'est un tableau de proportionnalité ou non. <b>Explique.</b></p>`,
   c:`<p><b>a)</b> Le Bazar : 4 × 1,50 = 6 € · 8 × 1,50 = 12 € · 10 × 1,50 = 15 €.</p><p>Netbracelet : 4 × 0,75 + 5 = 8 € · 8 × 0,75 + 5 = 11 € · 10 × 0,75 + 5 = 12,50 €.</p>
   ${tab(["Nombre de sachets achetés","4","8","10"],[["Prix chez « Le Bazar » en €","6","12","15"],["Prix chez « Netbracelet » en €","8","11","12,50"]])}
   <p>Pour 4 sachets, Louise choisit <b>Le Bazar</b> (6 € &lt; 8 €).</p><p>Pour 8 ou 10 sachets, elle choisit <b>Netbracelet</b> (11 € &lt; 12 € et 12,50 € &lt; 15 €).</p><p>(En calculant, Le Bazar est moins cher jusqu'à 6 sachets, Netbracelet à partir de 7 sachets.)</p>
   <p><b>b)</b> Le Bazar : 6 ÷ 4 = 1,5 ; 12 ÷ 8 = 1,5 ; 15 ÷ 10 = 1,5. Les quotients sont égaux : <b>c'est un tableau de proportionnalité</b>.</p><p>Netbracelet : 8 ÷ 4 = 2 et 11 ÷ 8 = 1,375. 2 ≠ 1,375 : <b>ce n'est pas un tableau de proportionnalité</b> (à cause des frais de port).</p>`},
  {n:"Exercice 9", t:"Situations de proportionnalité ?", w:"Sur ton cahier", h:`<p>Parmi les situations suivantes, lesquelles sont des situations de proportionnalité ? <b>Justifie.</b></p>
   <p><b>a)</b></p>${tab(["Âge de Laurent (années)","5","10","15"],[["Taille de Laurent (m)","0,8","1,2","1,6"]])}
   <p><b>b)</b></p>${tab(["Volume de pâte à crêpe (L)","1","0,2","0,8"],[["Nombre de crêpes préparées","25","5","20"]])}`,
   c:`<p><b>a)</b> 0,8 ÷ 5 = 0,16 et 1,2 ÷ 10 = 0,12. 0,16 ≠ 0,12 : <b>ce n'est pas une situation de proportionnalité</b>.</p>
   <p><b>b)</b> 25 ÷ 1 = 25 · 5 ÷ 0,2 = 25 · 20 ÷ 0,8 = 25. Les quotients sont égaux : <b>c'est une situation de proportionnalité</b> (25 crêpes par litre de pâte).</p>`},
  {n:"Exercice 10", t:"Attention au volant !", w:"Sur ton cahier", h:`<p>Ce schéma illustre la violence des chocs subis par les piétons renversés par une voiture.</p>${VOLANT}
   <p><b>a)</b> Explique la signification de ce schéma.</p><p><b>b)</b> En présentant les données dans un tableau, indique si la violence du choc subi par un piéton est proportionnelle ou non à la vitesse de la voiture.</p>`,
   c:`<p><b>a)</b> Un piéton renversé par une voiture qui roule à 50 km/h subit le même choc que s'il tombait du 3<sup>e</sup> étage d'un immeuble.</p><p>À 90 km/h, c'est comme tomber du 11<sup>e</sup> étage. À 130 km/h, c'est comme tomber du 22<sup>e</sup> étage.</p>
   <p><b>b)</b></p>${tab(["Vitesse (en km/h)","50","90","130"],[["Étage","3","11","22"]])}
   <p class="calc">3 ÷ 50 = 0,06 · 11 ÷ 90 ≈ 0,12</p><p>Les quotients ne sont pas égaux : la violence du choc <b>n'est pas proportionnelle</b> à la vitesse.</p><p>Elle augmente beaucoup plus vite que la vitesse : la vitesse fait moins que tripler (de 50 à 130 km/h), mais l'étage est multiplié par plus de 7.</p>`},
  {n:"Exercice 11", t:"Pack de yaourts", w:"Sur ton cahier", h:`<p>Un pack de 6 yaourts coûte 1,50 €.</p><p>Un pack de 10 yaourts de la même marque est vendu à 2 €.</p><p>Le prix du pack est-il proportionnel au nombre de yaourts ? Explique.</p>`,
   c:`${tab(["Nombre de yaourts","6","10"],[["Prix du pack (en €)","1,50","2"]])}<p class="calc">1,50 ÷ 6 = 0,25 · 2 ÷ 10 = 0,20</p><p>0,25 ≠ 0,20 : le prix du pack <b>n'est pas proportionnel</b> au nombre de yaourts.</p><p>(Un yaourt revient à 0,25 € dans le petit pack et à 0,20 € dans le grand.)</p>`}
 ]},
{t:"Pour aller plus loin : les défis", e:[
  {n:"Défi 1", t:"Le jardinier", w:"Sur ton cahier", h:`<p>Un jardinier utilise 60 L d'eau pour arroser pendant 3 jours un potager de 80 m<sup>2</sup>.</p><p>Quelle quantité d'eau va-t-il utiliser pour arroser pendant 7 jours un potager de 120 m<sup>2</sup> ?</p>`,
   c:`<p>En 1 jour, pour 80 m<sup>2</sup> : 60 ÷ 3 = 20 L.</p><p>En 1 jour, pour 1 m<sup>2</sup> : 20 ÷ 80 = 0,25 L.</p><p>En 7 jours, pour 120 m<sup>2</sup> : 0,25 × 120 × 7 = 210 L.</p><p>Il va utiliser <b>210 L</b> d'eau.</p>`},
  {n:"Défi 2", t:"Les flacons de parfum", w:"Sur ton cahier", h:`<p>Un parfumeur propose ces trois flacons en forme de parallélépipèdes rectangles de sa célèbre « Eau de parfum ».</p>${FLACONS}
   <p>Le prix d'un flacon est proportionnel au volume de parfum qu'il contient.</p><p>Voici trois étiquettes à coller sur ces flacons : <b>48 €</b> · <b>75 €</b> · <b>…… €</b></p><p>Détermine le prix à inscrire sur la 3<sup>e</sup> étiquette.</p>`,
   c:`<p>Volumes : A : 4 × 4 × 6 = 96 cm<sup>3</sup> · B : 6 × 4 × 8 = 192 cm<sup>3</sup> · C : 10 × 5 × 6 = 300 cm<sup>3</sup>.</p>
   <p>On cherche à quels flacons correspondent 48 € et 75 €. Le prix pour 1 cm<sup>3</sup> doit être le même :</p>
   <p class="calc">48 ÷ 192 = 0,25 et 75 ÷ 300 = 0,25</p><p>Donc 48 € va sur le flacon B et 75 € sur le flacon C (1 cm<sup>3</sup> coûte 0,25 €).</p>
   <p>Flacon A : 96 × 0,25 = 24. Il faut inscrire <b>24 €</b> sur la 3<sup>e</sup> étiquette (flacon A).</p>`},
  {n:"Défi 3", t:"Le budget essence de Laura", w:"Sur ton cahier", h:`<p>La voiture de Laura consomme 5 L pour 100 km.</p><p>Laura parcourt en moyenne 560 km par semaine.</p><p>Avant le 1<sup>er</sup> juin, 1 L d'essence coûte 1,30 €.</p><p>Le 1<sup>er</sup> juin, le prix de l'essence augmente de 10 centimes.</p><p>Laura veut conserver le même budget pour l'essence : elle décide donc de moins utiliser sa voiture et de prendre plus souvent son vélo.</p><p><b>Combien de kilomètres doit-elle parcourir en vélo chaque semaine pour respecter son objectif ?</b></p>`,
   c:`<p>Essence pour 560 km : 560 ÷ 100 × 5 = 28 L.</p><p>Budget par semaine : 28 × 1,30 = 36,40 €.</p><p>Nouveau prix : 1,30 + 0,10 = 1,40 €. Avec 36,40 €, elle achète 36,40 ÷ 1,40 = 26 L.</p><p>Avec 26 L, elle roule 26 ÷ 5 × 100 = 520 km.</p><p>560 − 520 = 40 : elle doit parcourir <b>40 km en vélo</b> chaque semaine.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Le coefficient de proportionnalité", schema:S_COEF, q:{
 1:[ {g:()=>{ const h=pick([4,5,8,10]), r=pick(RATE), p=rd(h*r); return {q:`Claire est payée ${E(p)} € pour ${h} h de travail. Son salaire est proportionnel au nombre d'heures. Combien est-elle payée pour 1 h ?`, rep:ans(r,"€"), ex:`${E(p)} ÷ ${h} = ${E(r)} €.`, sx:S_COEF}; }} ],
 2:[ {g:()=>{ const h=pick([2,4,5,8,10,20]), r=pick(RATE), p=rd(h*r), x=ri(3,25); return {q:`Pour ${h} h de travail, Gaspard gagne ${E(p)} €. Combien gagne-t-il pour ${x} h ?`, rep:ans(x*r,"€"), ex:`Pour 1 h : ${E(p)} ÷ ${h} = ${E(r)} €. Pour ${x} h : ${x} × ${E(r)} = ${E(x*r)} €.`, sx:S_COEF}; }} ],
 3:[ {g:()=>{ const k=pick([1.4,1.2,0.85,2.5,1.6,0.75]), a=pick([5,6,8,10,12,15]); return {q:`Dans un tableau de proportionnalité, ${a} macarons coûtent ${E(a*k)} €. Quel est le coefficient de proportionnalité (prix d'un macaron) ?`, fig:ptab({h1:"Nombre de macarons",h2:"Prix (en €)",r1:[String(a)],r2:[E(a*k)],side:"× ?"}), rep:ans(k), ex:`${E(a*k)} ÷ ${a} = ${N(k)}.`, sx:S_COEF}; }},
     {g:()=>{ const k=pick([6,7.5,12,0.9,1.8]), y=pick([30,45,54,60,90,135]); const x=rd(y/k); if(Math.abs(y/k*100-Math.round(y/k*100))>1e-6) return {q:"Dans un tableau de proportionnalité de coefficient 6, quel nombre correspond à 54 ?", rep:["9"], ex:"54 ÷ 6 = 9.", sx:S_COEF};
       return {q:`Dans un tableau de proportionnalité, on multiplie la 1<sup>re</sup> ligne par ${N(k)} pour obtenir la 2<sup>e</sup> ligne. Quel nombre de la 1<sup>re</sup> ligne correspond à ${N(y)} ?`, rep:ans(x), ex:`On fait l'opération inverse : ${N(y)} ÷ ${N(k)} = ${N(x)}.`, sx:S_COEF}; }} ]
}},
{nom:"Multiplier ou additionner des colonnes", schema:S_LIN, q:{
 1:[ {g:()=>{ const h=pick([2,3,4,5,8]), m=pick([2,3,4,10]), p=pick([12,15,18,24,30,60]); return {q:`${h} baguettes coûtent ${E(p/10)} €. Combien coûtent ${h*m} baguettes ?`, fig:ptab({h1:"Nombre de baguettes",h2:"Prix (en €)",r1:[String(h),String(h*m)],r2:[E(p/10),"?"],top:[[0,1,"× "+m]]}), rep:ans(p/10*m,"€"), ex:`${h*m} = ${h} × ${m}, donc ${E(p/10)} × ${m} = ${E(p/10*m)} €.`, sx:S_LIN}; }} ],
 2:[ {g:()=>{ const a=ri(2,6), r=pick([2.5,1.5,4,3.2,0.8]); let b; do{ b=ri(2,5); }while(b===a); return {q:`${a} kg coûtent ${E(a*r)} € et ${b} kg coûtent ${E(b*r)} €. Sans calculer le prix d'un kilogramme, combien coûtent ${a+b} kg ?`, fig:ptab({h1:"Masse (en kg)",h2:"Prix (en €)",r1:[String(a),String(b),String(a+b)],r2:[E(a*r),E(b*r),"?"]}), rep:ans((a+b)*r,"€"), ex:`${a+b} = ${a} + ${b}, donc ${E(a*r)} + ${E(b*r)} = ${E((a+b)*r)} €.`, sx:S_LIN}; }},
     {g:()=>{ const h=pick([4,6,8,10]), p=pick([30,45,60,80,90]); return {q:`${h} h de travail rapportent ${p} €. Combien rapportent ${h/2} h ?`, rep:ans(p/2,"€"), ex:`${h/2} = ${h} ÷ 2, donc ${p} ÷ 2 = ${E(p/2)} €.`, sx:S_LIN}; }} ],
 3:[ {g:()=>{ const h=pick([4,5,8,10]), p=pick([40,50,60,80]), d=pick([2,3,4]); const good=E(p*(h+d)/h), bad=E(p+d); return {q:`${h} h de travail rapportent ${p} €. Combien rapportent ${h+d} h ?`, c:uniq(good,[bad, E(p*d), E(p+d*2)]), rep:good, ex:`On ne peut pas ajouter ${d} aux deux lignes ! Pour 1 h : ${p} ÷ ${h} = ${E(p/h)} €, donc ${h+d} × ${E(p/h)} = ${good} €.`, sx:S_LIN}; }},
     {g:()=>{ const h=pick([4,6,8]), p=pick([30,48,60]); return {q:`Vrai ou faux : si ${h} h rapportent ${p} €, alors ${h+h} h rapportent ${p+h} €.`, c:VF, rep:"Faux", ex:`${h+h} = ${h} × 2, donc on gagne ${p} × 2 = ${p*2} €. On ne peut pas ajouter ${h} aux deux lignes.`, sx:S_LIN}; }} ]
}},
{nom:"L'égalité des produits en croix", schema:S_CROIX, q:{
 1:[ {q:"Le tableau a | c en 1<sup>re</sup> ligne et b | d en 2<sup>e</sup> ligne est un tableau de proportionnalité. Quelle égalité est vraie ?", fig:croix("a","b","c","d"), c:["a × d = b × c","a × c = b × d","a + d = b + c"], rep:"a × d = b × c", ex:"On multiplie les nombres « en croix » : a × d = b × c.", sx:S_CROIX} ],
 2:[ {g:()=>{ for(let g=0;g<300;g++){ const a=ri(2,12), x=ri(2,15), k=pick([2,3,4,5,6,1.5,2.5]); const b=rd(a*k), d=rd(x*k); if(Number.isInteger(b)&&d<200) return {q:`Ce tableau est un tableau de proportionnalité. Calcule <i>x</i>.`, fig:croix(String(a),N(b),"x",N(d)), rep:ans(x), ex:`a × d = b × c : ${a} × ${N(d)} = ${N(b)} × <i>x</i>, donc :<br><i>x</i> = ${F(`${a} × ${N(d)}`,N(b))}<br><i>x</i> = ${N(x)}`, sx:S_CROIX}; } return {q:"Calcule x : 4 et 10 en 1re ligne, 6 et x en 2e ligne (proportionnalité).", rep:["15"], ex:"<br><i>x</i> = 6 × 10 ÷ 4<br><i>x</i> = 15", sx:S_CROIX}; }} ],
 3:[ {g:()=>{ let a,b,c,v; do{ a=ri(3,13); b=ri(20,90); c=ri(15,80); v=b*c/a; }while(Number.isInteger(rd(v*100,6))); const r=Math.round(v*100)/100;
       return {q:`Avec ${b} L d'eau dans un aquarium, la hauteur d'eau est de ${a} cm. La quantité d'eau est proportionnelle à la hauteur. Quelle quantité d'eau faut-il pour une hauteur de ${c} cm ? (arrondi au centième)`, fig:croix(String(b),String(a),"x",String(c)), rep:ans(r,"L"), ex:`<i>x</i> × ${a} = ${b} × ${c}, donc :<br><i>x</i> = ${F(`${b} × ${c}`,a)}<br><i>x</i> ≈ ${N(r,2)} L`, sx:S_CROIX}; }} ]
}},
{nom:"Reconnaître une situation de proportionnalité", schema:S_REC, q:{
 1:[ {g:()=>{ const T=qProp(); return {q:"Ce tableau est-il un tableau de proportionnalité ?", fig:ptab({r1:T.xs.map(String),r2:T.ys.map(y=>N(y))}), c:ON, rep:T.ok?"Oui":"Non", ex:T.ok?`Tous les quotients valent ${N(T.k)} : ${T.xs.map((x,i)=>`${N(T.ys[i])} ÷ ${x} = ${N(T.k)}`).join(" ; ")}.`:`${N(T.ys[0])} ÷ ${T.xs[0]} = ${N(T.ys[0]/T.xs[0])} mais ${N(T.ys[T.j])} ÷ ${T.xs[T.j]} ${Number.isInteger(rd(T.ys[T.j]/T.xs[T.j]*1e3,6))?"=":"≈"} ${N(T.ys[T.j]/T.xs[T.j],3)} : un quotient différent suffit.`, sx:S_REC}; }} ],
 2:[ {g:()=>{ const n1=pick([4,6,8]), n2=pick([10,12,16]), u=pick([0.25,0.3,0.4,0.5]), ok=Math.random()<0.4; const p2=ok?rd(n2*u):rd(n2*u-pick([0.2,0.4,0.5,0.6]));
       return {q:`Un pack de ${n1} yaourts coûte ${E(n1*u)} €. Un pack de ${n2} yaourts coûte ${E(p2)} €. Le prix est-il proportionnel au nombre de yaourts ?`, c:ON, rep:ok?"Oui":"Non", ex:`${E(n1*u)} ÷ ${n1} = ${N(u)} et ${E(p2)} ÷ ${n2} ${Number.isInteger(rd(p2/n2*1e3,6))?"=":"≈"} ${N(p2/n2,3)}. ${ok?"Les quotients sont égaux.":"Les quotients sont différents."}`, sx:S_REC}; }} ],
 3:[ {q:"Les citrons sont vendus 1 € l'unité. Leur prix est-il proportionnel à leur poids ?", c:ON, rep:"Non", ex:"Le prix dépend du nombre de citrons, pas de leur poids.", sx:S_REC},
     {q:"Un site vend des sachets 0,75 € l'un, avec 5 € de frais de port. Le prix payé est-il proportionnel au nombre de sachets ?", c:ON, rep:"Non", ex:"4 sachets : 8 € (8 ÷ 4 = 2) ; 8 sachets : 11 € (11 ÷ 8 = 1,375). À cause des frais de port, les quotients sont différents.", sx:S_REC},
     {q:"Les carottes sont vendues 1,80 €/kg. Leur prix est-il proportionnel à leur masse ?", c:ON, rep:"Oui", ex:"On multiplie la masse (en kg) par 1,80 pour obtenir le prix.", sx:S_REC} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 3", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Les calculs doivent être écrits et les réponses rédigées par une phrase",
comp:[
  ["CALCULER","Je calcule une quatrième proportionnelle avec le coefficient, en multipliant ou en additionnant des colonnes.","Ex. 1 et 2 (7 points)"],
  ["CALCULER","J'utilise l'égalité des produits en croix et j'arrondis un résultat.","Ex. 3 (4 points)"],
  ["RAISONNER","Je démontre qu'un tableau est, ou n'est pas, un tableau de proportionnalité.","Ex. 4 (4 points)"],
  ["MODÉLISER","Je résous un problème de proportionnalité et j'interprète le résultat.","Ex. 5 (5 points)"]
],
exos:[
{t:"Au cinéma (sans produit en croix)", p:4, h:`<p>Le prix payé au cinéma est proportionnel au nombre de places achetées.</p><p>Recopie et complète le tableau. Indique tes calculs par des flèches.</p>
  ${tab(["Nombre de places","3","6","1","","7"],[["Prix (en €)","22,50","","","30",""]])}`,
 c:`${ptab({h1:"Nombre de places",h2:"Prix (en €)",r1:["3","6","1","!4","7"],r2:["22,50","!45","!7,50","30","!52,50"],side:"× 7,5"})}
  <p>6 = 3 × 2, donc 22,50 × 2 = 45 € <i>(1 point)</i></p><p>1 = 3 ÷ 3, donc 22,50 ÷ 3 = 7,50 € <i>(1 point)</i></p><p>30 = 22,50 + 7,50, donc 3 + 1 = 4 places <i>(1 point)</i></p><p>7 = 6 + 1, donc 45 + 7,50 = 52,50 € <i>(1 point)</i></p>`},
{t:"Le maraîcher", p:3, h:`<p>Chez le maraîcher, 2,5 kg de pommes coûtent 6 €.</p><p><b>a)</b> Combien coûte 1 kg de pommes ?</p><p><b>b)</b> Combien coûtent 4,2 kg de pommes ?</p><p><b>c)</b> Avec 15 €, quelle masse de pommes peut-on acheter ?</p>`,
 c:`<p><b>a)</b> 6 ÷ 2,5 = 2,4 : 1 kg coûte 2,40 €. <i>(1 point)</i></p><p><b>b)</b> 4,2 × 2,40 = 10,08 : 4,2 kg coûtent 10,08 €. <i>(1 point)</i></p><p><b>c)</b> 15 ÷ 2,40 = 6,25 : on peut acheter 6,25 kg de pommes. <i>(1 point)</i></p>`},
{t:"La pile de feuilles (produits en croix)", p:4, h:`<p>La hauteur d'une pile de feuilles est proportionnelle au nombre de feuilles.</p><p>Une pile de 500 feuilles mesure 4,8 cm.</p>
  ${tab(["Nombre de feuilles","500","320",""],[["Hauteur (en cm)","4,8","<i>x</i>","3"]])}
  <p><b>a)</b> Calcule <i>x</i> en utilisant l'égalité des produits en croix. Interprète le résultat.</p><p><b>b)</b> Combien de feuilles faut-il pour une pile de 3 cm ? Donne l'arrondi à l'unité.</p>`,
 c:`<p><b>a)</b> 500 × <i>x</i> = 4,8 × 320, donc :</p><p class="calc"><i>x</i> = ${F("4,8 × 320",500)}<br><i>x</i> = ${F("1 536",500)}<br><i>x</i> = 3,072</p><p><i>(1,5 point)</i></p><p>Une pile de 320 feuilles mesure 3,072 cm (environ 3,1 cm). <i>(0,5 point)</i></p>
  <p><b>b)</b> <i>y</i> × 4,8 = 500 × 3, donc :</p><p class="calc"><i>y</i> = ${F("500 × 3","4,8")}<br><i>y</i> = 312,5</p><p><i>(1,5 point)</i></p><p>Il faut environ 313 feuilles (312 ou 313 feuilles acceptés). <i>(0,5 point)</i></p>`},
{t:"Proportionnel ou non ?", p:4, h:`<p>Pour chaque situation, indique si c'est une situation de proportionnalité. <b>Justifie.</b></p>
  <p><b>a)</b></p>${tab(["Nombre de stylos","4","7","10"],[["Prix (en €)","5,20","9,10","13"]])}
  <p><b>b)</b></p>${tab(["Durée (en min)","2","5","8"],[["Distance (en m)","300","800","1 200"]])}
  <p><b>c)</b> Une salle de sport demande 20 € d'inscription, puis 15 € par mois. Le prix payé est-il proportionnel au nombre de mois ?</p>`,
 c:`<p><b>a)</b> 5,20 ÷ 4 = 1,3 · 9,10 ÷ 7 = 1,3 · 13 ÷ 10 = 1,3. Les quotients sont égaux : c'est une situation de proportionnalité. <i>(1,5 point)</i></p>
  <p><b>b)</b> 300 ÷ 2 = 150 et 800 ÷ 5 = 160. 150 ≠ 160 : ce n'est pas une situation de proportionnalité. <i>(1,5 point)</i></p>
  <p><b>c)</b> 1 mois : 20 + 15 = 35 € ; 2 mois : 20 + 30 = 50 €. 35 × 2 = 70 ≠ 50 : ce n'est pas proportionnel (à cause de l'inscription). <i>(1 point)</i></p>`},
{t:"La location de kayaks", p:5, h:`<p>Pour louer un kayak, deux loueurs proposent :</p>
  ${tab(["Loueur « Rivière »","Loueur « Océan »"],[["9 € l'heure","12 € de réservation, puis 6 € l'heure"]])}
  <p><b>a)</b> Recopie et complète le tableau.</p>${tab(["Durée (en h)","2","4","6"],[["Prix « Rivière » (en €)","","",""],["Prix « Océan » (en €)","","",""]])}
  <p><b>b)</b> Pour chaque loueur, le prix est-il proportionnel à la durée ? Justifie.</p><p><b>c)</b> Quel loueur Hugo doit-il choisir pour une sortie de 6 h ? Et pour une sortie de 2 h ?</p>`,
 c:`<p><b>a)</b> Rivière : 2 × 9 = 18 € ; 4 × 9 = 36 € ; 6 × 9 = 54 €. Océan : 12 + 2 × 6 = 24 € ; 12 + 4 × 6 = 36 € ; 12 + 6 × 6 = 48 €. <i>(2 points)</i></p>
  ${tab(["Durée (en h)","2","4","6"],[["Prix « Rivière » (en €)","18","36","54"],["Prix « Océan » (en €)","24","36","48"]])}
  <p><b>b)</b> Rivière : 18 ÷ 2 = 36 ÷ 4 = 54 ÷ 6 = 9 : c'est proportionnel. <i>(1 point)</i></p><p>Océan : 24 ÷ 2 = 12 et 36 ÷ 4 = 9 : ce n'est pas proportionnel. <i>(1 point)</i></p>
  <p><b>c)</b> Pour 6 h, Hugo choisit « Océan » (48 € &lt; 54 €). Pour 2 h, il choisit « Rivière » (18 € &lt; 24 €). <i>(1 point)</i></p>`}
]}
};
})();
