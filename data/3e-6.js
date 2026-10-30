/* 3e — Chapitre 6 : Les pourcentages (cours « Proportionnalité - Pourcentage » et fiche d'exercices de M. Staal)
   Corrections des exercices écrites d'après le cours (la fiche n'a pas de corrigé).
   Les schémas « valeur initiale → valeur finale » sont dessinés en SVG (comme sur la fiche et le bilan de M. Staal). */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const rd=(x,k=4)=>Math.round(x*10**k)/10**k;
/* écriture française : 1 000 · 14,9 · −2,5 */
const N=(x,k=4)=>{ const v=rd(x,k); const [i,d]=String(Math.abs(v)).split("."); return (v<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* une somme d'argent : 33,60 € (deux décimales si ce n'est pas un nombre entier) */
const E=x=>{ const v=rd(x,2); if(Number.isInteger(v)) return N(v)+"\u00a0€"; const [i,d]=v.toFixed(2).split("."); return i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+","+d+"\u00a0€"; };
const E0=x=>E(x).replace("\u00a0€","");
const P=x=>N(x)+"\u00a0%";
/* coefficient multiplicateur d'une évolution de t % (t > 0 : hausse, t < 0 : baisse) */
const K=t=>rd(1+t/100,6);
/* écriture « 100/100 + t/100 = (100+t)/100 = k » */
const kLine=t=>`{100/100} ${t>0?"+":"−"} {${N(Math.abs(t))}/100} = {${N(100+t)}/100} = ${N(K(t))}`;
/* même calcul écrit en chaîne, une étape par ligne */
const kChain=(t,k="k")=>`${k} = {100/100} ${t>0?"+":"−"} {${N(Math.abs(t))}/100}<br>${k} = {${N(100+t)}/100}<br>${k} = ${N(K(t))}`;
/* réponses libres acceptées pour un nombre décimal (1,1 et 1,10 ; 33,6 et 33,60) */
const AL=(x,u="")=>{ const v=rd(x,6), a=[N(v,6)]; if(!Number.isInteger(v) && Number.isInteger(rd(v*10,6))){ a.push(v.toFixed(2).replace(".",",")); } if(u) a.slice().forEach(s=>a.push(s+" "+u, s+u)); return a; };
window.PCT3 = {N, E, E0, P, K, kLine, kChain, AL, rd};

/* ------------------------------------------------------------------
   Schéma d'une évolution : valeur initiale → (flèche courbe, × k) → valeur finale
   o = {l:["P initial","32 €"], r:["P final","?"], k:"× 1,05", w}
------------------------------------------------------------------ */
function evo(o){
  const w=o.w||300, H=118, x0=58, x1=w-58;
  const T=(x,y,t,st="")=>`<text x="${x}" y="${y}" text-anchor="middle" style="font-size:16px;fill:var(--ink);${st}">${t}</text>`;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="${o.alt||"Schéma d'une évolution"}">`;
  s+=`<path d="M${x0} 60 C ${x0+40} 14, ${x1-40} 14, ${x1} 56" style="fill:none;stroke:var(--ink);stroke-width:2.2"/>`;
  /* pointe de flèche dans la direction (40 ; 42) */
  const ux=40/Math.hypot(40,42), uy=42/Math.hypot(40,42), px=-uy, py=ux, L=12, Wd=6;
  s+=`<polygon points="${x1},56 ${(x1-ux*L+px*Wd).toFixed(1)},${(56-uy*L+py*Wd).toFixed(1)} ${(x1-ux*L-px*Wd).toFixed(1)},${(56-uy*L-py*Wd).toFixed(1)}" style="fill:var(--ink)"/>`;
  s+=T(w/2, 22, o.k, "font-weight:700;fill:var(--c)");
  s+=T(x0, 84, o.l[0], "font-weight:700")+T(x0, 106, o.l[1]);
  s+=T(x1, 84, o.r[0], "font-weight:700")+T(x1, 106, o.r[1]);
  return s+"</svg>";
}
window.PCT3.evo = evo;
const tab=(head, rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
window.PCT3.tab = tab;
const ex=(p,alt,w)=>img("3k6ex/"+p+".png",alt,w);
const SURF = `<figure style="max-width:120px">${ex("surf","Planche de surf",90)}<figcaption>Planche de surf : 115 €</figcaption></figure>`;
const BALL = `<figure style="max-width:120px">${ex("ballon","Ballon de basket",90)}<figcaption>Ballon de basket : 30 €</figcaption></figure>`;

/* ===================== schémas (rappels du QCM) ===================== */
const S_PRENDRE = sch("Prendre t % d'une quantité", `<p class="calc">t % de x = {t/100} × x</p><p class="calc">P = {5/100} × 40<br>P = 0,05 × 40<br>P = 2 €</p>`);
const S_COEF = sch("Le coefficient multiplicateur", `${tab(["","Calcul","Coefficient"],[["Augmenter de 5 %",`{100/100} + {5/100} = {105/100}`,"1,05"],["Diminuer de 5 %",`{100/100} − {5/100} = {95/100}`,"0,95"]])}<p class="schN">Augmenter x de 5 % : 1,05 × x. Diminuer x de 5 % : 0,95 × x.</p>`);
const S_FINAL = sch("Trouver la valeur finale", `${evo({l:["P initial","32 €"], r:["P final","?"], k:"× 1,05", w:260})}<p class="calc">1,05 × 32 = 33,60 €</p><p class="schN">Valeur finale = coefficient × valeur initiale.</p>`);
const S_INIT = sch("Trouver la valeur initiale", `${evo({l:["P initial","?"], r:["P final","51,30 €"], k:"× 0,95", w:260})}<p class="calc">P<sub>initial</sub> × 0,95 = 51,30<br>P<sub>initial</sub> = 51,30 ÷ 0,95 = 54 €</p><p class="schN">On divise la valeur finale par le coefficient.</p>`);
const S_EVOL = sch("Trouver un pourcentage d'évolution", `${evo({l:["V initiale","6 200"], r:["V finale","6 510"], k:"× k", w:260})}<p class="calc">k = 6 510 ÷ 6 200 = 1,05 = {100/100} + {5/100}</p><p class="schN">k &gt; 1 : hausse de 5 %. Si k &lt; 1, c'est une baisse.</p>`);
const S_SUCC = sch("Évolutions successives", `<p class="calc">−30 % puis +10 % : 0,70 × 1,10 = 0,77<br>0,77 = {100/100} − {23/100} : baisse de 23 %</p><p class="schN">On multiplie les coefficients. On n'additionne pas les pourcentages.</p>`);

/* ---------- petits générateurs ---------- */
const PCTS=[5,10,12,15,20,25,30,35,40,45,60,75];
/* hausse ou baisse t (en %) et prix initial « propres » */
const priceInt=()=>ri(4,90)*5;
const evoTxt=t=>t>0?`augmenté de ${P(t)}`:`baissé de ${P(-t)}`;

CH["3e-6"] = {
intro:"Calculer le pourcentage d'une quantité, augmenter ou diminuer une valeur d'un pourcentage avec le coefficient multiplicateur, retrouver une valeur initiale, un pourcentage d'évolution, et enchaîner des évolutions.",
savoir:[
  "calculer le pourcentage d'une quantité ;",
  "trouver le coefficient multiplicateur d'une augmentation ou d'une diminution ;",
  "trouver la valeur finale après une augmentation ou une diminution ;",
  "trouver la valeur initiale avant une augmentation ou une diminution ;",
  "trouver le pourcentage d'augmentation ou de diminution, même après plusieurs évolutions successives."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Calculer le pourcentage d'une quantité", h:`
  <div class="retenir" data-l="Définition"><p>Soit t un nombre.</p><p>Prendre <b>t %</b> d'une quantité, c'est multiplier cette quantité par {t/100}.</p></div>
  <p><b>Exemple :</b> 5 % d'une quantité x :</p><p class="calc">{5/100} × x = 0,05 × x</p>
  <p><b>Exercice :</b> un pull coûte 40 €. Que représente 5 % du prix du pull ?</p>
  <p class="calc">P = {5/100} × 40<br>P = 0,05 × 40<br>P = 2</p><p>5 % de 40 € représente <b>2 €</b>.</p>`},
{k:"II", t:"Augmenter ou diminuer une quantité d'un pourcentage", h:`
  <div class="retenir" data-l="Définition"><p>Soit t un nombre.</p><p><b>Augmenter</b> une quantité de t %, c'est multiplier cette quantité par {100/100} + {t/100}.</p></div>
  <p><b>Exemple :</b></p><p class="calc">k = {100/100} + {5/100}<br>k = {105/100}<br>k = 1,05</p><p>Augmenter une quantité x de 5 % revient à multiplier x par 1,05 : <b>1,05 × x</b>.</p>
  <div class="retenir" data-l="Définition"><p>Soit t un nombre.</p><p><b>Diminuer</b> une quantité de t %, c'est multiplier cette quantité par {100/100} − {t/100}.</p></div>
  <p><b>Exemple :</b></p><p class="calc">k = {100/100} − {5/100}<br>k = {95/100}<br>k = 0,95</p><p>Diminuer une quantité x de 5 % revient à multiplier x par 0,95 : <b>0,95 × x</b>.</p>
  <div class="retenir" data-l="Vocabulaire"><p>Le nombre par lequel on multiplie (1,05 ou 0,95 ici) s'appelle le <b>coefficient multiplicateur</b>.</p></div>
  <h4>Trouver la valeur finale après une augmentation ou une diminution</h4>
  <p><b>Exercice 1 :</b> un pull à 32 € a augmenté de 5 %. Quel est son prix après augmentation ?</p>
  ${evo({l:["P initial","32 €"], r:["P final","?"], k:"× 1,05", alt:"Le prix initial 32 € est multiplié par 1,05"})}
  <p class="calc">k = {100/100} + {5/100}<br>k = {105/100}<br>k = 1,05</p><p>Augmenter un prix de 5 % revient à le multiplier par 1,05.</p><p class="calc">1,05 × 32 = 33,60</p><p>Le prix du pull après augmentation est de <b>33,60 €</b>.</p>
  <p><b>Exercice 2 :</b> un pull à 32 € a diminué de 5 %. Quel est son prix après diminution ?</p>
  <p class="calc">k = {100/100} − {5/100}<br>k = {95/100}<br>k = 0,95</p><p>Diminuer un prix de 5 % revient à le multiplier par 0,95.</p><p class="calc">0,95 × 32 = 30,40</p><p>Le prix du pull après diminution est de <b>30,40 €</b>.</p>`},
{k:"III", t:"Trouver la valeur initiale avant une augmentation ou une diminution", h:`
  <div class="retenir" data-l="Méthode"><p>On écrit : P<sub>initial</sub> × coefficient = P<sub>final</sub>.</p><p>Donc P<sub>initial</sub> = P<sub>final</sub> ÷ coefficient.</p></div>
  <p><b>Exercice 1 :</b> un pull vaut 51,30 € après une augmentation de 5 %. Quel est son prix avant l'augmentation ?</p>
  ${evo({l:["P initial","?"], r:["P final","51,30 €"], k:"× 1,05", alt:"Un prix inconnu multiplié par 1,05 donne 51,30 €"})}
  <p class="calc">k = {100/100} + {5/100}<br>k = {105/100}<br>k = 1,05</p><p>Augmenter un prix de 5 % revient à le multiplier par 1,05.</p>
  <p class="calc">P<sub>initial</sub> × 1,05 = 51,30<br>Donc P<sub>initial</sub> = 51,30 ÷ 1,05<br>P<sub>initial</sub> ≈ 48,86</p><p>Le prix du pull avant l'augmentation était d'environ <b>48,86 €</b>.</p>
  <p><b>Exercice 2 :</b> un pull vaut 51,30 € après une diminution de 5 %. Quel est son prix avant la diminution ?</p>
  <p class="calc">k = {100/100} − {5/100}<br>k = {95/100}<br>k = 0,95</p><p>Diminuer un prix de 5 % revient à le multiplier par 0,95.</p>
  <p class="calc">P<sub>initial</sub> × 0,95 = 51,30<br>Donc P<sub>initial</sub> = 51,30 ÷ 0,95<br>P<sub>initial</sub> = 54</p><p>Le prix du pull avant la diminution était de <b>54 €</b>.</p>`},
{k:"IV", t:"Trouver le pourcentage d'augmentation ou de diminution", h:`
  <div class="retenir" data-l="Méthode"><p>On cherche le coefficient multiplicateur k tel que : valeur initiale × k = valeur finale.</p><p>Donc k = valeur finale ÷ valeur initiale.</p><p>Puis on écrit k sous la forme {100/100} + {t/100} (augmentation de t %) ou {100/100} − {t/100} (diminution de t %).</p></div>
  <p><b>Exercice 1 :</b> la population d'une ville est passée de 6 200 à 6 510 habitants. Quel est le pourcentage d'augmentation du nombre d'habitants ?</p>
  ${evo({l:["6 200",""], r:["6 510",""], k:"× k", alt:"6 200 multiplié par k donne 6 510"})}
  <p class="calc">6 200 × k = 6 510<br>Donc k = 6 510 ÷ 6 200<br>k = 1,05</p><p class="calc">1,05 = {100/100} + {5/100}</p><p>Le nombre d'habitants a <b>augmenté de 5 %</b>.</p>
  <p><b>Exercice 2 :</b> la population d'une ville est passée de 3 600 à 3 132 habitants. Quel est le pourcentage de diminution du nombre d'habitants ?</p>
  <p class="calc">3 600 × k = 3 132<br>Donc k = 3 132 ÷ 3 600<br>k = 0,87</p><p class="calc">0,87 = {100/100} − {13/100}</p><p>Le nombre d'habitants a <b>diminué de 13 %</b>.</p>`},
{k:"V", t:"Successions d'augmentations ou de diminutions", h:`
  <div class="retenir" data-l="Méthode"><p>Pour enchaîner deux évolutions, on multiplie leurs coefficients multiplicateurs.</p><p>Puis on écrit le résultat sous la forme {100/100} + {t/100} ou {100/100} − {t/100}.</p></div>
  <p><b>Exercice :</b> pour chaque affirmation, dire si elle est vraie ou fausse en justifiant la réponse.</p>
  <p><b>Affirmation 1 :</b> « Diminuer un prix de 30 % puis l'augmenter de 10 % revient à diminuer le prix de 20 %. »</p>
  <p class="calc">k<sub>1</sub> = {100/100} − {30/100}<br>k<sub>1</sub> = {70/100}<br>k<sub>1</sub> = 0,70</p><p>Diminuer un prix de 30 % revient à le multiplier par 0,70.</p>
  <p class="calc">k<sub>2</sub> = {100/100} + {10/100}<br>k<sub>2</sub> = {110/100}<br>k<sub>2</sub> = 1,10</p><p>Augmenter un prix de 10 % revient à le multiplier par 1,10.</p>
  <p class="calc">0,70 × 1,10 = 0,77</p><p>Le prix initial a été multiplié par 0,77, ce qui traduit une baisse de 23 % (0,77 = {100/100} − {23/100}).</p><p>Donc <b>l'affirmation est fausse</b>.</p>
  <p><b>Affirmation 2 :</b> « Augmenter un prix de 40 % puis le diminuer de 40 % ramène au prix de départ. »</p>
  <p class="calc">k<sub>1</sub> = {100/100} + {40/100}<br>k<sub>1</sub> = {140/100}<br>k<sub>1</sub> = 1,40</p><p>Augmenter un prix de 40 % revient à le multiplier par 1,40.</p>
  <p class="calc">k<sub>2</sub> = {100/100} − {40/100}<br>k<sub>2</sub> = {60/100}<br>k<sub>2</sub> = 0,60</p><p>Diminuer un prix de 40 % revient à le multiplier par 0,60.</p>
  <p class="calc">1,40 × 0,60 = 0,84</p><p>Le prix initial a été multiplié par 0,84, ce qui traduit une baisse de 16 % (0,84 = {100/100} − {16/100}).</p><p>Donc <b>l'affirmation est fausse</b>.</p>
  <div class="attention"><b>ATTENTION :</b> augmenter puis diminuer du même pourcentage ne ramène pas au prix de départ.</div>
  <p><b>Affirmation 3 :</b> « Augmenter un prix de 25 % puis le diminuer de 20 % ramène au prix de départ. »</p>
  <p class="calc">k<sub>1</sub> = {100/100} + {25/100}<br>k<sub>1</sub> = {125/100}<br>k<sub>1</sub> = 1,25</p><p>Augmenter un prix de 25 % revient à le multiplier par 1,25.</p>
  <p class="calc">k<sub>2</sub> = {100/100} − {20/100}<br>k<sub>2</sub> = {80/100}<br>k<sub>2</sub> = 0,80</p><p>Diminuer un prix de 20 % revient à le multiplier par 0,80.</p>
  <p class="calc">1,25 × 0,80 = 1</p><p>Le prix initial a été multiplié par 1 : le prix n'a pas évolué.</p><p>Donc <b>l'affirmation est vraie</b>.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Calculer le pourcentage d'une quantité", e:[
  {n:"Activité 1", t:"Prendre une fraction d'une quantité", w:"Sur ton cahier", h:`<p>Dans chaque cas, indique la somme que je possède. Justifie.</p><p><b>a)</b> J'ai {1/4} de 26 €.</p><p><b>b)</b> J'ai {7/8} de 26 €.</p><p><b>c)</b> J'ai 52 % de 26 €.</p>`,
   c:`<p><b>a)</b></p><p class="calc">P = {1/4} × 26<br>P = 26 ÷ 4<br>P = <b>6,50 €</b></p><p><b>b)</b></p><p class="calc">P = {7/8} × 26<br>P = 7 × 26 ÷ 8<br>P = 182 ÷ 8<br>P = <b>22,75 €</b></p><p><b>c)</b> 52 % = {52/100}</p><p class="calc">P = {52/100} × 26<br>P = 0,52 × 26<br>P = <b>13,52 €</b></p>`},
  {n:"Exercice 1", t:"Pourcentage d'eau dans une pastèque", w:"Sur ton cahier", h:`<p>En moyenne, une pastèque contient 90 % d'eau.</p><p>Quelle masse d'eau contient une pastèque de 3,6 kg ?</p>`,
   c:`<p class="calc">P = {90/100} × 3,6<br>P = 0,9 × 3,6<br>P = 3,24</p><p>Une pastèque de 3,6 kg contient <b>3,24 kg</b> d'eau.</p>`},
  {n:"Exercice 2", t:"Troupeau de moutons", w:"Sur ton cahier", h:`<p>Le troupeau de Jules est constitué de 80 moutons.</p><p>75 % d'entre eux sont blancs, 5 % sont noirs et les autres sont bruns.</p><p>Combien de moutons sont noirs ?</p>`,
   c:`<p class="calc">P = {5/100} × 80<br>P = 0,05 × 80<br>P = 4</p><p><b>4 moutons</b> sont noirs. (Le pourcentage des moutons blancs ne sert pas ici.)</p>`},
  {n:"Exercice 3", t:"Billet d'avion", w:"Sur ton cahier", h:`<p>Un billet d'avion à 180 € augmente de 12 %.</p><p>Quel est le prix du billet d'avion après augmentation ?</p>`,
   c:`<p>Augmentation A :</p><p class="calc">A = {12/100} × 180<br>A = 0,12 × 180<br>A = 21,60 €</p><p>Nouveau prix : 180 + 21,60 = <b>201,60 €</b>.</p>`},
  {n:"Exercice 4", t:"Vélos vendus", w:"Sur ton cahier", h:`<p>En 2018, un fabricant a vendu 4 600 vélos.</p><p>En 2019, ses ventes ont augmenté de 27 %.</p><p>Combien de vélos a-t-il vendus en 2019 ?</p>`,
   c:`<p>Augmentation A :</p><p class="calc">A = {27/100} × 4 600<br>A = 0,27 × 4 600<br>A = 1 242 vélos</p><p>En 2019 : 4 600 + 1 242 = <b>5 842 vélos</b>.</p>`},
  {n:"Exercice 5", t:"Soldes", w:"Sur ton cahier", h:`<p>Un pull coûtait 30 €. Pendant les soldes, son prix a baissé de 20 %.</p><p>Quel est le prix du pull après réduction ?</p>`,
   c:`<p>Réduction R :</p><p class="calc">R = {20/100} × 30<br>R = 0,2 × 30<br>R = 6 €</p><p>Prix après réduction : 30 − 6 = <b>24 €</b>.</p>`},
  {n:"Exercice 6", t:"Diminution du chiffre d'affaires", w:"Sur ton cahier", h:`<p>En 2019, le chiffre d'affaires de la société de Marie était de 138 000 €.</p><p>Il a diminué de 18 % en 2020.</p><p>Quel a été son chiffre d'affaires en 2020 ?</p>`,
   c:`<p>Diminution D :</p><p class="calc">D = {18/100} × 138 000<br>D = 0,18 × 138 000<br>D = 24 840 €</p><p>En 2020 : 138 000 − 24 840 = <b>113 160 €</b>.</p>`},
  {n:"Exercice 7", t:"Élections de délégués", w:"Sur ton cahier", h:`<p>Les trente élèves d'une classe ont voté pour leurs déléguées filles.</p><p>Léa a obtenu 40 % des voix, Margaux a obtenu 10 % des voix et Nina a obtenu le reste des voix.</p><p>Combien d'élèves de la classe ont voté pour chacune d'elles ?</p>`,
   c:`<p>Nombre L de voix de Léa :</p><p class="calc">L = {40/100} × 30<br>L = 0,4 × 30<br>L = <b>12 élèves</b></p><p>Nombre M de voix de Margaux :</p><p class="calc">M = {10/100} × 30<br>M = 0,1 × 30<br>M = <b>3 élèves</b></p><p>Nina : 30 − 12 − 3 = <b>15 élèves</b> (100 − 40 − 10 = 50 % des voix).</p>`},
  {n:"Exercice 8", t:"Montant du SMIC en 2020", w:"Sur ton cahier", h:`<p>En 2019, le SMIC (salaire minimum de croissance : salaire minimum légal d'une personne qui travaille 35 h par semaine) était de 1 202,92 €.</p><p>En 2020, le SMIC a augmenté de 2,3 %.</p><p>Quel est le montant, en €, du SMIC en 2020 ? Arrondis au centime.</p>`,
   c:`<p>Augmentation A :</p><p class="calc">A = {2,3/100} × 1 202,92<br>A = 0,023 × 1 202,92<br>A ≈ 27,67 €</p><p>SMIC en 2020 : 1 202,92 + 27,67 = <b>1 230,59 €</b>.</p><p>En un seul calcul :</p><p class="calc">S = 1,023 × 1 202,92<br>S = 1 230,58716<br>S ≈ 1 230,59 €</p>`},
  {n:"Exercice 9", t:"Le 7<sup>e</sup> continent", w:"Sur ton cahier", h:`<p>Dans l'océan Pacifique Nord, des déchets en plastique qui flottent se sont accumulés. Ils forment une poubelle géante, aujourd'hui grande comme 6 fois la France.</p><p><b>1)</b> La superficie de la France est d'environ 550 000 km². Quelle est la superficie actuelle de cette poubelle géante ?</p><p><b>2)</b> La superficie de cette poubelle augmente chaque année de 10 %. Quelle sera sa superficie dans un an ?</p>`,
   c:`<p><b>1)</b> 6 × 550 000 = <b>3 300 000 km²</b>.</p><p><b>2)</b> Augmentation : {10/100} × 3 300 000 = 330 000 km².</p><p>Dans un an : 3 300 000 + 330 000 = <b>3 630 000 km²</b>.</p>`}
 ]},
{t:"Augmenter une valeur d'un pourcentage", e:[
  {n:"Activité 2", t:"Augmenter une valeur d'un pourcentage", w:"Sur ton cahier", h:`<p>Dans une boutique, un gérant décide d'augmenter le prix de chaque article de 20 % par rapport à l'année passée.</p><div class="figs">${SURF}${BALL}</div>
   <p><b>1)</b> Calcule le prix de la planche de surf et celui du ballon de basket après l'augmentation.</p><p><b>2)</b> Le gérant demande à son stagiaire de calculer le plus rapidement possible tous les nouveaux prix.</p><p>Cherche comment trouver le nouveau prix de la planche de surf <b>en un calcul</b>. Fais de même pour le ballon de basket.</p>`,
   c:`<p><b>1)</b> Planche : {20/100} × 115 = 23 €, puis 115 + 23 = <b>138 €</b>.</p><p>Ballon : {20/100} × 30 = 6 €, puis 30 + 6 = <b>36 €</b>.</p>
   <p><b>2)</b></p><p class="calc">k = {100/100} + {20/100}<br>k = {120/100}<br>k = 1,2</p><p>Augmenter de 20 % revient à multiplier par 1,2.</p><p class="calc">Planche : 1,2 × 115 = 138 €<br>Ballon : 1,2 × 30 = 36 €</p>`},
  {n:"Exercice 10", t:"Prix d'un disque dur", w:"Sur ton cahier", h:`<p>Le prix des disques durs a augmenté de 15 % en un an.</p><p>L'année dernière, un disque dur externe coûtait 90 €.</p><p>Calcule le prix de ce disque dur après augmentation.</p>`,
   c:`<p class="calc">k = {100/100} + {15/100}<br>k = {115/100}<br>k = 1,15</p><p class="calc">1,15 × 90 = 103,50</p><p>Le disque dur coûte <b>103,50 €</b>.</p>`},
  {n:"Exercice 11", t:"Trottinettes vendues", w:"Sur ton cahier", h:`<p>En 2020, un magasin a vendu 3 500 trottinettes.</p><p>En 2021, ses ventes ont augmenté de 18 %.</p><p>Combien de trottinettes a-t-il vendues en 2021 ?</p><p><i>(Utilise le coefficient multiplicateur : fais-le en un seul calcul.)</i></p>`,
   c:`<p class="calc">k = {100/100} + {18/100}<br>k = {118/100}<br>k = 1,18</p><p class="calc">1,18 × 3 500 = 4 130</p><p>Il a vendu <b>4 130 trottinettes</b> en 2021.</p>`},
  {n:"Exercice 12", t:"Tarif d'une compagnie d'énergie", w:"Sur ton cahier", h:`<p>Les tarifs d'une compagnie d'énergie augmentent de 7 %.</p><p>La famille Martin payait une facture annuelle de 460 €.</p><p>Quel sera le montant de leur nouvelle facture si leur consommation reste la même ?</p>`,
   c:`<p class="calc">k = {100/100} + {7/100}<br>k = {107/100}<br>k = 1,07</p><p class="calc">1,07 × 460 = 492,20</p><p>La nouvelle facture sera de <b>492,20 €</b>.</p>`},
  {n:"Exercice 13", t:"Calcul du coefficient multiplicateur", w:"Sur ton cahier", h:`<p>Dans chaque cas, justifie ta réponse.</p><p><b>a)</b> Augmenter une valeur de 36 % revient à multiplier cette valeur par quel nombre ?</p><p><b>b)</b> Augmenter une valeur de 4 % revient à multiplier cette valeur par quel nombre ?</p><p><b>c)</b> Augmenter une valeur de 2,5 % revient à multiplier cette valeur par quel nombre ?</p>`,
   c:`<div class="calcs"><p class="calc"><b>a)</b><br>k = {100/100} + {36/100}<br>k = {136/100}<br>k = <b>1,36</b></p><p class="calc"><b>b)</b><br>k = {100/100} + {4/100}<br>k = {104/100}<br>k = <b>1,04</b></p><p class="calc"><b>c)</b><br>k = {100/100} + {2,5/100}<br>k = {102,5/100}<br>k = <b>1,025</b></p></div>`}
 ]},
{t:"Diminuer une valeur d'un pourcentage", e:[
  {n:"Activité 3", t:"Diminuer une valeur d'un pourcentage", w:"Sur ton cahier", h:`<p>Dans une autre boutique, un gérant décide de <b>baisser le prix</b> de chaque article de 20 % par rapport à l'année passée.</p><div class="figs">${SURF}</div>
   <p><b>1)</b> Calcule le montant de la réduction, puis le prix de la planche de surf <b>après réduction</b>.</p><p><b>2)</b> Diminuer une valeur de 20 % revient à multiplier cette valeur par quel nombre ? Retrouve alors le prix de la planche après réduction <b>en un calcul</b>.</p>`,
   c:`<p><b>1)</b> Réduction R :</p><p class="calc">R = {20/100} × 115<br>R = 0,2 × 115<br>R = 23 €</p><p>Prix après réduction : 115 − 23 = <b>92 €</b>.</p><p><b>2)</b></p><p class="calc">k = {100/100} − {20/100}<br>k = {80/100}<br>k = 0,8</p><p>Diminuer une valeur de 20 % revient à la multiplier par <b>0,8</b>.</p><p class="calc">0,8 × 115 = 92</p><p>On retrouve bien <b>92 €</b>, en un seul calcul.</p>`},
  {n:"Bilan 1", t:"Le coefficient multiplicateur", w:"Sur ton cahier", h:`<p>Ce tableau précise <b>le coefficient multiplicateur</b> à utiliser selon le type de situation où intervient un pourcentage. Recopie-le et complète la colonne des calculs.</p>${tab(["","Calculs"],[["Prendre 5 % de 32 €",""],["Augmenter 32 € de 5 %",""],["Diminuer 32 € de 5 %",""]])}`,
   c:tab(["","Calculs"],[["Prendre 5 % de 32 €","P = {5/100} × 32<br>P = 0,05 × 32<br>P = 1,60 €"],["Augmenter 32 € de 5 %","{100/100} + {5/100} = 1,05 ; 1,05 × 32 = 33,60 €"],["Diminuer 32 € de 5 %","{100/100} − {5/100} = 0,95 ; 0,95 × 32 = 30,40 €"]])},
  {n:"Exercice 14", t:"Soldes", w:"Sur ton cahier", h:`<p>Un pull coûtait 44,90 €. Pendant les soldes, son prix a baissé de 30 %.</p><p>Quel est le prix du pull après réduction ?</p>`,
   c:`<p class="calc">k = {100/100} − {30/100}<br>k = {70/100}<br>k = 0,7</p><p class="calc">0,7 × 44,90 = 31,43</p><p>Le pull coûte <b>31,43 €</b> après réduction.</p>`},
  {n:"Exercice 15", t:"Soldes au magasin de sport", w:"Sur ton cahier", h:`<p>Pour les soldes, un magasin de sport fait une remise de 40 % sur les chaussures et de 25 % sur tous les vêtements.</p><p>Un manteau de ski coûtait 148,50 € avant les soldes. Combien coûtera-t-il pendant les soldes ?</p>`,
   c:`<p>Un manteau est un vêtement : la remise est de 25 % (les 40 % ne servent pas).</p><p class="calc">k = {100/100} − {25/100}<br>k = {75/100}<br>k = 0,75</p><p class="calc">0,75 × 148,50 = 111,375</p><p>Le manteau coûtera environ <b>111,38 €</b> (arrondi au centime).</p>`},
  {n:"Exercice 16", t:"Livres vendus", w:"Sur ton cahier", h:`<p>En 2022, une librairie a vendu 2 400 livres.</p><p>En 2023, ses ventes ont augmenté de 35 %.</p><p>Combien de livres a-t-elle vendus en 2023 ?</p><p><i>(Utilise le coefficient multiplicateur.)</i></p>`,
   c:`<p class="calc">k = {100/100} + {35/100}<br>k = {135/100}<br>k = 1,35</p><p class="calc">1,35 × 2 400 = 3 240</p><p>Elle a vendu <b>3 240 livres</b> en 2023.</p>`},
  {n:"Exercice 17", t:"Calcul du coefficient multiplicateur", w:"Sur ton cahier", h:`<p>Dans chaque cas, justifie ta réponse.</p><p><b>a)</b> Diminuer une valeur de 36 % revient à multiplier cette valeur par quel nombre ?</p><p><b>b)</b> Diminuer une valeur de 4 % revient à multiplier cette valeur par quel nombre ?</p><p><b>c)</b> Diminuer une valeur de 2,5 % revient à multiplier cette valeur par quel nombre ?</p>`,
   c:`<div class="calcs"><p class="calc"><b>a)</b><br>k = {100/100} − {36/100}<br>k = {64/100}<br>k = <b>0,64</b></p><p class="calc"><b>b)</b><br>k = {100/100} − {4/100}<br>k = {96/100}<br>k = <b>0,96</b></p><p class="calc"><b>c)</b><br>k = {100/100} − {2,5/100}<br>k = {97,5/100}<br>k = <b>0,975</b></p></div>`},
  {n:"Exercice 18", t:"Coefficient multiplicateur : QCM", w:"Sur ton cahier", h:`<p>Pour chacune des questions suivantes, choisis la bonne réponse.</p>${tab(["Question","Réponse A","Réponse B","Réponse C","Réponse D"],[["<b>1)</b> Un prix a été multiplié par 1,35 ; il a augmenté de :","13,5 %","3,5 %","35 %","autre"],["<b>2)</b> Un prix a été multiplié par 0,75 ; il a baissé de :","75 %","25 %","13,33 %","autre"],["<b>3)</b> Un prix a augmenté de 30 % ; il a été multiplié par :","0,30","0,70","1,30","autre"],["<b>4)</b> Un prix a baissé de 20 % ; il a été multiplié par :","0,20","0,80","1,20","autre"]])}`,
   c:`<p><b>1)</b> Réponse C : 1,35 = {100/100} + {35/100}, le prix a augmenté de <b>35 %</b>.</p><p><b>2)</b> Réponse B : 0,75 = {100/100} − {25/100}, le prix a baissé de <b>25 %</b>.</p><p><b>3)</b> Réponse C : {100/100} + {30/100} = <b>1,30</b>.</p><p><b>4)</b> Réponse B : {100/100} − {20/100} = <b>0,80</b>.</p>`},
  {n:"Exercice 19", t:"Élections de délégués", w:"Sur ton cahier", h:`<p>Les vingt-cinq élèves d'une classe ont voté pour leurs délégués garçons.</p><p>Hugo a obtenu 36 % des voix, Tom a obtenu 24 % des voix et Adam a obtenu le reste des voix.</p><p>Combien d'élèves de la classe ont voté pour chacun d'eux ?</p>`,
   c:`<p>Hugo : 0,36 × 25 = <b>9 élèves</b>.</p><p>Tom : 0,24 × 25 = <b>6 élèves</b>.</p><p>Adam : 100 − 36 − 24 = 40 %, et 0,40 × 25 = <b>10 élèves</b>.</p><p>Vérification : 9 + 6 + 10 = 25.</p>`},
  {n:"Exercice 20", t:"Prix du gazole", w:"Sur ton cahier", h:`<p>Il y a un an, le gazole était à 1,26 € le litre.</p><p>Aujourd'hui, son prix a augmenté de 24 %.</p><p>Quel est son prix aujourd'hui ?</p>`,
   c:`<p class="calc">k = {100/100} + {24/100}<br>k = {124/100}<br>k = 1,24</p><p class="calc">1,24 × 1,26 = 1,5624</p><p>Le gazole coûte environ <b>1,56 €</b> le litre.</p>`},
  {n:"Bilan 2", t:"Le coefficient multiplicateur", w:"Sur ton cahier", h:`<p>Recopie et complète le tableau avec une quantité x.</p>${tab(["","Calculs"],[["Prendre 5 % d'une quantité x",""],["Augmenter une quantité x de 5 %",""],["Diminuer une quantité x de 5 %",""]])}`,
   c:tab(["","Calculs"],[["Prendre 5 % d'une quantité x","{5/100} × x = <b>0,05 × x</b>"],["Augmenter une quantité x de 5 %","k = {100/100} + {5/100}<br>k = {105/100}<br>k = 1,05<br><b>1,05 × x</b>"],["Diminuer une quantité x de 5 %","k = {100/100} − {5/100}<br>k = {95/100}<br>k = 0,95<br><b>0,95 × x</b>"]])}
 ]},
{t:"Évolutions successives", e:[
  {n:"Activité 4", t:"Pourcentages d'évolution successifs", w:"Sur ton cahier", h:`<p>Dans une troisième boutique, un gérant a augmenté ses prix de 20 % en janvier.</p><p>Un mois après, il les a baissés de 20 %.</p><div class="figs">${SURF}</div><p><b>a)</b> Le prix de la planche de surf a-t-il baissé, est-il resté le même ou a-t-il augmenté ? Justifie.</p><p><b>b)</b> Si le prix a baissé ou augmenté, calcule le pourcentage de baisse ou de hausse.</p>`,
   c:`<p><b>a)</b> En janvier : 1,2 × 115 = 138 €. Un mois après : 0,8 × 138 = 110,40 €.</p><p>110,40 € &lt; 115 € : le prix a <b>baissé</b>.</p><p><b>b)</b></p><p class="calc">k = 1,2 × 0,8<br>k = 0,96<br>k = {100/100} − {4/100}</p><p>Le prix a baissé de <b>4 %</b> (vérification : 0,96 × 115 = 110,40 €).</p>`},
  {n:"Exercice 21", t:"Deux évolutions", w:"Sur ton cahier", h:`<p>Chaque question est indépendante.</p><p><b>1)</b> Le prix d'un objet augmente de 10 %, puis ce nouveau prix augmente de 30 %. De quel pourcentage a augmenté le prix initial ?</p><p><b>2)</b> Le prix d'un objet baisse de 25 %, puis ce nouveau prix augmente de 40 %. De quel pourcentage a augmenté (ou baissé) le prix initial ?</p>`,
   c:`<p><b>1)</b></p><p class="calc">k = 1,10 × 1,30<br>k = 1,43<br>k = {100/100} + {43/100}</p><p>Le prix initial a augmenté de <b>43 %</b>.</p><p><b>2)</b></p><p class="calc">k = 0,75 × 1,40<br>k = 1,05<br>k = {100/100} + {5/100}</p><p>Le prix initial a augmenté de <b>5 %</b>.</p>`},
  {n:"Exercice 22", t:"Évolutions successives : QCM", w:"Sur ton cahier", h:`<p>Pour chacune des questions suivantes, choisis la bonne réponse.</p>${tab(["Situation","Réponse A","Réponse B","Réponse C","Réponse D"],[["<b>1)</b> Le prix d'un objet augmente de 30 %, puis ce nouveau prix baisse de 30 %.","Le prix reste le même.","Le prix augmente de 91 %.","Le prix baisse de 9 %.","Le prix augmente de 9 %."],["<b>2)</b> Le prix d'un objet baisse de 15 %, puis ce nouveau prix augmente de 20 %.","Le prix reste le même.","Le prix augmente de 2 %.","Le prix baisse de 2 %.","Le prix augmente de 5 %."],["<b>3)</b> Le prix d'un objet baisse de 50 %, puis ce nouveau prix baisse de 40 %.","Le prix reste le même.","Le prix baisse de 90 %.","Le prix baisse de 30 %.","Le prix baisse de 70 %."],["<b>4)</b> Le prix d'un objet augmente de 25 %, puis ce nouveau prix baisse de 20 %.","Le prix reste le même.","Le prix augmente de 5 %.","Le prix baisse de 1 %.","Le prix augmente de 1 %."]])}`,
   c:`<p><b>1)</b></p><p class="calc">k = 1,30 × 0,70<br>k = 0,91<br>k = {100/100} − {9/100}</p><p>Réponse <b>C</b> (le prix baisse de 9 %).</p><p><b>2)</b></p><p class="calc">k = 0,85 × 1,20<br>k = 1,02<br>k = {100/100} + {2/100}</p><p>Réponse <b>B</b> (le prix augmente de 2 %).</p><p><b>3)</b></p><p class="calc">k = 0,50 × 0,60<br>k = 0,30<br>k = {100/100} − {70/100}</p><p>Réponse <b>D</b> (le prix baisse de 70 %).</p><p><b>4)</b> 1,25 × 0,80 = 1 : réponse <b>A</b> (le prix reste le même).</p>`}
 ]},
{t:"Valeur initiale et pourcentage d'évolution", e:[
  {n:"Activité 5", t:"Prix initial et pourcentage d'évolution", w:"Sur ton cahier", h:`<p><b>Partie 1 : trouver le prix initial</b></p><p>Un article coûte 72,60 € après une réduction de 20 %. Quel était son prix avant cette réduction ?</p>${evo({l:["PI","?"], r:["PF","72,60 €"], k:"− 20 %", alt:"Prix initial inconnu, baisse de 20 %, prix final 72,60 €"})}
   <p><b>Partie 2 : déterminer un pourcentage d'évolution</b></p><p>Un objet coûte 45 €. Après une augmentation, son prix est de 61,20 €. Quel est le pourcentage d'augmentation du prix ?</p>${evo({l:["PI","45 €"], r:["PF","61,20 €"], k:"?", alt:"Prix initial 45 €, prix final 61,20 €"})}`,
   c:`<p><b>Partie 1 :</b> {100/100} − {20/100} = 0,8.</p><p class="calc">PI × 0,8 = 72,60<br>PI = 72,60 ÷ 0,8<br>PI = 90,75</p><p>Le prix avant la réduction était de <b>90,75 €</b>.</p>
   <p><b>Partie 2 :</b></p><p class="calc">45 × k = 61,20<br>k = 61,20 ÷ 45<br>k = 1,36</p><p>1,36 = {100/100} + {36/100} : le prix a augmenté de <b>36 %</b>.</p>`},
  {n:"Exercice 23", t:"Sept problèmes", w:"Sur ton cahier", h:`<p>Chaque problème est indépendant.</p>
   <p><b>Problème 1 :</b> après une remise de 12 %, un jeu coûte 66 €. Quel était son prix avant la remise ?</p>
   <p><b>Problème 2 :</b> en une année, la population d'une ville est passée de 6 200 à 6 510 habitants. Quel est le pourcentage d'augmentation du nombre d'habitants ?</p>
   <p><b>Problème 3 :</b> en une année, la consommation d'eau d'une famille est passée de 150 m<sup>3</sup> à 126 m<sup>3</sup>. Calcule le pourcentage de diminution de sa consommation.</p>
   <p><b>Problème 4 :</b> un objet coûte 70,20 € après une hausse de 30 %. Quel était son prix avant la hausse ?</p>
   <p><b>Problème 5 :</b> pendant les soldes, un manteau est passé de 64 € à 48 €. Quel a été le pourcentage de remise ?</p>
   <p><b>Problème 6 :</b> un objet coûte 249,90 € après une hausse de 2 %. Quel était son prix avant la hausse ?</p>
   <p><b>Problème 7 :</b> un abonnement à 60 € augmente de 8 %. Quel est son nouveau montant ?</p>`,
   c:`<p><b>1)</b></p><p class="calc">k = {100/100} − {12/100}<br>k = {88/100}<br>k = 0,88</p><p class="calc">P<sub>initial</sub> × 0,88 = 66<br>P<sub>initial</sub> = 66 ÷ 0,88<br>P<sub>initial</sub> = 75</p><p>Le jeu coûtait <b>75 €</b> avant la remise.</p>
   <p><b>2)</b></p><p class="calc">k = 6 510 ÷ 6 200<br>k = 1,05<br>k = {100/100} + {5/100}</p><p>Augmentation de <b>5 %</b>.</p>
   <p><b>3)</b></p><p class="calc">k = 126 ÷ 150<br>k = 0,84<br>k = {100/100} − {16/100}</p><p>Diminution de <b>16 %</b>.</p>
   <p><b>4)</b></p><p class="calc">k = {100/100} + {30/100}<br>k = {130/100}<br>k = 1,30</p><p class="calc">P<sub>initial</sub> × 1,30 = 70,20<br>P<sub>initial</sub> = 70,20 ÷ 1,30<br>P<sub>initial</sub> = 54</p><p>L'objet coûtait <b>54 €</b> avant la hausse.</p>
   <p><b>5)</b></p><p class="calc">k = 48 ÷ 64<br>k = 0,75<br>k = {100/100} − {25/100}</p><p>Remise de <b>25 %</b>.</p>
   <p><b>6)</b></p><p class="calc">k = {100/100} + {2/100}<br>k = {102/100}<br>k = 1,02</p><p class="calc">P<sub>initial</sub> × 1,02 = 249,90<br>P<sub>initial</sub> = 249,90 ÷ 1,02<br>P<sub>initial</sub> = 245</p><p>L'objet coûtait <b>245 €</b> avant la hausse.</p>
   <p><b>7)</b></p><p class="calc">k = {100/100} + {8/100}<br>k = {108/100}<br>k = 1,08</p><p class="calc">1,08 × 60 = 64,80</p><p>Le nouveau montant est de <b>64,80 €</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Prendre un pourcentage", schema:S_PRENDRE, q:{
 1:[ {g:()=>{ const t=pick([10,20,25,50,5]), q=ri(2,40)*10, r=t*q/100; return {q:`Combien représente ${P(t)} de ${N(q)} € ? (en €)`, rep:AL(r,"€"), ex:`<br>P = {${t}/100} × ${N(q)}<br>P = ${N(t/100)} × ${N(q)}<br>P = ${E(r)}`, sx:S_PRENDRE}; }} ],
 2:[ {g:()=>{ const t=pick([3,7,12,15,35,52,90]); return {q:`Prendre ${P(t)} d'une quantité revient à la multiplier par…`, c:uniq(N(t/100),[N(K(t)),N(K(-t)),String(t)]), rep:N(t/100), ex:`{${t}/100} = ${N(t/100)}.`, sx:S_PRENDRE}; }},
     {g:()=>{ const t=pick([12,15,35,45,52,90]), q=ri(11,99)/2, r=rd(t*q/100,4); return {q:`Calcule ${P(t)} de ${N(q)} kg (en kg).`, rep:AL(r,"kg"), ex:`${N(t/100)} × ${N(q)} = ${N(r)} kg.`, sx:S_PRENDRE}; }} ],
 3:[ {g:()=>{ const n=pick([20,30,40,50]); let a,b; do{ a=pick([10,20,25,30,40,50]); b=pick([5,10,15,20,25,30]); }while(a+b>=90 || (n*a)%100 || (n*b)%100); const c=100-a-b, r=n*c/100;
       return {q:`Les ${n} élèves d'une classe ont voté. Léa a obtenu ${P(a)} des voix, Margaux ${P(b)} et Nina le reste. Combien d'élèves ont voté pour Nina ?`, rep:String(r), ex:`Nina : 100 − ${a} − ${b} = ${c} %. ${N(c/100)} × ${n} = ${r} élèves.`, sx:S_PRENDRE}; }} ]
}},
{nom:"Le coefficient multiplicateur", schema:S_COEF, q:{
 1:[ {g:()=>{ const t=pick([5,8,12,15,20,24,27,36,40]), up=Math.random()<0.5, k=K(up?t:-t); return {q:`${up?"Augmenter":"Diminuer"} une valeur de ${P(t)} revient à la multiplier par…`, c:uniq(N(k),[N(K(up?-t:t)),N(t/100),N(1+t/10)]), rep:N(k), ex:"<br>"+kChain(up?t:-t), sx:S_COEF}; }} ],
 2:[ {g:()=>{ const t=pick([2.5,4,36,1.5,7.5,64,3]), up=Math.random()<0.5, k=K(up?t:-t); return {q:`${up?"Augmenter":"Diminuer"} une valeur de ${P(t)} revient à la multiplier par quel nombre ?`, rep:AL(k), ex:"<br>"+kChain(up?t:-t), sx:S_COEF}; }} ],
 3:[ {g:()=>{ const t=pick([8,12,15,25,35,45,65]), up=Math.random()<0.5, k=K(up?t:-t);
       const q=up?`Un prix a été multiplié par ${N(k)}. Il a…`:`Un prix a été multiplié par ${N(k)}. Il a…`;
       const good=up?`augmenté de ${P(t)}`:`baissé de ${P(t)}`;
       return {q, c:uniq(good,[up?`augmenté de ${P(rd(k*10,2))}`:`baissé de ${P(100-t)}`, up?`baissé de ${P(t)}`:`augmenté de ${P(t)}`, up?`augmenté de ${P(100+t)}`:`baissé de ${P(rd(k*10,2))}`]), rep:good, ex:`${N(k)} = {100/100} ${up?"+":"−"} {${t}/100}.`, sx:S_COEF}; }} ]
}},
{nom:"La valeur finale", schema:S_FINAL, q:{
 1:[ {g:()=>{ const t=pick([10,20,25,50]), p=ri(3,40)*4, f=p*(100+t)/100; return {q:`Un article à ${E(p)} augmente de ${P(t)}. Quel est son nouveau prix (en €) ?`, rep:AL(f,"€"), ex:`${N(K(t))} × ${N(p)} = ${E(f)}.`, sx:S_FINAL}; }} ],
 2:[ {g:()=>{ const t=pick([5,12,15,18,30,35,40]), p=priceInt(), f=rd(p*(100-t)/100,2); return {q:`Un article à ${E(p)} baisse de ${P(t)}. Quel est son nouveau prix (en €) ?`, rep:AL(f,"€"), ex:`{100/100} − {${t}/100} = ${N(K(-t))}.<br>P = ${N(K(-t))} × ${N(p)}<br>P = ${E(f)}`, sx:S_FINAL}; }} ],
 3:[ {g:()=>{ const t=pick([2.3,1.5,3.5,4.5,2.5]), p=ri(100000,180000)/100, f=p*K(t), r=rd(f,2); return {q:`Un salaire de ${E(p)} augmente de ${P(t)}. Quel est son nouveau montant, arrondi au centime (en €) ?`, rep:AL(r,"€"), ex:`<br>S = ${N(K(t))} × ${E0(p)}<br>S = ${N(rd(f,6),6)}<br>S ≈ ${E(r)}`, sx:S_FINAL}; }},
     {g:()=>{ const a=pick([30,40,50]), b=pick([15,20,25]), p=ri(30,90)*2, f=p*(100-b)/100; return {q:`Soldes : −${a} % sur les chaussures et −${b} % sur les vêtements. Un manteau coûtait ${E(p)}. Combien coûte-t-il pendant les soldes ?`, c:uniq(E(f),[E(p*(100-a)/100), E(p*(100-a-b)/100), E(p*b/100)]), rep:E(f), ex:`Un manteau est un vêtement : ${N(K(-b))} × ${N(p)} = ${E(f)}.`, sx:S_FINAL}; }} ]
}},
{nom:"La valeur initiale", schema:S_INIT, q:{
 1:[ {g:()=>{ const t=pick([10,20,25,50]), pi=ri(3,40)*4, f=pi*(100+t)/100; return {q:`Après une hausse de ${P(t)}, un objet coûte ${E(f)}. Quel était son prix avant la hausse (en €) ?`, rep:AL(pi,"€"), ex:`<br>P<sub>initial</sub> × ${N(K(t))} = ${E0(f)}<br>P<sub>initial</sub> = ${E0(f)} ÷ ${N(K(t))}<br>P<sub>initial</sub> = ${E(pi)}`, sx:S_INIT}; }} ],
 2:[ {g:()=>{ const t=pick([12,15,20,25,30,40]), pi=ri(4,60)*5, f=rd(pi*(100-t)/100,2); return {q:`Après une remise de ${P(t)}, un jeu coûte ${E(f)}. Quel était son prix avant la remise (en €) ?`, rep:AL(pi,"€"), ex:`<br>P<sub>initial</sub> × ${N(K(-t))} = ${E0(f)}<br>P<sub>initial</sub> = ${E0(f)} ÷ ${N(K(-t))}<br>P<sub>initial</sub> = ${E(pi)}`, sx:S_INIT}; }} ],
 3:[ {g:()=>{ const t=pick([2,4,5,8,30]), pi=ri(20,120)*5, f=rd(pi*(100+t)/100,2); return {q:`Un objet coûte ${E(f)} après une hausse de ${P(t)}. Quel calcul donne son prix avant la hausse ?`, c:uniq(`${E0(f)} ÷ ${N(K(t))}`,[`${E0(f)} × ${N(K(t))}`,`${E0(f)} × ${N(K(-t))}`,`${E0(f)} − ${N(t)}`]), rep:`${E0(f)} ÷ ${N(K(t))}`, ex:`P<sub>initial</sub> × ${N(K(t))} = ${E0(f)}, donc on divise :<br>P<sub>initial</sub> = ${E0(f)} ÷ ${N(K(t))}<br>P<sub>initial</sub> = ${E(pi)}`, sx:S_INIT}; }} ]
}},
{nom:"Le pourcentage d'évolution", schema:S_EVOL, q:{
 1:[ {g:()=>{ const a=ri(2,30)*100, t=pick([2,3,4,5,6,8,10,12,15,20]), up=Math.random()<0.5, b=a*(up?100+t:100-t)/100; return {q:`Une population est passée de ${N(a)} à ${N(b)} habitants. Quel est le coefficient multiplicateur k ?`, rep:AL(K(up?t:-t)), ex:`<br>k = ${N(b)} ÷ ${N(a)}<br>k = ${N(K(up?t:-t))}`, sx:S_EVOL}; }} ],
 2:[ {g:()=>{ const a=pick([40,50,60,64,80,120,150,200]), t=pick([5,10,15,16,20,25,30,40]), up=Math.random()<0.5, b=a*(up?100+t:100-t)/100;
       return {q:`Un prix est passé de ${E(a)} à ${E(b)}. Quel est le pourcentage ${up?"d'augmentation":"de diminution"} (en %) ?`, rep:[String(t), t+" %", t+"%"], ex:`<br>k = ${E0(b)} ÷ ${N(a)}<br>k = ${N(K(up?t:-t))}<br>k = {100/100} ${up?"+":"−"} {${t}/100}`, sx:S_EVOL}; }} ],
 3:[ {g:()=>{ const a=pick([150,200,250,300,400]), t=pick([4,6,8,12,14,16,22]), up=Math.random()<0.5, b=a*(up?100+t:100-t)/100; return {q:`Une consommation d'eau est passée de ${N(a)} m<sup>3</sup> à ${N(b)} m<sup>3</sup>. Elle a…`, c:uniq(up?`augmenté de ${P(t)}`:`diminué de ${P(t)}`,[up?`diminué de ${P(t)}`:`augmenté de ${P(t)}`, up?`augmenté de ${P(b-a)}`:`diminué de ${P(a-b)}`, up?`augmenté de ${P(100+t)}`:`diminué de ${P(100-t)}`]), rep:up?`augmenté de ${P(t)}`:`diminué de ${P(t)}`, ex:`<br>k = ${N(b)} ÷ ${N(a)}<br>k = ${N(K(up?t:-t))}<br>k = {100/100} ${up?"+":"−"} {${t}/100}`, sx:S_EVOL}; }} ]
}},
{nom:"Évolutions successives", schema:S_SUCC, q:{
 1:[ {g:()=>{ const t=pick([10,20,30,40,50]); return {q:`Vrai ou faux : augmenter un prix de ${P(t)} puis le diminuer de ${P(t)} ramène au prix de départ.`, c:VF, rep:"Faux", ex:`${N(K(t))} × ${N(K(-t))} = ${N(K(t)*K(-t))} : le prix a baissé de ${P(rd(t*t/100,4))}.`, sx:S_SUCC}; }} ],
 2:[ {g:()=>{ const L=[[10,30],[20,10],[-25,40],[-15,20],[30,-30],[-50,-40],[25,-20],[-20,25],[10,10],[-10,-10]], [a,b]=pick(L), k=rd(K(a)*K(b),6), tt=rd((k-1)*100,4);
       return {q:`Un prix ${evoTxt(a).replace("augmenté","augmente").replace("baissé","baisse")}, puis ce nouveau prix ${evoTxt(b).replace("augmenté","augmente").replace("baissé","baisse")}. Par quel nombre le prix initial a-t-il été multiplié ?`, rep:AL(k), ex:`${N(K(a))} × ${N(K(b))} = ${N(k)}.`, sx:S_SUCC}; }} ],
 3:[ {g:()=>{ const L=[[10,30],[20,10],[-25,40],[-15,20],[30,-30],[-50,-40],[25,-20],[-20,25],[20,-10],[-30,10]], [a,b]=pick(L), k=rd(K(a)*K(b),6), tt=rd((k-1)*100,4);
       const good=tt===0?"Le prix reste le même.":tt>0?`Le prix augmente de ${P(tt)}.`:`Le prix baisse de ${P(-tt)}.`;
       const s=a+b, bad=[s===0?"Le prix reste le même.":s>0?`Le prix augmente de ${P(s)}.`:`Le prix baisse de ${P(-s)}.`, tt>0?`Le prix baisse de ${P(tt)}.`:tt<0?`Le prix augmente de ${P(-tt)}.`:`Le prix augmente de ${P(Math.abs(a))}.`, `Le prix augmente de ${P(rd(k*100,2))}.`, "Le prix reste le même."];
       return {q:`Le prix d'un objet ${evoTxt(a).replace("augmenté","augmente").replace("baissé","baisse")}, puis ce nouveau prix ${evoTxt(b).replace("augmenté","augmente").replace("baissé","baisse")}.`, c:uniq(good,bad).slice(0,4), rep:good, ex:tt===0?`${N(K(a))} × ${N(K(b))} = ${N(k)} : le prix n'a pas évolué.`:`<br>k = ${N(K(a))} × ${N(K(b))}<br>k = ${N(k)}<br>k = {100/100} ${tt>0?"+":"−"} {${N(Math.abs(tt))}/100}`, sx:S_SUCC}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 6", duree:50, info:"Durée : 50 min · Calculatrice autorisée · Justifie chaque réponse par un calcul et une phrase, sauf si l'exercice dit le contraire.",
comp:[
  ["CONNAÎTRE","Je connais le lien entre un pourcentage d'évolution et le coefficient multiplicateur.","Ex. 1 (4 points)"],
  ["CALCULER","Je calcule le pourcentage d'une quantité et la valeur finale après une augmentation ou une diminution.","Ex. 2 (4 points)"],
  ["RAISONNER","Je retrouve une valeur initiale et un pourcentage d'évolution.","Ex. 3 et 4 (6 points)"],
  ["COMMUNIQUER","J'étudie des évolutions successives et je justifie si une affirmation est vraie ou fausse.","Ex. 5 et 6 (6 points)"]
],
exos:[
{t:"QCM : le coefficient multiplicateur", p:4, h:`<p>Pour chaque question, une seule réponse est exacte. Écris le numéro de la question et la lettre de la bonne réponse. Aucune justification n'est demandée.</p>
  ${tab(["Question","A","B","C"],[["<b>1)</b> Un prix a été multiplié par 1,08 ; il a augmenté de :","108 %","8 %","0,8 %"],["<b>2)</b> Un prix a été multiplié par 0,65 ; il a baissé de :","65 %","0,35 %","35 %"],["<b>3)</b> Un prix augmente de 45 % ; il est multiplié par :","0,45","1,45","0,55"],["<b>4)</b> Un prix baisse de 6 % ; il est multiplié par :","0,94","0,6","1,06"]])}`,
 c:`<p><b>1)</b> B : 1,08 = {100/100} + {8/100}. · <b>2)</b> C : 0,65 = {100/100} − {35/100}. · <b>3)</b> B : {100/100} + {45/100} = 1,45. · <b>4)</b> A : {100/100} − {6/100} = 0,94.</p><p><i>(1 point par bonne réponse)</i></p>`},
{t:"Calculer une valeur finale", p:4, h:`<p><b>1)</b> Calcule 35 % de 260 €.</p><p><b>2)</b> Un vélo à 240 € augmente de 15 %. Quel est son nouveau prix ?</p><p><b>3)</b> Pendant les soldes, un téléviseur à 589 € baisse de 30 %. Quel est son prix soldé ?</p>`,
 c:`<p><b>1)</b></p><p class="calc">P = {35/100} × 260<br>P = 0,35 × 260<br>P = <b>91 €</b></p><p><i>(1 point)</i></p><p><b>2)</b> {100/100} + {15/100} = 1,15 et 1,15 × 240 = <b>276 €</b>. <i>(1,5 point : 0,5 pour le coefficient, 1 pour le calcul)</i></p><p><b>3)</b> {100/100} − {30/100} = 0,70 et 0,70 × 589 = <b>412,30 €</b>. <i>(1,5 point : 0,5 pour le coefficient, 1 pour le calcul)</i></p>`},
{t:"Retrouver un prix initial", p:3, h:`<p><b>1)</b> Après une hausse de 4 %, un abonnement coûte 33,80 €. Quel était son prix avant la hausse ?</p><p><b>2)</b> Après une remise de 15 %, une veste coûte 59,50 €. Quel était son prix avant la remise ?</p>`,
 c:`<p><b>1)</b> Coefficient : {100/100} + {4/100} = 1,04.</p><p class="calc">P<sub>initial</sub> × 1,04 = 33,80<br>P<sub>initial</sub> = 33,80 ÷ 1,04<br>P<sub>initial</sub> = <b>32,50 €</b></p><p><i>(1,5 point)</i></p><p><b>2)</b> Coefficient : {100/100} − {15/100} = 0,85.</p><p class="calc">P<sub>initial</sub> × 0,85 = 59,50<br>P<sub>initial</sub> = 59,50 ÷ 0,85<br>P<sub>initial</sub> = <b>70 €</b></p><p><i>(1,5 point)</i></p>`},
{t:"Trouver un pourcentage d'évolution", p:3, h:`<p><b>1)</b> En un an, le nombre d'adhérents d'un club de judo est passé de 250 à 290. Quel est le pourcentage d'augmentation ?</p><p><b>2)</b> Une facture d'électricité est passée de 85 € à 74,80 €. Quel est le pourcentage de diminution ?</p>`,
 c:`<p><b>1)</b></p><p class="calc">250 × k = 290<br>k = 290 ÷ 250<br>k = 1,16<br>k = {100/100} + {16/100}</p><p>Augmentation de <b>16 %</b>. <i>(1,5 point)</i></p><p><b>2)</b></p><p class="calc">85 × k = 74,80<br>k = 74,80 ÷ 85<br>k = 0,88<br>k = {100/100} − {12/100}</p><p>Diminution de <b>12 %</b>. <i>(1,5 point)</i></p>`},
{t:"Vrai ou faux ?", p:4, h:`<p>Pour chaque affirmation, dis si elle est vraie ou fausse. Justifie avec les coefficients multiplicateurs.</p><p><b>Affirmation 1 :</b> « Augmenter un prix de 20 % puis le baisser de 10 % revient à l'augmenter de 10 %. »</p><p><b>Affirmation 2 :</b> « Baisser un prix de 20 % puis l'augmenter de 25 % ramène au prix de départ. »</p>`,
 c:`<p><b>Affirmation 1 :</b></p><p class="calc">k = 1,20 × 0,90<br>k = 1,08<br>k = {100/100} + {8/100}</p><p>Le prix augmente de 8 %, pas de 10 % : <b>l'affirmation est fausse</b>. <i>(2 points)</i></p><p><b>Affirmation 2 :</b> 0,80 × 1,25 = 1. Le prix est multiplié par 1, il ne change pas : <b>l'affirmation est vraie</b>. <i>(2 points)</i></p>`},
{t:"La population d'une ville", p:2, h:`<p>En 2024, une ville comptait 12 500 habitants.</p><p>Sa population a augmenté de 2 % en 2025, puis encore de 2 % en 2026.</p><p><b>1)</b> Combien d'habitants la ville compte-t-elle en 2026 ?</p><p><b>2)</b> Léo affirme : « En deux ans, la population a augmenté de 4 %. » A-t-il raison ? Justifie.</p>`,
 c:`<p><b>1)</b></p><p class="calc">H = 12 500 × 1,02 × 1,02<br>H = 12 750 × 1,02<br>H = <b>13 005 habitants</b></p><p><i>(1 point)</i></p><p><b>2)</b></p><p class="calc">k = 1,02 × 1,02<br>k = 1,0404<br>k = {100/100} + {4,04/100}</p><p>La population a augmenté de 4,04 %. Léo <b>n'a pas tout à fait raison</b> (avec 4 %, on trouverait 13 000 habitants). <i>(1 point)</i></p>`}
]}
};
})();
