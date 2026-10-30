/* 5e — Chapitre 3 : Enchaînement d'opérations (« Prends la place de l'abaque ! »)
   Les calculs et leurs étapes sont produits par C5 (calcul exact) : aucun résultat n'est écrit à la main. */
(function(){
const C=window.C5, VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const V = e => C.txt(C.val(e));                       /* résultat écrit en français */
const L = (e,name) => C.html(e,name);                 /* étapes ligne par ligne */
const IN = e => C.inline(e);                          /* étapes sur une ligne */
/* grille de calculs nommés : [["A","35 + 26 + 8"], …] */
const grid = list => `<div class="calcs">${list.map(([n,e])=>`<span>${n} = ${e}</span>`).join("")}</div>`;
/* calculs nommés côte à côte : [["A","5 × 6 − 2"], …] */
const duo = list => `<div class="calcs">${list.map(([n,e])=>`<div>${L(e,n)}</div>`).join("")}</div>`;
const gridC = list => `<div class="calcs">${list.map(([n,e,special])=>`<div>${special||L(e,n)}</div>`).join("")}</div>`;
const prog = (titre, steps) => `<div class="pgc">${titre?`<b>${titre}</b>`:""}<ul>${steps.map(s=>`<li>${s}</li>`).join("")}</ul></div>`;
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* ============ programmes de calcul : expression construite étape par étape ============ */
/* steps = [["+",5],["×",3]] ; renvoie l'expression avec les parenthèses nécessaires */
function progExpr(x, steps){
  let e=String(x), top=null;
  steps.forEach(([op,k])=>{
    const ks=C.txt(C.parse(String(k))[0].v);
    if((op==="×"||op==="÷") && top==="add") e = e.includes("(") ? `[${e}]` : `(${e})`;
    e=`${e} ${op} ${ks}`; top = (op==="+"||op==="−") ? "add" : "mul";
  });
  return e;
}
const VERB={"+":"Ajouter","−":"Soustraire","×":"Multiplier par","÷":"Diviser par"};
const progBox = (steps, titre="Programme de calcul") => prog(titre, ["Choisir un nombre", ...steps.map(([op,k])=>`${VERB[op]} ${String(k).replace(".",",")}`)]);

/* ============ schémas (rappel en image) — exemples différents des questions ============ */
const S_PRIO = sch("L'ordre des calculs", `<div class="prioOrder"><div><b>1</b>les parenthèses ( ) et crochets [ ]</div><div><b>2</b>× et ÷</div><div><b>3</b>+ et −</div></div>${L("12 + 4 × (6 − 1)","A")}`);
const S_GD = sch("Même niveau de priorité : de gauche à droite", L("40 − 10 + 5","A")+`<p class="schN">On ne commence pas par 10 + 5 : on lit de gauche à droite, comme une phrase.</p>`+L("36 ÷ 6 × 2","B"));
const S_CRO = sch("Des parenthèses dans des crochets", L("[3 × (2 + 4) − 8] × 5","A")+`<p class="schN">On commence par les parenthèses les plus à l'intérieur, puis les crochets.</p>`);
const S_AST = sch("Regrouper pour faire 10, 100…", `<p class="calc">A = 25 × 13 × 4<br>A = 25 × 4 × 13<br>A = 100 × 13<br>A = ${V("25 × 13 × 4")}</p><p class="schN">Quand il n'y a que des × (ou que des +), on peut changer l'ordre.</p>`);
const S_PAR = sch("Les parenthèses changent le résultat", `<div class="schRow"><div class="cmp"><b>Sans parenthèses</b>${L("2 + 3 × 4","A")}</div><div class="cmp"><b>Avec parenthèses</b>${L("(2 + 3) × 4","B")}</div></div>`);
const S_PB = sch("Une seule expression pour tout le problème", `<p class="schN">« J'ai 20 €. J'achète 3 cahiers à 2 €. Combien me reste-t-il ? »</p>${L("20 − 3 × 2","A")}<p class="schN">Il me reste ${V("20 − 3 × 2")} €. Le prix des 3 cahiers (3 × 2) se calcule en premier, grâce aux priorités.</p>`);
const S_PROG = sch("Chaque étape s'applique au résultat précédent", `<div class="schRow">${progBox([["+",2],["×",5]])}<div><p class="schN">Avec 3 : on ajoute 2, <b>puis</b> on multiplie le résultat par 5.</p>${L("(3 + 2) × 5","A")}</div></div><p class="schN">Les parenthèses obligent à faire l'addition avant la multiplication.</p>`);
const S_FR = sch("Une division s'écrit aussi avec une fraction", `<p class="calc">9 ÷ 4 = {9/4}<br>(10 + 2) ÷ 3 = {10 + 2/3}</p><p class="calc">A = {10 + 2/3}<br>A = {12/3}<br>A = 12 ÷ 3<br>A = ${V("(10 + 2) ÷ 3")}</p><p class="schN">Le trait de fraction remplace les parenthèses : on calcule d'abord le numérateur et le dénominateur.</p>`);

/* ============ générateurs d'expressions sans résultat négatif ============ */
const tryE = (f, ok=()=>true) => { for(let g=0; g<400; g++){ const e=f(); try{ const v=C.val(e); if(v.n>=0 && C.decimal(v) && ok(v)) return e; }catch(err){} } return null; };

CH["5e-3"] = {
intro:"Les priorités opératoires, les calculs astucieux, écrire une expression pour résoudre un problème ou un programme de calcul, et écrire une division sous la forme d'une fraction.",
savoir:[
  "effectuer un enchaînement d'opérations en respectant les priorités opératoires, et écrire toutes les étapes ;",
  "calculer astucieusement quand il n'y a que des additions ou que des multiplications ;",
  "écrire une seule expression qui permet de résoudre un problème ou un programme de calcul, puis l'effectuer et conclure par une phrase ;",
  "écrire une division sous la forme d'une fraction."
],
cours:[
{t:"Calculer un enchaînement d'opérations avec les priorités opératoires", h:`
  <p>Pour que l'on trouve le même résultat pour un même calcul, Descartes, mathématicien français du XVII<sup>e</sup> siècle, et certains de ses successeurs ont établi des règles communes sur l'ordre des calculs à effectuer. On appelle ces règles : <b>les priorités opératoires</b>.</p>
  <div class="retenir" data-l="Propriété"><p>Dans un enchaînement de calculs, voici les priorités opératoires :</p><ol><li>les calculs entre parenthèses,</li><li>les multiplications et les divisions,</li><li>et enfin les additions et soustractions.</li></ol></div>
  <p><b>Rédaction :</b> on donne un nom à l'expression (A, B, C…). On écrit une seule étape par ligne. Chaque ligne commence par le nom : « A = ».</p>
  <p><b>Exemples :</b></p>
  ${duo([["A","7 + 3 × 5"],["B","(7 + 3) × 5"],["C","20 − 2 × (4 + 3)"]])}
  <div class="retenir" data-l="À retenir"><p>Lorsque les opérations ont <b>le même niveau de priorité</b>, on effectue les calculs <b>de gauche à droite</b>.</p></div>
  <p><b>Exemples :</b> Calcule.</p>
  ${duo([["D","20 − 8 + 3"],["E","48 ÷ 4 × 2"]])}
  <p>Attention : D n'est pas égal à 20 − 11, et E n'est pas égal à 48 ÷ 8.</p>
  <div class="retenir" data-l="Cas particuliers"><p>Lorsqu'une expression <b>ne contient que des additions ou que des multiplications</b>, on peut effectuer les calculs <b>dans l'ordre que l'on veut</b>. Dans ce cas, on peut calculer astucieusement.</p></div>
  <p><b>Exemples :</b> Calcule astucieusement.</p>
  <div class="calcs"><div><p class="calc">F = 25 × 7 × 4<br>F = 25 × 4 × 7<br>F = 100 × 7<br>F = 700</p></div><div><p class="calc">G = 17 + 46 + 3<br>G = 17 + 3 + 46<br>G = 20 + 46<br>G = 66</p></div><div><p class="calc">H = 2,5 × 3,7 × 4<br>H = 2,5 × 4 × 3,7<br>H = 10 × 3,7<br>H = 37</p></div></div>
  <p><b>Remarque :</b> quand il y a des parenthèses à l'intérieur d'autres parenthèses, on utilise des crochets [ ]. On commence par les parenthèses les plus à l'intérieur.</p>
  ${L("[2 × (3 + 4) − 4] × 5","K")}`},
{t:"Traduire une division sous la forme d'une fraction", h:`
  <p>Les écritures suivantes sont égales :</p>
  <div class="scroll"><table class="std"><tbody><tr><td>7 ÷ 4</td><td>{7/4}</td></tr><tr><td>(15 + 3) ÷ 6</td><td>{15 + 3/6}</td></tr></tbody></table></div>
  <div class="retenir" data-l="À retenir"><p>Une division peut s'écrire sous la forme d'une fraction : 7 ÷ 4 = {7/4}.</p><p>Le trait de fraction remplace les parenthèses : on calcule d'abord le numérateur et le dénominateur, puis on divise.</p></div>
  <p><b>Exemple :</b></p>
  <p class="calc">A = {15 + 3/6}<br>A = {18/6}<br>A = 18 ÷ 6<br>A = ${V("(15 + 3) ÷ 6")}</p>`},
{t:"Résoudre des problèmes", h:`
  <p>a) Dans chaque cas, on écrit <b>une seule expression</b> qui permet de résoudre le problème.</p>
  <div class="scroll"><table class="std"><thead><tr><th>Problème</th><th>Expression numérique qui permet de résoudre le problème</th></tr></thead><tbody>
   <tr><td><b>Problème 1 :</b> Sur son compte, Guillaume avait 1 200 €. Trois prélèvements de 50 € ont été effectués ce mois-ci. Combien d'argent reste-t-il sur le compte de Guillaume ?</td><td>${L("1 200 − 3 × 50","A")}<p>Il reste ${V("1 200 − 3 × 50")} € sur le compte.</p></td></tr>
   <tr><td><b>Problème 2 :</b> J'ai acheté 2 jupes à 17 € chacune et 3 hauts à 12 € chacun. Quel est le total de mes dépenses ?</td><td>${L("2 × 17 + 3 × 12","B")}<p>Le total est de ${V("2 × 17 + 3 × 12")} €.</p></td></tr>
   <tr><td><b>Problème 3 :</b> J'ai 50 €. J'achète trois livres à 8 € l'un et deux CD à 10 € l'un. Quel argent me reste-t-il ?</td><td>${L("50 − (3 × 8 + 2 × 10)","C")}<p>Il me reste ${V("50 − (3 × 8 + 2 × 10)")} €.</p></td></tr>
   <tr><td><b>Problème 4 :</b> Je choisis le nombre 4 et j'applique ce programme de calcul. Quel est le résultat ?${progBox([["+",5],["×",3]],"")}</td><td>${L("(4 + 5) × 3","D")}<p>Le résultat est ${V("(4 + 5) × 3")}.</p></td></tr>
   <tr><td><b>Problème 5 :</b> Je choisis le nombre 4 et j'applique ce programme de calcul. Quel est le résultat ?${progBox([["×",3],["−",5],["×",6]],"")}</td><td>${L("(4 × 3 − 5) × 6","E")}<p>Le résultat est ${V("(4 × 3 − 5) × 6")}.</p></td></tr>
   <tr><td><b>Problème 6 :</b> Je choisis le nombre 4 et j'applique ce programme de calcul. Quel est le résultat ?${progBox([["×",2],["+",13],["−",17]],"")}</td><td>${L("4 × 2 + 13 − 17","F")}<p>Le résultat est ${V("4 × 2 + 13 − 17")}.</p></td></tr>
  </tbody></table></div>
  <div class="retenir" data-l="À retenir"><p>Dans un programme de calcul, chaque étape s'applique <b>au résultat de l'étape précédente</b>. Si on doit multiplier (ou diviser) le résultat d'une addition ou d'une soustraction, on met cette addition ou cette soustraction <b>entre parenthèses</b>.</p></div>
  <p>b) Rédaction de la résolution du problème 3 :</p>
  ${L("50 − (3 × 8 + 2 × 10)","C")}
  <p>Il me reste ${V("50 − (3 × 8 + 2 × 10)")} €.</p>
  <div class="retenir" data-l="Méthode"><p>Pour résoudre un problème : j'écris <b>une seule expression</b> et je lui donne un nom (A, B…). Je l'effectue en écrivant <b>toutes les étapes</b>, une par ligne, en recommençant par « A = ». Puis je <b>conclus par une phrase</b>.</p></div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Enchaînements d'opérations", e:[
  {n:"Exercice 0", t:"Enchaînement d'additions et de soustractions", w:"Sur ton cahier", h:`<p>Recopie les calculs sur ton cahier et effectue-les en détaillant tes étapes de calculs.</p>
   ${grid([["A","35 + 26 + 8"],["B","25 − 17 + 2"],["C","12 − 8 − 3"],["D","18 + 47 + 32"],["E","27 − 5 + 12"],["F","36 + 27 + 33"],["G","25 + 11 − 9"],["H","37 − 12 − 6"],["I","1,8 + 4,7 + 3,2"],["J","2,84 + 3,25 + 1,75"]])}`,
   c:`<p>Quand il n'y a que des additions et des soustractions, on calcule de gauche à droite. Quand il n'y a que des additions, on peut regrouper astucieusement.</p>
   ${gridC([["A","35 + 26 + 8"],["B","25 − 17 + 2"],["C","12 − 8 − 3"],["D",0,`<p class="calc">D = 18 + 47 + 32<br>D = 18 + 32 + 47<br>D = 50 + 47<br>D = ${V("18 + 47 + 32")}</p>`],["E","27 − 5 + 12"],["F",0,`<p class="calc">F = 36 + 27 + 33<br>F = 27 + 33 + 36<br>F = 60 + 36<br>F = ${V("36 + 27 + 33")}</p>`],["G","25 + 11 − 9"],["H","37 − 12 − 6"],["I",0,`<p class="calc">I = 1,8 + 4,7 + 3,2<br>I = 1,8 + 3,2 + 4,7<br>I = 5 + 4,7<br>I = ${V("1,8 + 4,7 + 3,2")}</p>`],["J",0,`<p class="calc">J = 2,84 + 3,25 + 1,75<br>J = 2,84 + 5<br>J = ${V("2,84 + 3,25 + 1,75")}</p>`]])}`},
  {n:"Exercice 1", t:"Calculer un enchaînement d'opérations", w:"Sur ton cahier", h:`<p>Effectue les calculs suivants en détaillant toutes tes étapes de calculs.</p>
   ${grid([["A","(4 + 5) × 6"],["B","4 + 5 × 6"],["C","1,8 + 4,7 + 3,2"],["D","12 − 8 − 3"],["E","563,7 × 25 × 4"],["F","80 ÷ 8 ÷ 2"],["G","(19 − 7 × 2) + 4"],["H","40 − 6 × 4 + 3"],["I","27 ÷ 3 + 4 × 9"],["J","45 ÷ 9 × (6 − 2)"],["K","(23 + 7) ÷ (3 × 5)"],["L","2,84 + 3,25 + 1,75"],["M","7 + 14 − 3 × 4"],["N","[(5 − 2) × 7 + 3] × 2"],["P","[30 − (5 + 4) × 2] − 10"]])}`,
   c:gridC([["A","(4 + 5) × 6"],["B","4 + 5 × 6"],["C",0,`<p class="calc">C = 1,8 + 4,7 + 3,2<br>C = 1,8 + 3,2 + 4,7<br>C = 5 + 4,7<br>C = ${V("1,8 + 4,7 + 3,2")}</p>`],["D","12 − 8 − 3"],["E",0,`<p class="calc">E = 563,7 × 25 × 4<br>E = 563,7 × 100<br>E = ${V("563,7 × 25 × 4")}</p>`],["F","80 ÷ 8 ÷ 2"],["G","(19 − 7 × 2) + 4"],["H","40 − 6 × 4 + 3"],["I","27 ÷ 3 + 4 × 9"],["J","45 ÷ 9 × (6 − 2)"],["K","(23 + 7) ÷ (3 × 5)"],["L",0,`<p class="calc">L = 2,84 + 3,25 + 1,75<br>L = 2,84 + 5<br>L = ${V("2,84 + 3,25 + 1,75")}</p>`],["M","7 + 14 − 3 × 4"],["N","[(5 − 2) × 7 + 3] × 2"],["P","[30 − (5 + 4) × 2] − 10"]])}
 ]},
{t:"Utilisation des parenthèses", e:[
  {n:"Exercice 3", t:"Utilisation des parenthèses dans un calcul", w:"Sur ton cahier", h:`<p><b>Partie 1 :</b> pour chaque question, une égalité est vraie et l'autre est fausse. Recopie l'égalité vraie, puis recopie l'égalité fausse en ajoutant des parenthèses pour qu'elle devienne vraie.</p>
   <p>a) 5 × 6 − 2 = 20 &nbsp;et&nbsp; 5 × 6 − 2 = 28<br>b) 2 + 6 × 3 = 20 &nbsp;et&nbsp; 2 + 6 × 3 = 24<br>c) 7 + 3 × 8 = 80 &nbsp;et&nbsp; 7 + 3 × 8 = 31<br>d) 23 − 3 + 7 = 27 &nbsp;et&nbsp; 23 − 3 + 7 = 13<br>e) 50 ÷ 10 ÷ 2 = 2,5 &nbsp;et&nbsp; 50 ÷ 10 ÷ 2 = 10</p>
   <p><b>Partie 2 :</b> même consigne. Cette fois, il y a une égalité vraie et 3 fausses.</p>
   <p>3 × 12 − 5 × 2 = 26 &nbsp;et&nbsp; 3 × 12 − 5 × 2 = 42 &nbsp;et&nbsp; 3 × 12 − 5 × 2 = 62 &nbsp;et&nbsp; 3 × 12 − 5 × 2 = 6</p>`,
   c:`<p><b>Partie 1</b></p>
   <p>a) Vraie : 5 × 6 − 2 = ${V("5 × 6 − 2")}. Avec des parenthèses : 5 × (6 − 2) = ${V("5 × (6 − 2)")}.</p>${duo([["A","5 × 6 − 2"],["B","5 × (6 − 2)"]])}
   <p>b) Vraie : 2 + 6 × 3 = ${V("2 + 6 × 3")}. Avec des parenthèses : (2 + 6) × 3 = ${V("(2 + 6) × 3")}.</p>${duo([["C","2 + 6 × 3"],["D","(2 + 6) × 3"]])}
   <p>c) Vraie : 7 + 3 × 8 = ${V("7 + 3 × 8")}. Avec des parenthèses : (7 + 3) × 8 = ${V("(7 + 3) × 8")}.</p>${duo([["E","7 + 3 × 8"],["F","(7 + 3) × 8"]])}
   <p>d) Vraie : 23 − 3 + 7 = ${V("23 − 3 + 7")} (de gauche à droite). Avec des parenthèses : 23 − (3 + 7) = ${V("23 − (3 + 7)")}.</p>${duo([["G","23 − 3 + 7"],["H","23 − (3 + 7)"]])}
   <p>e) Vraie : 50 ÷ 10 ÷ 2 = ${V("50 ÷ 10 ÷ 2")} (de gauche à droite). Avec des parenthèses : 50 ÷ (10 ÷ 2) = ${V("50 ÷ (10 ÷ 2)")}.</p>${duo([["I","50 ÷ 10 ÷ 2"],["J","50 ÷ (10 ÷ 2)"]])}
   <p><b>Partie 2</b></p>
   <p>Vraie : 3 × 12 − 5 × 2 = ${V("3 × 12 − 5 × 2")}.</p>${duo([["K","3 × 12 − 5 × 2"]])}
   <p>Avec des parenthèses :</p>${duo([["L","3 × (12 − 5) × 2"],["M","(3 × 12 − 5) × 2"],["N","3 × (12 − 5 × 2)"]])}`}
 ]},
{t:"Résoudre un problème avec une seule expression", note:`<b>Consigne pour chaque problème :</b> écris une expression qui donne la solution du problème et nomme-la A. Effectue le calcul en détaillant les étapes (chaque ligne commence par « A = »), puis conclus par une phrase.`, e:[
  {n:"Exercice 2", t:"Résoudre un problème", w:"Sur ton cahier", h:`<p>J'ai 50 €. J'achète trois livres à 8 € l'un et deux CD à 10 € l'un. Quel argent me reste-t-il ? Rédige ta réponse.</p>`,
   c:`${L("50 − (3 × 8 + 2 × 10)","A")}<p>Il me reste ${V("50 − (3 × 8 + 2 × 10)")} €.</p><p><i>On peut aussi écrire A = 50 − 3 × 8 − 2 × 10, qui donne le même résultat.</i></p>`},
  {n:"Exercice 4", t:"À la papeterie", w:"Sur ton cahier", h:`<p>Anna achète une règle à 0,80 € et deux stylos à 1,50 € l'un. Combien paie-t-elle ?</p>`,
   c:`${C.html("0,80 + 2 × 1,50","A",true)}<p>Anna paie ${C.txt(C.val("0,80 + 2 × 1,50"),true)} €.</p>`},
  {n:"Exercice 5", t:"Poids du camion après livraison", w:"Sur ton cahier", h:`<p>Un camion pèse 2 800 kg. On décharge ce camion de quatre caisses de 100 kg. Combien pèse maintenant le camion ?</p>`,
   c:`${L("2 800 − 4 × 100","A")}<p>Le camion pèse maintenant ${V("2 800 − 4 × 100")} kg.</p>`},
  {n:"Exercice 6", t:"Argent rendu", w:"Sur ton cahier", h:`<p>Pour Noël, Raphaël veut offrir un cadeau à son frère et à sa sœur. Il a économisé 30 €. Il choisit une peluche à 12 € pour sa sœur et un livre à 5 € pour son frère. Combien d'argent lui reste-t-il après ses achats ?</p>`,
   c:`${L("30 − (12 + 5)","A")}<p>Il reste ${V("30 − (12 + 5)")} € à Raphaël.</p><p><i>On peut aussi écrire A = 30 − 12 − 5 : de gauche à droite, on trouve aussi ${V("30 − 12 − 5")}.</i></p>`},
  {n:"Exercice 7", t:"À la pâtisserie", w:"Sur ton cahier", h:`<p>Dans une pâtisserie, Léo achète quatre éclairs à 2 € l'un et un sachet de bonbons à 3 €. Léo donne un billet de 20 € à la caissière. Combien va-t-elle lui rendre ?</p>`,
   c:`${L("20 − (4 × 2 + 3)","A")}<p>La caissière va lui rendre ${V("20 − (4 × 2 + 3)")} €.</p>`}
 ]},
{t:"Programmes de calcul", e:[
  {n:"Activité 2", t:"Écrire la bonne expression", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> Hugo choisit le nombre 3 et applique ce programme de calcul. Quel résultat obtient-il ?</p>${progBox([["×",5],["−",8]])}
   <p><b>Problème 2 :</b> Léa choisit le nombre 4 et applique ce programme de calcul. Quel résultat obtient-elle ?</p>${progBox([["+",3],["×",5]])}
   <p><b>Problème 3 :</b> Maud choisit le nombre 2 et applique ce programme de calcul. Quel résultat obtient-elle ?</p>${progBox([["×",5],["+",2],["×",3]])}
   <p>Pour chaque problème :</p><p>a) Calcule mentalement le résultat. b) Écris <b>un seul calcul</b> qui permet de trouver le résultat. Nomme-le A pour le problème 1, B pour le problème 2 et C pour le problème 3. c) Effectue ce calcul en détaillant tes étapes et conclus par une phrase.</p>`,
   c:`<p><b>Problème 1.</b> Le calcul :</p>${L("3 × 5 − 8","A")}<p>Hugo obtient ${V("3 × 5 − 8")}.</p>
   <p><b>Problème 2.</b> On ajoute 3 <b>puis</b> on multiplie le résultat : il faut des parenthèses. Le calcul :</p>${L("(4 + 3) × 5","B")}<p>Léa obtient ${V("(4 + 3) × 5")}.</p>
   <p><b>Problème 3.</b> Le calcul :</p>${L("(2 × 5 + 2) × 3","C")}<p>Maud obtient ${V("(2 × 5 + 2) × 3")}.</p>`},
  {n:"Exercice 8", t:"Quatre programmes de calcul", w:"Sur ton cahier", h:`<div class="progs">${progBox([["−",3],["×",8]],"Programme 1")}${progBox([["×",4],["+",8]],"Programme 2")}${progBox([["+",6],["×",2],["−",7]],"Programme 3")}${progBox([["×",3],["+",5],["×",4]],"Programme 4")}</div>
   <p>Pour chaque programme, on a choisi le nombre 5.</p><p>1. Écris une seule expression qui permet de trouver le résultat de chaque programme de calcul. Nomme-les A, B, C et D. 2. Effectue ensuite tes calculs.</p>`,
   c:`<div class="calcs"><div><p><b>Programme 1</b></p>${L("(5 − 3) × 8","A")}</div><div><p><b>Programme 2</b></p>${L("5 × 4 + 8","B")}</div><div><p><b>Programme 3</b></p>${L("(5 + 6) × 2 − 7","C")}</div><div><p><b>Programme 4</b></p>${L("(5 × 3 + 5) × 4","D")}</div></div>`},
  {n:"Exercice 9", t:"Quatre autres programmes", w:"Sur ton cahier", h:`<p>Dans chaque cas, écris l'expression numérique qui permet de résoudre le problème. Nomme-les A, B, C et D. Il n'est pas demandé d'effectuer les calculs, mais tu peux le faire au brouillon pour vérifier ton expression.</p>
   <p><b>Problème 1 :</b> je choisis le nombre 23 et j'applique ce programme de calcul. Quel est le résultat ?</p>${progBox([["−",3],["÷",5]])}
   <p><b>Problème 2 :</b> je choisis le nombre 3 et j'applique ce programme de calcul. Quel est le résultat ?</p>${progBox([["×",5],["+",2],["−",11]])}
   <p><b>Problème 3 :</b> je choisis le nombre 6 et j'applique ce programme de calcul. Quel est le résultat ?</p>${progBox([["×",5],["−",18],["÷",3]])}
   <p><b>Problème 4 :</b> je choisis le nombre 7 et j'applique ce programme de calcul. Quel est le résultat ?</p>${progBox([["+",4],["×",2],["+",9]])}`,
   c:`<p>La première ligne est l'expression demandée. Les lignes suivantes sont la vérification au brouillon.</p>
   <div class="calcs"><div><p><b>Problème 1</b></p>${L("(23 − 3) ÷ 5","A")}</div><div><p><b>Problème 2</b></p>${L("3 × 5 + 2 − 11","B")}</div><div><p><b>Problème 3</b></p>${L("(6 × 5 − 18) ÷ 3","C")}</div><div><p><b>Problème 4</b></p>${L("(7 + 4) × 2 + 9","D")}</div></div>`}
 ]},
{t:"Problèmes en plusieurs étapes", e:[
  {n:"Exercice 10", t:"Crédit pour l'achat d'une voiture", w:"Sur ton cahier", h:`<p>Paul est intéressé par l'achat d'une voiture à 16 000 €, mais il ne peut pas payer cette somme en une fois. Son garagiste lui propose la formule de crédit suivante : paiement de 5 000 € quand il va récupérer le véhicule, puis prélèvement de 250 € par mois pendant 48 mois.</p><p>Quelle somme d'argent Paul va-t-il payer en plus s'il achète cette voiture avec ce crédit ?</p>`,
   c:`<p>Avec le crédit, Paul paie 5 000 + 250 × 48. On enlève le prix de la voiture.</p>${L("5 000 + 250 × 48 − 16 000","A")}<p>Avec ce crédit, Paul va payer ${V("5 000 + 250 × 48 − 16 000")} € en plus.</p>`},
  {n:"Exercice 11", t:"Prix du casque audio", w:"Sur ton cahier", h:`<p>Perrine et Jules veulent offrir un casque audio à leur sœur. Ils ont économisé respectivement 23,40 € et 37,50 €. S'ils avaient eu 15,90 € de plus, ils auraient pu lui offrir en plus un DVD qui coûte 19,90 €.</p><p>Quel est le prix du casque audio ?</p>`,
   c:`<p>Avec 15,90 € de plus, ils auraient eu juste assez pour le casque <b>et</b> le DVD. Le prix du casque, c'est cette somme moins le prix du DVD.</p>${C.html("23,40 + 37,50 + 15,90 − 19,90","A",true)}<p>Le casque audio coûte ${C.txt(C.val("23,40 + 37,50 + 15,90 − 19,90"),true)} €.</p>`},
  {n:"Exercice 12", t:"Combien de bouquets de 5 roses ?", w:"Sur ton cahier", h:`<p>Un fleuriste dispose de 440 roses. Il décide d'en vendre 40 à l'unité, de faire 5 bouquets de 9 roses, 15 bouquets de 7 roses et des bouquets de 5 roses.</p><p>Combien de bouquets de 5 roses peut-il constituer ?</p>`,
   c:`<p>On enlève les roses vendues à l'unité et celles des autres bouquets, puis on partage le reste en bouquets de 5.</p>${L("(440 − 40 − 5 × 9 − 15 × 7) ÷ 5","A")}<p>Il peut constituer ${V("(440 − 40 − 5 × 9 − 15 × 7) ÷ 5")} bouquets de 5 roses.</p>`}
 ]}
],

/* ===================== QUIZ ===================== */
quiz:[
{nom:"Les priorités opératoires", schema:S_PRIO, q:{
 1:[ {q:"Dans 6 + 4 × 5, quelle opération fait-on en premier ?", c:["4 × 5","6 + 4"], rep:"4 × 5", ex:"La multiplication est prioritaire sur l'addition.", sx:L("6 + 4 × 5","A")},
     {q:"Dans (6 + 4) × 5, quelle opération fait-on en premier ?", c:["6 + 4","4 × 5"], rep:"6 + 4", ex:"On commence par les calculs entre parenthèses.", sx:L("(6 + 4) × 5","A")},
     {g:()=>{ const a=ri(2,20), b=ri(2,9), c=ri(2,9), e=`${a} + ${b} × ${c}`; return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }} ],
 2:[ {g:()=>{ const b=ri(2,9), c=ri(2,9), a=b*c+ri(1,30), e=`${a} − ${b} × ${c}`; return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }},
     {g:()=>{ const c=ri(2,9), k=ri(2,9), b=ri(2,9), e=`${c*k} ÷ ${c} + ${b} × ${ri(2,6)}`; return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }},
     {g:()=>{ const a=ri(2,9), b=ri(1,9), c=ri(2,9), e=`${a} × (${b} + ${c})`; return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }} ],
 3:[ {g:()=>{ const e=tryE(()=>`${ri(30,90)} − ${ri(2,6)} × (${ri(1,9)} + ${ri(1,9)})`); return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }},
     {g:()=>{ const e=tryE(()=>`${ri(2,9)} × ${ri(2,9)} − ${ri(10,40)} ÷ ${pick([2,5,10])} + ${ri(1,9)}`, v=>v.d===1); return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }},
     {q:"Calcule A = 1,5 + 2 × 3,5", rep:V("1,5 + 2 × 3,5"), sx:L("1,5 + 2 × 3,5","A")} ]
}},
{nom:"Même niveau : de gauche à droite", schema:S_GD, q:{
 1:[ {q:"Dans 20 − 6 + 4, quelle opération fait-on en premier ?", c:["20 − 6","6 + 4"], rep:"20 − 6", ex:"Même niveau de priorité : on calcule de gauche à droite.", sx:L("20 − 6 + 4","A")},
     {q:"Dans 24 ÷ 4 × 2, quelle opération fait-on en premier ?", c:["24 ÷ 4","4 × 2"], rep:"24 ÷ 4", ex:"× et ÷ ont le même niveau : de gauche à droite.", sx:L("24 ÷ 4 × 2","A")} ],
 2:[ {g:()=>{ const a=ri(32,60), b=ri(2,15), c=ri(2,15), e=`${a} − ${b} + ${c}`; return {q:`Calcule A = ${e}`, rep:V(e), c:uniq(V(e),[V(`${a} − (${b} + ${c})`)]), ex:"De gauche à droite : on commence par la soustraction.", sx:L(e,"A")}; }},
     {g:()=>{ const b=pick([2,3,4,5,6]), c=pick([2,3,4]), a=b*c*ri(2,6), e=`${a} ÷ ${b} × ${c}`; return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }} ],
 3:[ {g:()=>{ const b=pick([2,4,5]), c=pick([2,5]), a=b*c*ri(2,9), e=`${a} ÷ ${b} ÷ ${c}`; return {q:`Calcule A = ${e}`, rep:V(e), c:uniq(V(e),[V(`${a} ÷ (${b} ÷ ${c})`)].filter(x=>!/\{/.test(x))), sx:L(e,"A")}; }},
     {q:"Vrai ou faux : 50 − 20 − 10 = 40.", c:VF, rep:"Faux", ex:"De gauche à droite : 50 − 20 = 30, puis 30 − 10 = 20.", sx:L("50 − 20 − 10","A")},
     {q:"Calcule A = 30 − 5 + 4 × 2 − 10", rep:V("30 − 5 + 4 × 2 − 10"), sx:L("30 − 5 + 4 × 2 − 10","A")} ]
}},
{nom:"Parenthèses et crochets", schema:S_CRO, q:{
 1:[ {q:"Dans [(5 − 2) × 7 + 3] × 2, quel calcul fait-on en premier ?", c:["5 − 2","7 + 3","3 × 2"], rep:"5 − 2", ex:"On commence par les parenthèses les plus à l'intérieur.", sx:L("[(5 − 2) × 7 + 3] × 2","A")},
     {g:()=>{ const e=tryE(()=>`(${ri(10,30)} − ${ri(1,9)}) × ${ri(2,5)}`); return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }} ],
 2:[ {g:()=>{ const e=tryE(()=>`[${ri(2,6)} × (${ri(1,6)} + ${ri(1,6)}) + ${ri(1,9)}] × ${ri(2,4)}`); return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }},
     {g:()=>{ const x=ri(2,5), y=ri(2,5), k=ri(2,9), m=x*y*k, p=ri(1,m-1), e=`(${p} + ${m-p}) ÷ (${x} × ${y})`; return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }} ],
 3:[ {g:()=>{ const e=tryE(()=>`[${ri(30,60)} − (${ri(2,6)} + ${ri(2,6)}) × ${ri(2,4)}] − ${ri(1,9)}`); return {q:`Calcule A = ${e}`, rep:V(e), sx:L(e,"A")}; }},
     {q:"Calcule A = [(5 − 2) × 7 + 3] × 2", rep:V("[(5 − 2) × 7 + 3] × 2"), sx:L("[(5 − 2) × 7 + 3] × 2","A")} ]
}},
{nom:"Calculer astucieusement", schema:S_AST, q:{
 1:[ {q:"Pour calculer 25 × 9 × 4 astucieusement, on commence par :", c:["25 × 4","25 × 9","9 × 4"], rep:"25 × 4", ex:"25 × 4 = 100 : on peut changer l'ordre car il n'y a que des multiplications.", sx:`<p class="calc">A = 25 × 9 × 4<br>A = 25 × 4 × 9<br>A = 100 × 9<br>A = ${V("25 × 9 × 4")}</p>`},
     {q:"Vrai ou faux : dans 12 − 5 + 8, on peut changer l'ordre des calculs.", c:VF, rep:"Faux", ex:"Il y a une soustraction : on calcule de gauche à droite. On ne peut changer l'ordre que s'il n'y a QUE des additions ou QUE des multiplications.", sx:L("12 − 5 + 8","A")} ],
 2:[ {g:()=>{ const k=ri(11,99), p=pick([[25,4],[50,2],[20,5],[2,5],[4,25]]), e=`${p[0]} × ${k} × ${p[1]}`; return {q:`Calcule astucieusement A = ${e}`, rep:V(e), sx:`<p class="calc">A = ${e}<br>${e===`${p[0]} × ${p[1]} × ${k}`?"":`A = ${p[0]} × ${p[1]} × ${k}<br>`}A = ${C.txt(C.R(p[0]*p[1],1))} × ${k}<br>A = ${V(e)}</p>`}; }},
     {g:()=>{ const a=ri(11,49), b=ri(11,89), c=10*ri(2,9)-a; if(c<1) return {q:"Calcule astucieusement A = 17 + 46 + 3", rep:V("17 + 46 + 3"), sx:`<p class="calc">A = 17 + 46 + 3<br>A = 17 + 3 + 46<br>A = 20 + 46<br>A = ${V("17 + 46 + 3")}</p>`}; const e=`${a} + ${b} + ${c}`; return {q:`Calcule astucieusement A = ${e}`, rep:V(e), sx:`<p class="calc">A = ${e}<br>${b===c?"":`A = ${a} + ${c} + ${b}<br>`}A = ${a+c} + ${b}<br>A = ${V(e)}</p>`}; }} ],
 3:[ {g:()=>{ const x=pick(["563,7","48,3","12,6","7,25","0,84"]), e=`${x} × 25 × 4`; return {q:`Calcule astucieusement A = ${e}`, rep:V(e), sx:`<p class="calc">A = ${e}<br>A = ${x} × 100<br>A = ${V(e)}</p>`}; }},
     {g:()=>{ const a=pick(["1,8","2,3","4,6","3,7"]), b=C.txt(C.sub(C.R(pick([5,10]),1), C.parse(a)[0].v)), m=pick(["4,7","12,4","6,85"]), e=`${a} + ${m} + ${b}`; return {q:`Calcule astucieusement A = ${e}`, rep:V(e), sx:`<p class="calc">A = ${e}<br>A = ${a} + ${b} + ${m}<br>A = ${V(`${a} + ${b}`)} + ${m}<br>A = ${V(e)}</p>`}; }} ]
}},
{nom:"Placer des parenthèses", schema:S_PAR, q:{
 1:[ {q:"Quelle écriture est égale à 20 ?", c:["5 × (6 − 2)","5 × 6 − 2"], rep:"5 × (6 − 2)", ex:"5 × (6 − 2) = 20, alors que 5 × 6 − 2 = 28.", sx:duo([["A","5 × (6 − 2)"],["B","5 × 6 − 2"]])},
     {q:"Quelle écriture est égale à 24 ?", c:["(2 + 6) × 3","2 + 6 × 3"], rep:"(2 + 6) × 3", ex:"(2 + 6) × 3 = 24, alors que 2 + 6 × 3 = 20.", sx:duo([["A","(2 + 6) × 3"],["B","2 + 6 × 3"]])} ],
 2:[ {g:()=>{ const a=ri(2,9), b=ri(2,9), c=ri(2,9), good=`(${a} + ${b}) × ${c}`, bads=[`${a} + (${b} × ${c})`,`${a} + ${b} × ${c}`]; const v=V(good); return {q:`Où placer les parenthèses pour que ${a} + ${b} × ${c} = ${v} ?`, c:shuf(uniq(good,bads)), rep:good, sx:L(good,"A")}; }},
     {q:"Où placer les parenthèses pour que 23 − 3 + 7 = 13 ?", c:["23 − (3 + 7)","(23 − 3) + 7"], rep:"23 − (3 + 7)", sx:L("23 − (3 + 7)","A")} ],
 3:[ {q:"Où placer les parenthèses pour que 3 × 12 − 5 × 2 = 62 ?", c:["(3 × 12 − 5) × 2","3 × (12 − 5) × 2","3 × (12 − 5 × 2)"], rep:"(3 × 12 − 5) × 2", sx:L("(3 × 12 − 5) × 2","A")},
     {q:"Où placer les parenthèses pour que 3 × 12 − 5 × 2 = 6 ?", c:["3 × (12 − 5 × 2)","(3 × 12 − 5) × 2","3 × (12 − 5) × 2"], rep:"3 × (12 − 5 × 2)", sx:L("3 × (12 − 5 × 2)","A")},
     {q:"Où placer les parenthèses pour que 50 ÷ 10 ÷ 2 = 10 ?", c:["50 ÷ (10 ÷ 2)","(50 ÷ 10) ÷ 2"], rep:"50 ÷ (10 ÷ 2)", sx:L("50 ÷ (10 ÷ 2)","A")} ]
}},
{nom:"Écrire une expression pour résoudre un problème", schema:S_PB, q:{
 1:[ {g:()=>{ const s=ri(3,9)*100, n=ri(2,5), p=pick([20,25,30,50]), good=`${s} − ${n} × ${p}`; return {q:`Sur son compte, Léna a ${s} €. ${n} prélèvements de ${p} € ont été effectués. Quelle expression donne ce qui reste sur son compte ?`, c:shuf(uniq(good,[`(${s} − ${n}) × ${p}`,`${s} − ${n} + ${p}`])), rep:good, sx:L(good,"A")}; }},
     {g:()=>{ const a=ri(2,4), pa=ri(8,20), b=ri(2,4), pb=ri(5,15), good=`${a} × ${pa} + ${b} × ${pb}`; return {q:`J'achète ${a} pantalons à ${pa} € l'un et ${b} tee-shirts à ${pb} € l'un. Quelle expression donne le total ?`, c:shuf(uniq(good,[`${a} + ${pa} × ${b} + ${pb}`,`(${a} + ${b}) × ${pa}`])), rep:good, sx:L(good,"A")}; }} ],
 2:[ {g:()=>{ const n=ri(2,5), p=ri(2,6), b=ri(2,6), s=[20,30,50].find(x=>x>n*p+b); const good=`${s} − (${n} × ${p} + ${b})`, e=good; return {q:`Léo achète ${n} éclairs à ${p} € l'un et un sachet de bonbons à ${b} €. Il paie avec un billet de ${s} €. Combien lui rend-on (en €) ?`, rep:V(e), ex:`Expression : A = ${good}.`, sx:L(e,"A")}; }},
     {g:()=>{ const r=pick(["0,80","1,20","0,60"]), n=ri(2,4), s=pick(["1,50","2,50","0,90"]), e=`${r} + ${n} × ${s}`; return {q:`Anna achète une règle à ${r} € et ${n} stylos à ${s} € l'un. Combien paie-t-elle (en €) ?`, rep:V(e), ex:`Expression : A = ${e}.`, sx:L(e,"A")}; }} ],
 3:[ {g:()=>{ const t=pick([440,380,520]), v=ri(2,4)*10, a=ri(3,6), ta=pick([7,9]), b=ri(5,12), tb=pick([3,6]); const e=tryE(()=>`(${t} − ${v} − ${a} × ${ta} − ${b} × ${tb}) ÷ 5`, x=>x.d===1)||"(440 − 40 − 5 × 9 − 15 × 7) ÷ 5"; const m=e.match(/^\((\d+) − (\d+) − (\d+) × (\d+) − (\d+) × (\d+)\) ÷ 5$/);
       return {q:`Un fleuriste a ${m[1]} roses. Il en vend ${m[2]} à l'unité, fait ${m[3]} bouquets de ${m[4]} roses, ${m[5]} bouquets de ${m[6]} roses, et des bouquets de 5 roses avec le reste. Combien de bouquets de 5 roses fait-il ?`, rep:V(e), ex:`Expression : A = ${e}.`, sx:L(e,"A")}; }},
     {q:"Paul paie 5 000 € puis 250 € par mois pendant 48 mois, pour une voiture à 16 000 €. Combien paie-t-il en plus (en €) ?", rep:V("5 000 + 250 × 48 − 16 000"), ex:"Expression : A = 5 000 + 250 × 48 − 16 000.", sx:L("5 000 + 250 × 48 − 16 000","A")} ]
}},
{nom:"Programmes de calcul", schema:S_PROG, q:{
 1:[ {g:()=>{ const x=ri(2,9), a=ri(2,9), k=ri(2,6); const good=progExpr(x,[["+",a],["×",k]]); return {q:`${progBox([["+",a],["×",k]])}Avec le nombre ${x}, quelle expression donne le résultat ?`, c:shuf(uniq(good,[`${x} + ${a} × ${k}`,`${x} × ${k} + ${a}`])), rep:good, sx:L(good,"A")}; }},
     {g:()=>{ const x=ri(2,9), k=ri(2,6), a=ri(1,9); const e=progExpr(x,[["×",k],["+",a]]); return {q:`${progBox([["×",k],["+",a]])}Je choisis ${x}. Quel résultat j'obtiens ?`, rep:V(e), ex:`Expression : A = ${e}.`, sx:L(e,"A")}; }} ],
 2:[ {g:()=>{ const s=[["−",ri(1,3)],["×",ri(2,8)]], x=ri(4,9), e=progExpr(x,s); return {q:`${progBox(s)}Je choisis ${x}. Quel résultat j'obtiens ?`, rep:V(e), ex:`Expression : A = ${e}.`, sx:L(e,"A")}; }},
     {g:()=>{ const x=ri(2,9), a=ri(2,9), m=ri(2,5), s=[["+",a],["×",m],["−",ri(1,Math.min(9,(x+a)*m-1))]], e=progExpr(x,s); return {q:`${progBox(s)}Je choisis ${x}. Quel résultat j'obtiens ?`, rep:V(e), ex:`Expression : A = ${e}.`, sx:L(e,"A")}; }} ],
 3:[ {g:()=>{ const d=pick([3,4,5]), s=[["−",ri(1,9)],["÷",d]]; let x; do{ x=ri(10,60); }while((x-s[0][1])%d||x-s[0][1]<=0); const e=progExpr(x,s); return {q:`${progBox(s)}Je choisis ${x}. Quel résultat j'obtiens ?`, rep:V(e), ex:`Expression : A = ${e}. Il faut des parenthèses : on soustrait d'abord, puis on divise le résultat.`, sx:L(e,"A")}; }},
     {g:()=>{ const s=[["×",ri(2,5)],["+",ri(1,9)],["×",ri(2,4)]], x=ri(2,9), e=progExpr(x,s); return {q:`${progBox(s)}Je choisis ${x}. Quel résultat j'obtiens ?`, rep:V(e), ex:`Expression : A = ${e}.`, sx:L(e,"A")}; }} ]
}},
{nom:"Division et fraction", schema:S_FR, q:{
 1:[ {q:"Quelle fraction est égale à 7 ÷ 4 ?", c:["{7/4}","{4/7}","{7/11}"], rep:"{7/4}", ex:"a ÷ b = {a/b} : le nombre divisé est en haut."},
     {g:()=>{ const a=ri(2,15), b=ri(2,9); if(a===b) return {q:"Quelle fraction est égale à 3 ÷ 8 ?", c:["{3/8}","{8/3}"], rep:"{3/8}"}; return {q:`Quelle fraction est égale à ${a} ÷ ${b} ?`, c:shuf(uniq(`{${a}/${b}}`,[`{${b}/${a}}`,`{${a}/${a+b}}`])), rep:`{${a}/${b}}`}; }} ],
 2:[ {g:()=>{ const d=pick([2,3,4,5,6]), s=d*ri(2,9), a=ri(1,s-1); const e=`(${a} + ${s-a}) ÷ ${d}`; return {q:`Calcule A = {${a} + ${s-a}/${d}}`, rep:V(e), ex:`On calcule d'abord le numérateur : ${a} + ${s-a} = ${s}, puis ${s} ÷ ${d}.`, sx:`<p class="calc">A = {${a} + ${s-a}/${d}}<br>A = {${s}/${d}}<br>A = ${s} ÷ ${d}<br>A = ${V(e)}</p>`}; }},
     {q:"Quelle écriture est égale à {15 + 3/6} ?", c:["(15 + 3) ÷ 6","15 + 3 ÷ 6"], rep:"(15 + 3) ÷ 6", ex:"Le trait de fraction remplace les parenthèses."} ],
 3:[ {g:()=>{ const x=ri(2,5), y=ri(1,4), q=ri(2,9), n=(x+y)*q; return {q:`Calcule A = {${n}/${x} + ${y}}`, rep:String(q), ex:`On calcule d'abord le dénominateur : ${x} + ${y} = ${x+y}, puis ${n} ÷ ${x+y} = ${q}.`, sx:`<p class="calc">A = {${n}/${x} + ${y}}<br>A = {${n}/${x+y}}<br>A = ${n} ÷ ${x+y}<br>A = ${q}</p>`}; }},
     {q:"Vrai ou faux : {12 + 8/4} = 12 + 2.", c:VF, rep:"Faux", ex:"Le trait de fraction remplace les parenthèses : {12 + 8/4} = (12 + 8) ÷ 4. Le résultat est 5, et non 14.", sx:`<p class="calc">A = {12 + 8/4}<br>A = (12 + 8) ÷ 4<br>A = 20 ÷ 4<br>A = ${V("(12 + 8) ÷ 4")}</p>`} ]
}}
]
};
/* ---- Petite évaluation d'entraînement : chapitre 3 seulement ---- */
CH["5e-3"].eval = {
titre:"Évaluation d'entraînement — Chapitre 3", duree:25, info:"Durée : 25 min · Calculatrice non autorisée · Noté sur 10",
comp:[
  ["CALCULER","Je connais et j'utilise les priorités opératoires. Je calcule astucieusement.","Ex. 1, 2 et 3 (5,5 points)"],
  ["MODÉLISER","J'écris une seule expression pour regrouper des calculs ou pour résoudre un problème.","Ex. 4 et 5 (4,5 points)"]
],
exos:[
{t:"Calcul mental", p:2, h:`<p>Pour chaque calcul, écris seulement le résultat.</p><div class="calcs"><span>A = 8 + 2 × 6</span><span>B = 40 − 10 × 3</span><span>C = {30 + 6/4}</span><span>D = 50 ÷ 5 × 2</span></div>`,
 c:`<p>A = ${V("8 + 2 × 6")} ; B = ${V("40 − 10 × 3")} ; C = ${V("(30 + 6) ÷ 4")} ; D = ${V("50 ÷ 5 × 2")}. <i>0,5 point par calcul.</i></p><p>Les étapes :</p>
 <div class="calcs"><div>${L("8 + 2 × 6","A")}</div><div>${L("40 − 10 × 3","B")}</div><div><p class="calc">C = {30 + 6/4}<br>C = (30 + 6) ÷ 4<br>C = 36 ÷ 4<br>C = ${V("(30 + 6) ÷ 4")}</p></div><div>${L("50 ÷ 5 × 2","D")}</div></div>
 <p>Pour C : le trait de fraction regroupe le numérateur. Pour D : on calcule de gauche à droite.</p>`},
{t:"Calculer astucieusement", p:1.5, h:`<p>Calcule astucieusement, en écrivant l'étape qui rend le calcul facile.</p><div class="calcs"><span>A = 4 × 37 × 25</span><span>B = 6,8 + 4,5 + 3,2</span><span>C = 2 × 4,3 × 50</span></div>`,
 c:`<div class="calcs"><div><p class="calc">A = 4 × 37 × 25<br>A = 4 × 25 × 37<br>A = 100 × 37<br>A = ${V("4 × 37 × 25")}</p></div><div><p class="calc">B = 6,8 + 4,5 + 3,2<br>B = 6,8 + 3,2 + 4,5<br>B = 10 + 4,5<br>B = ${V("6,8 + 4,5 + 3,2")}</p></div><div><p class="calc">C = 2 × 4,3 × 50<br>C = 2 × 50 × 4,3<br>C = 100 × 4,3<br>C = ${V("2 × 4,3 × 50")}</p></div></div><p><i>0,5 point par calcul (l'étape astucieuse doit apparaître).</i></p>`},
{t:"Où sont les parenthèses ?", p:2, h:`<p>Recopie chaque égalité en ajoutant des parenthèses pour qu'elle devienne vraie. Attention : il faut parfois deux paires de parenthèses.</p><p>a) 2 + 3 × 4 + 1 = 25</p><p>b) 24 ÷ 4 + 2 × 3 = 24</p><p>c) 10 − 4 − 2 + 1 = 7</p>`,
 c:`<p>a) (2 + 3) × (4 + 1) = ${V("(2 + 3) × (4 + 1)")} <i>(0,75 point)</i></p><p>b) (24 ÷ 4 + 2) × 3 = ${V("(24 ÷ 4 + 2) × 3")} <i>(0,75 point)</i></p><p>c) 10 − (4 − 2 + 1) = ${V("10 − (4 − 2 + 1)")} <i>(0,5 point)</i></p><p>Vérification :</p>${duo([["A","(2 + 3) × (4 + 1)"],["B","(24 ÷ 4 + 2) × 3"],["C","10 − (4 − 2 + 1)"]])}<p><i>Sans parenthèses, on trouve ${V("2 + 3 × 4 + 1")}, ${V("24 ÷ 4 + 2 × 3")} et ${V("10 − 4 − 2 + 1")} : vérifie toujours ton égalité en refaisant le calcul.</i></p>`},
{t:"Une seule expression", p:1.5, h:`<p>Chaque élève a fait ses calculs en plusieurs étapes. Écris une seule expression qui regroupe toutes ses étapes. Nomme-la A pour Léna et B pour Yanis.</p>
  <p>a) Léna : 7 × 4 = 28, puis 28 − 3 = 25, puis 25 × 2 = 50.</p><p>b) Yanis : 18 + 6 = 24, puis 24 ÷ 4 = 6, puis 6 + 5 = 11.</p>`,
 c:`<p>a) A = (7 × 4 − 3) × 2. Les parenthèses sont indispensables : sans elles, on multiplierait 3 par 2 en premier. <i>(0,75 point)</i></p>
  <p>b) B = (18 + 6) ÷ 4 + 5, ou avec un trait de fraction : B = {18 + 6/4} + 5. <i>(0,75 point)</i></p>
  <p>Vérification :</p>${duo([["A","(7 × 4 − 3) × 2"],["B","(18 + 6) ÷ 4 + 5"]])}`},
{t:"La cagnotte de la classe", p:3, h:`<p>Pour la fête de fin d'année, les 24 élèves d'une classe donnent chacun 3 €, et le collège ajoute 30 €. Avec cette cagnotte, ils achètent un gâteau à 48 € et des boissons pour 18 €. Combien reste-t-il dans la cagnotte ?</p>
  <p>1) Écris une seule expression qui permet de résoudre le problème. Nomme-la A.</p><p>2) Effectue le calcul en détaillant tes étapes.</p><p>3) Conclus par une phrase.</p>`,
 c:`<p>1) Cagnotte : 24 × 3 + 30. Dépenses : 48 + 18. Expression : A = 24 × 3 + 30 − (48 + 18). <i>(1 point)</i></p>
  <p>2) <i>(1,5 point)</i></p>${L("24 × 3 + 30 − (48 + 18)","A")}
  <p>3) Il reste ${V("24 × 3 + 30 − (48 + 18)")} € dans la cagnotte. <i>(0,5 point)</i></p>`}
]};
/* ---- version aménagée (élèves à besoins éducatifs particuliers), faite comme M. Staal fait les siennes :
   même durée, environ une question sur cinq retirée (jamais un exercice entier), questions renumérotées, barème recalculé (toujours sur 10) ---- */
CH["5e-3"].eval.bep = {
titre:"Évaluation d'entraînement — Chapitre 3 · version aménagée", duree:25, info:"Version aménagée · Durée : 25 min · Calculatrice non autorisée · Noté sur 10",
note:"Même durée et mêmes exercices, avec environ une question sur cinq en moins (réparties dans plusieurs exercices). Les questions sont renumérotées et le barème est recalculé : la note reste sur 10.",
comp:[
  ["CALCULER","Je connais et j'utilise les priorités opératoires. Je calcule astucieusement.","Ex. 1, 2 et 3 (4,5 points)"],
  ["MODÉLISER","J'écris une seule expression pour regrouper des calculs ou pour résoudre un problème.","Ex. 4 et 5 (5,5 points)"]
],
exos:[
{t:"Calcul mental", p:1.5, h:`<p>Pour chaque calcul, écris seulement le résultat.</p><div class="calcs"><span>A = 8 + 2 × 6</span><span>B = 40 − 10 × 3</span><span>C = {30 + 6/4}</span></div>`,
 c:`<p>A = ${V("8 + 2 × 6")} ; B = ${V("40 − 10 × 3")} ; C = ${V("(30 + 6) ÷ 4")}. <i>0,5 point par calcul.</i></p><p>Les étapes :</p>
 <div class="calcs"><div>${L("8 + 2 × 6","A")}</div><div>${L("40 − 10 × 3","B")}</div><div><p class="calc">C = {30 + 6/4}<br>C = (30 + 6) ÷ 4<br>C = 36 ÷ 4<br>C = ${V("(30 + 6) ÷ 4")}</p></div></div>
 <p>Pour C : le trait de fraction regroupe le numérateur.</p>`},
{t:"Calculer astucieusement", p:1, h:`<p>Calcule astucieusement, en écrivant l'étape qui rend le calcul facile.</p><div class="calcs"><span>A = 4 × 37 × 25</span><span>B = 6,8 + 4,5 + 3,2</span></div>`,
 c:`<div class="calcs"><div><p class="calc">A = 4 × 37 × 25<br>A = 4 × 25 × 37<br>A = 100 × 37<br>A = ${V("4 × 37 × 25")}</p></div><div><p class="calc">B = 6,8 + 4,5 + 3,2<br>B = 6,8 + 3,2 + 4,5<br>B = 10 + 4,5<br>B = ${V("6,8 + 4,5 + 3,2")}</p></div></div><p><i>0,5 point par calcul (l'étape astucieuse doit apparaître).</i></p>`},
{t:"Où sont les parenthèses ?", p:2, h:`<p>Recopie chaque égalité en ajoutant des parenthèses pour qu'elle devienne vraie. Attention : il faut parfois deux paires de parenthèses.</p><p>a) 2 + 3 × 4 + 1 = 25</p><p>b) 10 − 4 − 2 + 1 = 7</p>`,
 c:`<p>a) (2 + 3) × (4 + 1) = ${V("(2 + 3) × (4 + 1)")} <i>(1 point)</i></p><p>b) 10 − (4 − 2 + 1) = ${V("10 − (4 − 2 + 1)")} <i>(1 point)</i></p><p>Vérification :</p>${duo([["A","(2 + 3) × (4 + 1)"],["B","10 − (4 − 2 + 1)"]])}<p><i>Sans parenthèses, on trouve ${V("2 + 3 × 4 + 1")} et ${V("10 − 4 − 2 + 1")} : vérifie toujours ton égalité en refaisant le calcul.</i></p>`},
{t:"Une seule expression", p:2, h:`<p>Chaque élève a fait ses calculs en plusieurs étapes. Écris une seule expression qui regroupe toutes ses étapes. Nomme-la A pour Léna et B pour Yanis.</p>
  <p>a) Léna : 7 × 4 = 28, puis 28 − 3 = 25, puis 25 × 2 = 50.</p><p>b) Yanis : 18 + 6 = 24, puis 24 ÷ 4 = 6, puis 6 + 5 = 11.</p>`,
 c:`<p>a) A = (7 × 4 − 3) × 2. Les parenthèses sont indispensables : sans elles, on multiplierait 3 par 2 en premier. <i>(1 point)</i></p>
  <p>b) B = (18 + 6) ÷ 4 + 5, ou avec un trait de fraction : B = {18 + 6/4} + 5. <i>(1 point)</i></p>
  <p>Vérification :</p>${duo([["A","(7 × 4 − 3) × 2"],["B","(18 + 6) ÷ 4 + 5"]])}`},
{t:"La cagnotte de la classe", p:3.5, h:`<p>Pour la fête de fin d'année, les 24 élèves d'une classe donnent chacun 3 €, et le collège ajoute 30 €. Avec cette cagnotte, ils achètent un gâteau à 48 € et des boissons pour 18 €. Combien reste-t-il dans la cagnotte ?</p>
  <p>1) Écris une seule expression qui permet de résoudre le problème. Nomme-la A.</p><p>2) Effectue le calcul en détaillant tes étapes.</p><p>3) Conclus par une phrase.</p>`,
 c:`<p>1) Cagnotte : 24 × 3 + 30. Dépenses : 48 + 18. Expression : A = 24 × 3 + 30 − (48 + 18). <i>(1,25 point)</i></p>
  <p>2) <i>(1,75 point)</i></p>${L("24 × 3 + 30 − (48 + 18)","A")}
  <p>3) Il reste ${V("24 × 3 + 30 − (48 + 18)")} € dans la cagnotte. <i>(0,5 point)</i></p>`}
]};
})();
