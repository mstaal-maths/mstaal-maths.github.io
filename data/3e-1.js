/* 3e — Chapitre 1 : Arithmétique (multiples, diviseurs, nombres premiers, décomposition, plus grand diviseur commun)
   Cours, fiche d'exercices, exercices en +, activités rapides et feuille de soutien de M. Staal.
   On a ajouté la méthode et l'exemple « problème de partage » de son cours « Problèmes liés à la divisibilité » (partie PGCD seulement).
   Les corrections sont calculées et vérifiées (aucun corrigé Word n'existait pour cette fiche). */
(function(){
const ON = ["Oui","Non"], VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");

/* ---------- outils d'arithmétique ---------- */
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const isPrime = n => { if(n<2) return false; for(let d=2; d*d<=n; d++) if(n%d===0) return false; return true; };
const PRIMES = Array.from({length:1000},(_,i)=>i).filter(isPrime);
const divisors = n => { const L=[]; for(let d=1; d<=n; d++) if(n%d===0) L.push(d); return L; };
const spf = n => { for(let d=2; d*d<=n; d++) if(n%d===0) return d; return n; };
const factors = n => { const f=[]; let r=n; while(r>1){ const p=spf(r); f.push(p); r/=p; } return f; };
const X = " × ";
const prod = a => a.reduce((x,y)=>x*y,1);
/* écriture avec puissances : 2<sup>3</sup> × 3 × 5<sup>2</sup> */
const pow = f => { const m=new Map(); f.forEach(p=>m.set(p,(m.get(p)||0)+1)); return [...m].map(([p,k])=>k>1?`${p}<sup>${k}</sup>`:String(p)).join(X); };
const flat = f => f.join(X);
/* étapes de la décomposition, comme dans le cours : 300 = 2 × 150 ; 300 = 2 × 2 × 75 ; … */
const steps = n => { const out=[], f=[]; let r=n; while(r>1 && !isPrime(r)){ const p=spf(r); f.push(p); r/=p; out.push([...f, r]); } return out; };
const stepLines = n => steps(n).map(s=>`${sp(n)} = ${s.map(sp).join(X)}`);
/* facteurs communs (avec répétition) */
const common = (fa, fb) => { const b=[...fb], c=[]; fa.forEach(p=>{ const i=b.indexOf(p); if(i>=0){ c.push(p); b.splice(i,1); } }); return c; };
/* « 900 = 2 × 2 × 3 × 3 × 5 × 5 = 50 × 18 » */
const pgcdLine = (n, g) => { const a=flat(factors(n)), b=`${sp(g)}${X}${sp(n/g)}`; return `${sp(n)} = ${a}${a===b?"":` = ${b}`}`; };
const divTxt = n => { const d=divisors(n); return d.slice(0,-1).join(", ")+" et "+d[d.length-1]; };
const digitSum = n => String(n).split("").reduce((s,c)=>s+ +c,0);
const digitTxt = n => String(n).split("").join(" + ")+" = "+digitSum(n);
/* « Facteurs communs : 2 × 2 × 3 = 12 » ou « Seul facteur premier commun : 7 » */
const comTxt = (a,b) => { const c=common(factors(a),factors(b)); return c.length===0 ? "Aucun facteur premier commun" : c.length===1 ? `Seul facteur premier commun : ${c[0]}` : `Facteurs communs : ${flat(c)} = ${sp(prod(c))}`; };

window.ARI3 = {gcd, isPrime, PRIMES, divisors, spf, factors, pow, flat, steps, stepLines, common, pgcdLine, divTxt, digitSum, digitTxt, comTxt, sp, X, prod};

/* ---------- tableaux ---------- */
const tab = (head, rows) => `<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
const crit = n => [2,3,5,9,10].map(d=>n%d===0?"X":"");
const critTab = (nums, full) => tab(["est divisible par","2","3","5","9","10"], nums.map(n=>[sp(n), ...(full?crit(n):["","","","",""])]));
/* crible d'Ératosthène : nombres premiers en gras, les autres barrés */
const crible = done => `<div class="scroll"><table class="std"><tbody>${Array.from({length:10},(_,r)=>`<tr>${Array.from({length:10},(_,c)=>{ const n=10*r+c+1; return `<td>${!done?n:isPrime(n)?`<b>${n}</b>`:`<s>${n}</s>`}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
window.ARI3.tab = tab; window.ARI3.critTab = critTab; window.ARI3.crit = crit;

/* ---------- schémas (rappels en image) ---------- */
const S_MULT = sch("Multiple et diviseur", `<p class="calc">12 × 2 = 24</p><p class="schN">24 est un <b>multiple</b> de 12.</p><p class="schN">12 est un <b>diviseur</b> de 24 : 24 ÷ 12 = 2 est un nombre entier.</p><p class="schN">Les diviseurs de 12 : 1, 2, 3, 4, 6 et 12.</p><p class="schN">Les 3 premiers multiples de 12 : 0, 12 et 24.</p>`);
const S_CRIT = sch("Critères de divisibilité", `<p class="schN"><b>Par 2</b> : le nombre se termine par 0, 2, 4, 6 ou 8.</p><p class="schN"><b>Par 5</b> : il se termine par 0 ou 5.</p><p class="schN"><b>Par 10</b> : il se termine par 0.</p><p class="schN"><b>Par 3</b> : la somme de ses chiffres est un multiple de 3.</p><p class="schN"><b>Par 9</b> : la somme de ses chiffres est un multiple de 9.</p><p class="calc">576 : 5 + 7 + 6 = 18 → divisible par 3 et par 9</p>`);
const S_PREM = sch("Nombre premier", `<p class="schN">Un nombre premier a <b>exactement deux diviseurs</b> : 1 et lui-même.</p><p class="schN">2, 3, 5, 7, 11, 13, 17, 19, 23, 29…</p><p class="schN">4 n'est pas premier : 1, 2 et 4 (trois diviseurs).</p><p class="schN">1 n'est pas premier : un seul diviseur.</p>`);
const S_DEC = sch("Décomposer en facteurs premiers", `<p class="calc">300 = 2 × 150<br>300 = 2 × 2 × 75<br>300 = 2 × 2 × 3 × 25<br>300 = 2 × 2 × 3 × 5 × 5 = 2<sup>2</sup> × 3 × 5<sup>2</sup></p><p class="schN">On divise par les nombres premiers 2, 3, 5, 7… jusqu'à n'avoir que des nombres premiers.</p>`);
const S_PGCD = sch("Plus grand diviseur commun", `<p class="calc">900 = <b>2</b> × 2 × 3 × 3 × <b>5 × 5</b> = 50 × 18<br>350 = <b>2</b> × <b>5 × 5</b> × 7 = 50 × 7</p><p class="schN">On ne garde que les facteurs premiers présents dans les deux décompositions : 2 × 5 × 5 = 50.</p><p class="schN">Problème de partage « le plus possible » : on cherche le plus grand diviseur commun.</p>`);

/* ---------- générateurs du QCM ---------- */
const COMPO = [12,18,20,24,28,30,32,36,40,42,45,48,50,54,56,60,63,64,70,72,75,80,84,90,96,98,100];
const decChoices = n => { const f=factors(n), good=pow(f);
  const bads=[];
  if(f.length>=3){ const g=[f[0]*f[1], ...f.slice(2)]; bads.push(g.join(X)); }
  const alt=[...f]; alt[alt.length-1]=alt[alt.length-1]===2?3:alt[alt.length-1]+2; bads.push(pow(alt));
  const alt2=[...f]; alt2.push(f[0]); bads.push(pow(alt2));
  const p0=spf(n); if(!isPrime(n/p0)) bads.push(flat([p0, n/p0]));
  return shuf(uniq(good, bads.filter(b=>b!==good)).slice(0,4)); };
const CONTEXTES = [["roses","tulipes","bouquets","bouquet"],["crêpes","gaufres","plateaux","plateau"],["billes rouges","billes bleues","sachets","sachet"],["croissants","pains au chocolat","corbeilles","corbeille"],["pommes","poires","paquets","paquet"]];
const genPartage = () => { let a,b,g; do{ g=ri(6,30); a=g*ri(3,15); b=g*ri(3,15); }while(a===b || gcd(a/g,b/g)!==1 || a>500 || b>500); return {a,b,g}; };

CH["3e-1"] = {
intro:"Reconnaître les multiples et les diviseurs d'un nombre, utiliser les critères de divisibilité, reconnaître un nombre premier, décomposer un nombre en produit de facteurs premiers et trouver le plus grand diviseur commun à deux nombres pour résoudre des problèmes de partage.",
savoir:[
  "reconnaître si un nombre est un multiple ou un diviseur d'un autre nombre ;",
  "utiliser les critères de divisibilité par 2, 3, 5, 9 et 10 ;",
  "reconnaître un nombre premier et justifier qu'un nombre n'est pas premier ;",
  "décomposer un nombre en produit de facteurs premiers ;",
  "trouver le plus grand diviseur commun à deux nombres ;",
  "résoudre un problème de répartition, de partage."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Multiples et diviseurs", h:`
  <div class="retenir" data-l="Définition"><p>Soit <i>a</i> et <i>b</i> deux entiers positifs ou nuls.</p>
   <p>On dit que « <i>a</i> <b>est un multiple de</b> <i>b</i> » s'il existe un <b>entier</b> tel que <i>b</i> × entier = <i>a</i>.</p>
   <p>On dit également que « <i>b</i> <b>est un diviseur de</b> <i>a</i> » ou que « <i>a</i> <b>est divisible par</b> <i>b</i> » lorsque <i>a</i> ÷ <i>b</i> = nombre entier.</p></div>
  <p><b>Exemples :</b></p>
  <p>24 est un <b>multiple de 12</b> car il existe un entier (2) tel que 12 × 2 = 24.</p>
  <p>36 est aussi un <b>multiple de 12</b> car il existe un entier (3) tel que 12 × 3 = 36.</p>
  <p>Les <b>3 premiers multiples de 12</b> sont 0, 12 et 24.</p>
  <p>1, 2, 3, 4, 6 et 12 sont <b>tous les diviseurs de 12</b> car 12 ÷ 1 = 12 ; 12 ÷ 2 = 6 ; 12 ÷ 3 = 4 ; 12 ÷ 4 = 3 ; 12 ÷ 6 = 2 et 12 ÷ 12 = 1 sont des nombres entiers.</p>
  <p><b>Exercice :</b></p>
  <p><b>a)</b> Tous les diviseurs de 15 : <b>1, 3, 5 et 15</b>.</p>
  <p><b>b)</b> Trois multiples de 15 : par exemple <b>15, 30 et 45</b>.</p>
  <p><b>c)</b> Tous les diviseurs de 28 : <b>1, 2, 4, 7, 14 et 28</b>.</p>
  <p><b>d)</b> Les <b>trois premiers multiples</b> de 28 : <b>0, 28 et 56</b>.</p>`},
{k:"II", t:"Critères de divisibilité", h:`
  <div class="retenir" data-l="Propriété">
   <p><b>Par 2 :</b> un nombre est divisible par 2 s'il <b>est pair</b>. Autrement dit, s'il se termine par 0, 2, 4, 6 ou 8.</p>
   <p><b>Par 5 :</b> un nombre est divisible par 5 s'il <b>se termine par 0 ou 5</b>.</p>
   <p><b>Par 10 :</b> un nombre est divisible par 10 s'il <b>se termine par 0</b>.</p>
   <p><b>Par 3 :</b> un nombre est divisible par 3 si <b>la somme de ses chiffres est un multiple de 3</b>.</p>
   <p><b>Par 9 :</b> un nombre est divisible par 9 si <b>la somme de ses chiffres est un multiple de 9</b>.</p></div>
  <p><b>Exemples :</b></p>
  <p>276 est divisible par 2 car il se termine par 6.</p>
  <p>845 est un multiple de 5 car il se termine par 5.</p>
  <p>840 est un multiple de 10 car il se termine par 0.</p>
  <p>276 est divisible par 3 car 2 + 7 + 6 = 15 et 15 est un multiple de 3.</p>
  <p>576 est divisible par 9 car 5 + 7 + 6 = 18 et 18 est un multiple de 9.</p>`},
{k:"III", t:"Nombres premiers", h:`
  <div class="retenir" data-l="Définition"><p>Un <b>nombre premier</b> est un entier positif qui admet <b>exactement deux diviseurs distincts : 1 et lui-même</b>.</p></div>
  <p><b>Exemples :</b></p>
  <p>Liste des nombres premiers inférieurs à 100 :</p>
  <p class="calc">2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,<br>43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.</p>
  <p>4 n'est pas un nombre premier car il a <b>trois</b> diviseurs : 1, 2 et 4.</p>
  <div class="attention"><b>ATTENTION :</b> 1 n'est pas un nombre premier car il n'a qu'un seul diviseur.</div>`},
{k:"IV", t:"Décomposition en produit de facteurs premiers", h:`
  <div class="retenir" data-l="Propriété"><p>On peut toujours décomposer un nombre non premier en <b>produit de facteurs premiers</b>, et cette décomposition est <b>unique</b>.</p></div>
  <p><b>Exemple :</b> donne la décomposition en produit de facteurs premiers de 300 et de 120 en détaillant tes étapes de calculs.</p>
  <div class="calcs"><p class="calc">${stepLines(300).join("<br>")}</p><p class="calc">${stepLines(120).join("<br>")}</p></div>
  <p><b>${pow(factors(300))}</b> est la décomposition en produit de facteurs premiers de 300.</p>
  <p><b>${pow(factors(120))}</b> est la décomposition en produit de facteurs premiers de 120.</p>`},
{k:"V", t:"Recherche du plus grand diviseur commun (PGCD)", h:`
  <p>Nous avons la décomposition en produit de facteurs premiers de 900 et 350 :</p>
  <p class="calc">900 = 2 × 2 × 3 × 3 × 5 × 5 = 50 × 18<br>350 = 2 × 5 × 5 × 7 = 50 × 7</p>
  <p>Le plus grand diviseur commun à 900 et 350 est <b>50</b>.</p>
  <div class="retenir" data-l="Méthode"><p>On repère le maximum de facteurs présents dans les deux décompositions.</p><p>On <b>ne prend que</b> les facteurs premiers qui <b>apparaissent dans les deux décompositions</b>, et on les multiplie.</p></div>
  <p><b>Exemple :</b> 240 = <b>2 × 2 × 2</b> × 2 × <b>3</b> × 5 et 312 = <b>2 × 2 × 2</b> × <b>3</b> × 13.</p>
  <p class="calc">2 × 2 × 2 × 3 = 24</p>
  <p>Le plus grand diviseur commun de 240 et 312 est <b>24</b>. En effet, 240 ÷ 24 = 10 et 312 ÷ 24 = 13.</p>
  <p><b>Exercice 1 :</b> voici la décomposition en produit de facteurs premiers de 1 960 et 1 500 :</p>
  <p class="calc">1 960 = 2<sup>3</sup> × 5 × 7<sup>2</sup> = 2 × 2 × 2 × 5 × 7 × 7 = 20 × 98<br>1 500 = 2<sup>2</sup> × 3 × 5<sup>3</sup> = 2 × 2 × 3 × 5 × 5 × 5 = 20 × 75</p>
  <p>Le plus grand diviseur commun à 1 960 et 1 500 est <b>2 × 2 × 5 = 20</b>.</p>
  <h4>Résoudre des problèmes de répartition, de partage</h4>
  <div class="retenir" data-l="À retenir"><p>Pour faire le <b>plus grand nombre</b> de paquets identiques en utilisant tout, on cherche le <b>plus grand diviseur commun</b> aux deux nombres.</p></div>
  <p><b>Exercice 2 :</b> nous avons en stock 7 020 chocolats au lait et 1 260 chocolats blancs. Nous voulons faire le plus de boîtes de chocolats identiques possible.</p>
  <p><b>a)</b> Combien pourrons-nous faire de boîtes au maximum ?</p><p><b>b)</b> Quel sera le contenu de chaque boîte ?</p><p><i>Tu pourras utiliser la calculatrice pour les décompositions.</i></p>
  <p class="calc">7 020 = 2 × 2 × 3 × 3 × 3 × 5 × 13 = 180 × 39<br>1 260 = 2 × 2 × 3 × 3 × 5 × 7 = 180 × 7</p>
  <p><b>a)</b> Le plus grand diviseur commun à 7 020 et 1 260 est 2 × 2 × 3 × 3 × 5 = 180. On pourra faire <b>180 boîtes</b> au maximum.</p>
  <p><b>b)</b> 7 020 ÷ 180 = 39 et 1 260 ÷ 180 = 7 : chaque boîte contiendra <b>39 chocolats au lait et 7 chocolats blancs</b>.</p>
  <p><b>Exercice 3 :</b> un fleuriste doit réaliser des bouquets tous identiques. Il dispose pour cela de 434 roses et 620 tulipes. Combien de bouquets peut-il faire au maximum et quelle sera la composition de chaque bouquet ?</p>
  <p><i>Explication :</i> il faut faire le plus grand nombre de bouquets possible, donc on cherche à diviser 434 et 620 par le même nombre entier, le plus grand possible : on cherche le plus grand diviseur commun de 434 et 620.</p>
  <p class="calc">434 = 2 × 7 × 31 et 620 = 2 × 2 × 5 × 31<br>2 × 31 = 62</p>
  <p>62 est le plus grand diviseur commun de 434 et 620 : il y aura <b>62 bouquets</b> au maximum.</p>
  <p>434 ÷ 62 = 7 et 620 ÷ 62 = 10 : chaque bouquet sera constitué de <b>7 roses et 10 tulipes</b>.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Multiples, diviseurs et critères de divisibilité", e:[
  {n:"Activité 1", t:"Les ballons (calculatrice autorisée)", w:"Sur ton cahier", h:`${img("3k1ex/ballons.jpg","Un bouquet de ballons de baudruche",130)}
   <p><b>1.</b> À la fin d'une fête de village, les 7 enfants présents se partagent équitablement les 402 ballons de baudruche qui ont servi à la décoration.</p><p>Combien reste-t-il de ballons ?</p>
   <p><b>2.</b> L'année suivante, les enfants présents se partagent équitablement la <b>totalité</b> des 402 ballons utilisés.</p><p>Combien pouvait-il y avoir d'enfants ? <i>Donne toutes les possibilités.</i></p>`,
   c:`<p><b>1.</b> 402 = 7 × 57 + 3 : chaque enfant reçoit 57 ballons et il reste <b>3 ballons</b>.</p>
   <p><b>2.</b> Le nombre d'enfants doit être un <b>diviseur</b> de 402 (le partage tombe juste).</p><p class="calc">402 = 1 × 402<br>402 = 2 × 201<br>402 = 3 × 134<br>402 = 6 × 67</p><p>Les diviseurs de 402 sont donc : 1, 2, 3, 6, 67, 134, 201 et 402.</p><p>Il y a plusieurs enfants : il pouvait y avoir <b>2, 3, 6, 67, 134, 201 ou 402 enfants</b>.</p>`},
  {n:"Exercice 1", t:"Diviseurs et multiples", w:"Sur ta feuille", h:`<p><b>a)</b> Cite tous les diviseurs de 8.</p><p><b>b)</b> Cite trois multiples de 8.</p><p><b>c)</b> Cite tous les diviseurs de 20.</p><p><b>d)</b> Cite trois multiples de 20.</p><p><b>e)</b> Cite les <b>trois premiers multiples</b> de 20.</p><p><b>f)</b> Cite tous les diviseurs de 36.</p>`,
   c:`<p><b>a)</b> 8 = 1 × 8 = 2 × 4. Les diviseurs de 8 sont 1, 2, 4 et 8.</p><p><b>b)</b> 8 × 1 = 8 ; 8 × 2 = 16 ; 8 × 3 = 24. Par exemple 8, 16 et 24.</p><p><b>c)</b> 20 = 1 × 20 = 2 × 10 = 4 × 5. Les diviseurs de 20 sont 1, 2, 4, 5, 10 et 20.</p><p><b>d)</b> 20 × 1 = 20 ; 20 × 2 = 40 ; 20 × 3 = 60. Par exemple 20, 40 et 60.</p><p><b>e)</b> 20 × 0 = 0 ; 20 × 1 = 20 ; 20 × 2 = 40. Les trois premiers multiples de 20 sont 0, 20 et 40.</p><p><b>f)</b> 36 = 1 × 36 = 2 × 18 = 3 × 12 = 4 × 9 = 6 × 6. Les diviseurs de 36 sont 1, 2, 3, 4, 6, 9, 12, 18 et 36.</p>`},
  {n:"Exercice 2", t:"Critères de divisibilité", w:"Sur ta feuille", h:`<p><b>a)</b> Complète le tableau en mettant une croix lorsque le nombre est divisible par 2, 3, 5, 9 ou 10.</p>${critTab([3640,924,1435,837],false)}
   <p><b>b)</b> Énonce les critères de divisibilité par 2, 3, 5, 9 et 10.</p><p>Un nombre est divisible par 2 si…</p><p>Un nombre est divisible par 3 si…</p><p>Un nombre est divisible par 5 si…</p><p>Un nombre est divisible par 9 si…</p><p>Un nombre est divisible par 10 si…</p>`,
   c:`<p><b>a)</b></p>${critTab([3640,924,1435,837],true)}
   <p>Sommes des chiffres : 3640 → 3 + 6 + 4 + 0 = 13 · 924 → 9 + 2 + 4 = 15 · 1435 → 1 + 4 + 3 + 5 = 13 · 837 → 8 + 3 + 7 = 18</p>
   <p><b>b)</b> Un nombre est divisible par 2 s'il se termine par 0, 2, 4, 6 ou 8 (il est pair).</p><p>Un nombre est divisible par 3 si la somme de ses chiffres est un multiple de 3.</p><p>Un nombre est divisible par 5 s'il se termine par 0 ou 5.</p><p>Un nombre est divisible par 9 si la somme de ses chiffres est un multiple de 9.</p><p>Un nombre est divisible par 10 s'il se termine par 0.</p>`},
  {n:"Activité rapide 1", t:"Diviseurs et multiples", w:"Sur ton cahier", h:`<p>Indique :</p><p><b>a)</b> tous les diviseurs de 24 ;</p><p><b>b)</b> tous les diviseurs de 40 ;</p><p><b>c)</b> les 3 premiers multiples de 24 ;</p><p><b>d)</b> les 3 premiers multiples de 40.</p>`,
   c:`<p><b>a)</b> 24 = 1 × 24 = 2 × 12 = 3 × 8 = 4 × 6. Les diviseurs de 24 sont 1, 2, 3, 4, 6, 8, 12 et 24.</p><p><b>b)</b> 40 = 1 × 40 = 2 × 20 = 4 × 10 = 5 × 8. Les diviseurs de 40 sont 1, 2, 4, 5, 8, 10, 20 et 40.</p><p><b>c)</b> 24 × 0 = 0 ; 24 × 1 = 24 ; 24 × 2 = 48. Les 3 premiers multiples de 24 sont 0, 24 et 48.</p><p><b>d)</b> 40 × 0 = 0 ; 40 × 1 = 40 ; 40 × 2 = 80. Les 3 premiers multiples de 40 sont 0, 40 et 80.</p>`},
  {n:"Activité rapide 2", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p><b>a)</b> Vrai ou faux ? 2 075 est un multiple de 5. Justifie.</p><p><b>b)</b> Vrai ou faux ? 3 est un diviseur de 403. Justifie.</p><p><b>c)</b> Donne 3 diviseurs de 28.</p><p><b>d)</b> Existe-t-il des nombres qui ne possèdent aucun diviseur ?</p>`,
   c:`<p><b>a)</b> Vrai : 2 075 se termine par 5 (2 075 = 5 × 415).</p><p><b>b)</b> Faux : 4 + 0 + 3 = 7 et 7 n'est pas un multiple de 3.</p><p><b>c)</b> Par exemple 1, 2 et 4 (les diviseurs de 28 sont 1, 2, 4, 7, 14 et 28).</p><p><b>d)</b> Non : tout nombre entier non nul est divisible par 1 et par lui-même. Il a donc au moins un diviseur.</p>`},
  {n:"Activité rapide 3", t:"Affirmation vraie ou fausse", w:"Sur ton cahier", h:`<p>Indique, <b>en justifiant rigoureusement</b>, si l'affirmation est vraie ou fausse.</p><p><b>Affirmation :</b> plus un nombre est grand, plus il a de diviseurs.</p>`,
   c:`<p><b>Faux.</b> Un contre-exemple suffit :</p><p>12 a 6 diviseurs : 1, 2, 3, 4, 6 et 12.</p><p>13 est plus grand que 12, mais il n'a que 2 diviseurs : 1 et 13.</p>`},
  {n:"Défi 1", t:"Qui suis-je ?", w:"Sur ton cahier", h:`<p>Je suis un nombre entier de 4 chiffres, multiple de 9 et de 10.</p><p>Mon chiffre des dizaines est le même que mon chiffre des centaines.</p><p>Mon chiffre des unités de mille divise tous les nombres entiers.</p><p><b>Qui suis-je ?</b></p>`,
   c:`<p>Le chiffre qui divise tous les nombres entiers est 1 : le nombre s'écrit 1 ? ? 0 (il se termine par 0 car il est multiple de 10).</p><p>Les chiffres des centaines et des dizaines sont égaux : 1 <i>a</i> <i>a</i> 0.</p><p>Multiple de 9 : 1 + <i>a</i> + <i>a</i> + 0 doit être un multiple de 9. Avec <i>a</i> = 4 : 1 + 4 + 4 + 0 = 9. (Avec les autres chiffres, la somme fait 1, 3, 5, 7, 11, 13, 15, 17 ou 19 : ce n'est pas un multiple de 9.)</p><p>Je suis <b>1 440</b>.</p>`},
  {n:"Défi 2", t:"Exactement 5 diviseurs", w:"Sur ton cahier", h:`<p>Quel est le plus petit nombre possédant exactement 5 diviseurs ?</p>`,
   c:`<p><b>16</b>, car ses diviseurs sont 1, 2, 4, 8 et 16.</p><p>Aucun nombre plus petit n'a exactement 5 diviseurs (par exemple 12 en a 6 et 15 en a 4).</p>`},
  {n:"Défi 3", t:"Quel est ce nombre ?", w:"Sur ton cahier", h:`<p>C'est un nombre entier compris entre 100 et 400.</p><p>Il est pair.</p><p>Il est divisible par 11.</p><p>Il a aussi 3 et 5 comme diviseurs.</p><p><b>Quel est ce nombre ?</b></p>`,
   c:`<p>Il est divisible par 2, 3, 5 et 11 : c'est un multiple de 2 × 3 × 5 × 11 = 330.</p><p>Entre 100 et 400, le seul multiple de 330 est <b>330</b>.</p>`},
  {n:"Défi 4", t:"Les romans de Charlotte", w:"Sur ton cahier", h:`<p>Charlotte adore la lecture et possède entre 400 et 450 romans. Elle décide de revendre ses livres sur internet pour en acheter d'autres.</p><p>Lorsqu'elle regroupe ses livres par 3, par 4 ou par 5, il en reste toujours 1.</p><p><b>Combien de romans possède-t-elle exactement ?</b></p>`,
   c:`<p>Si on enlève 1 livre, le nombre obtenu est un multiple de 3, de 4 et de 5, donc un multiple de 60.</p><p>Entre 399 et 449, le seul multiple de 60 est 420 : 420 est un multiple de 3 (4 + 2 + 0 = 6), de 4 (420 = 4 × 105) et de 5 (il se termine par 0).</p><p>Charlotte possède <b>421 romans</b>.</p>`}
 ]},
{t:"Nombres premiers", e:[
  {n:"Activité 2", t:"Crible d'Ératosthène", w:"Sur ta feuille", h:`<p>Dans le tableau suivant :</p><p><b>a)</b> Entoure 2 puis raye tous les multiples de 2.</p><p><b>b)</b> Entoure 3 puis raye tous les multiples de 3.</p><p><b>c)</b> Recommence ainsi avec le premier nombre non rayé suivant, jusqu'à ce que tous les nombres soient rayés ou entourés.</p><p><b>d)</b> Que peut-on dire de tous les nombres entourés ?</p>${crible(false)}`,
   c:`<p><b>a) b) c)</b> On entoure 2, 3, 5, 7, puis 11, 13… (en gras) ; leurs multiples sont rayés. 1 est rayé : il n'a qu'un seul diviseur.</p>${crible(true)}
   <p><b>d)</b> Les nombres entourés sont les <b>nombres premiers</b> inférieurs à 100 : ils n'ont que deux diviseurs, 1 et eux-mêmes.</p><p>2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89 et 97.</p>`},
  {n:"Exercice 3", t:"Affirmations sur les nombres premiers", w:"Sur ton cahier", h:`<p>Indique, <b>en justifiant rigoureusement</b>, si chacune des affirmations est vraie ou fausse.</p><p><b>Affirmation 1 :</b> 210 est un nombre premier.</p><p><b>Affirmation 2 :</b> 51 est un nombre premier.</p><p><b>Affirmation 3 :</b> tous les nombres impairs sont des nombres premiers.</p><p><b>Affirmation 4 :</b> un nombre premier ne peut pas être pair.</p>`,
   c:`<p><b>Affirmation 1 : fausse.</b> 210 se termine par 0 : il est divisible par 2 (210 = 2 × 105). Il a donc d'autres diviseurs que 1 et 210.</p>
   <p><b>Affirmation 2 : fausse.</b> 5 + 1 = 6 est un multiple de 3 : 51 = 3 × 17. Il a 4 diviseurs : 1, 3, 17 et 51.</p>
   <p><b>Affirmation 3 : fausse.</b> Contre-exemple : 9 est impair, mais 9 = 3 × 3 n'est pas premier.</p>
   <p><b>Affirmation 4 : fausse.</b> Contre-exemple : 2 est pair et il est premier (ses seuls diviseurs sont 1 et 2).</p>`},
  {n:"Défi 5", t:"Quel est le numéro de l'appartement de Bastien ?", w:"Sur ton cahier", h:`<p>Bastien a invité chez lui son ami Pierre et lui a donné quelques indices pour trouver le numéro de son appartement.</p>
   <p><b>Indice 1 :</b> le numéro de l'appartement de Bastien est un nombre premier plus petit que 100.</p><p><b>Indice 2 :</b> Noé, le voisin de Bastien, habite un appartement dont le numéro est divisible par 3 et par 5.</p><p><b>Indice 3 :</b> le numéro de l'appartement de Noé est le nombre entier qui précède le numéro de l'appartement de Bastien.</p>
   <p><b>a)</b> Devant l'immeuble, Pierre se rend compte qu'il lui manque des informations pour trouver de façon certaine le numéro de l'appartement de Bastien. Quels sont tous les numéros d'appartement possibles ?</p>
   <p><b>b)</b> Bastien réalise alors que son ami Pierre ne pourra pas trouver le numéro. Il lui envoie un SMS : le numéro de l'appartement de Noé est divisible par 4. Quel est le numéro de l'appartement de Bastien ?</p>`,
   c:`<p><b>a)</b> Le numéro de Noé est divisible par 3 et par 5, donc par 15 : 15, 30, 45, 60, 75 ou 90.</p><p>Le numéro de Bastien est le suivant : 16, 31, 46, 61, 76 ou 91.</p><p>16, 46 et 76 sont pairs ; 91 = 7 × 13. Seuls 31 et 61 sont premiers : <b>31 ou 61</b>.</p>
   <p><b>b)</b> 30 n'est pas divisible par 4, mais 60 = 4 × 15 l'est. Noé habite au 60 et Bastien au <b>61</b>.</p>`}
 ]},
{t:"Décomposition en produit de facteurs premiers", e:[
  {n:"Exercice en + 1", t:"Décomposer en produit de facteurs premiers", w:"Sur ton cahier", h:`<p>Décompose les nombres suivants en produit de facteurs premiers.</p><div class="calcs">${[26,16,90,147,243,168].map(n=>`<span>${n}</span>`).join("")}</div>`,
   c:[26,16,90,147,243,168].map(n=>`<p class="calc">${stepLines(n).join("<br>")}${steps(n).length>1&&pow(factors(n))!==flat(factors(n))?` = ${pow(factors(n))}`:""}</p>`).join("")},
  {n:"Exercice en + 2", t:"Utiliser une décomposition", w:"Sur ton cahier", h:`<p>On sait que 8 712 = 88 × 99.</p><p><b>a)</b> Écris la décomposition en facteurs premiers de 8 712.</p><p><b>b)</b> Parmi les nombres suivants, quels sont les diviseurs de 8 712 ? <i>Ne fais pas de calculs.</i></p><div class="calcs"><span>6</span><span>33</span><span>8</span><span>2<sup>2</sup> × 3 × 11</span><span>3<sup>2</sup> × 11<sup>2</sup></span><span>2<sup>2</sup> × 7</span></div>`,
   c:`<p><b>a)</b> 88 = 2 × 2 × 2 × 11 et 99 = 3 × 3 × 11.</p><p class="calc">8 712 = 2 × 2 × 2 × 11 × 3 × 3 × 11 = 2<sup>3</sup> × 3<sup>2</sup> × 11<sup>2</sup></p>
   <p><b>b)</b> Un diviseur de 8 712 ne contient que des facteurs de sa décomposition.</p><p>6 = 2 × 3 : <b>oui</b> · 33 = 3 × 11 : <b>oui</b> · 8 = 2<sup>3</sup> : <b>oui</b> · 2<sup>2</sup> × 3 × 11 : <b>oui</b> · 3<sup>2</sup> × 11<sup>2</sup> : <b>oui</b> · 2<sup>2</sup> × 7 : <b>non</b> (7 n'apparaît pas dans la décomposition de 8 712)</p>`}
 ]},
{t:"Plus grand diviseur commun et problèmes de partage", e:[
  {n:"Activité 3", t:"Le petit-déjeuner", w:"Sur ton cahier", h:`${img("3k1ex/croissants.png","Une corbeille de croissants et de pains au chocolat",220)}
   <p><b>Problème 1 :</b> nous préparons les tables du petit-déjeuner dans une chambre d'hôtes. Ce matin, le boulanger nous a livré 16 croissants et 28 pains au chocolat.</p><p>Nous voulons les répartir dans des corbeilles ayant toutes le même contenu.</p>
   <p>Combien pourrons-nous faire de corbeilles et quel sera le contenu de chaque corbeille ? <b>Donne toutes les possibilités.</b></p>`,
   c:`<p>Le nombre de corbeilles doit diviser 16 <b>et</b> 28.</p><p>Diviseurs de 16 : 1, 2, 4, 8, 16. Diviseurs de 28 : 1, 2, 4, 7, 14, 28.</p><p>Diviseurs communs : 1, 2 et 4.</p>
   ${tab(["Nombre de corbeilles","Croissants par corbeille","Pains au chocolat par corbeille"],[["1","16","28"],["2","8","14"],["4","4","7"]])}`},
  {n:"Activité 3 (suite)", t:"Problèmes de répartition", w:"Sur ton cahier", h:`<p><b>Problème 2 :</b> chez le fleuriste, il reste 12 roses rouges et 18 roses blanches. Le commerçant souhaite faire des bouquets identiques avec toutes les fleurs qu'il lui reste.</p><p><b>a)</b> Combien de bouquets pourra-t-il faire ? <b>Donne toutes les possibilités.</b></p><p><b>b)</b> Quelle sera la composition de chaque bouquet ?</p>
   <p><b>Problème 3 :</b> Louise achète 78 crevettes et 52 huîtres. Elle invite des amis à dîner. Elle souhaite utiliser tous les fruits de mer et les présenter dans des assiettes identiques.</p><p><b>a)</b> Combien d'assiettes <b>au maximum</b> peut-elle faire ?</p><p><b>b)</b> Quelle sera alors la composition de chaque assiette ?</p>
   <p><b>Problème 4 :</b> nous préparons les tables du petit-déjeuner dans un hôtel. Ce matin, le boulanger nous a livré 120 croissants et 132 pains au chocolat. Nous voulons les répartir dans un nombre maximum de corbeilles ayant toutes le même contenu.</p><p><b>a)</b> Combien pourrons-nous faire de corbeilles ?</p><p><b>b)</b> Quel sera le contenu de chaque corbeille ?</p>`,
   c:`<p><b>Problème 2.</b> Diviseurs communs à 12 et 18 : 1, 2, 3 et 6.</p>${tab(["Nombre de bouquets","Roses rouges","Roses blanches"],[["1","12","18"],["2","6","9"],["3","4","6"],["6","2","3"]])}
   <p><b>Problème 3.</b> 78 = 2 × 3 × 13 = 26 × 3 et 52 = 2 × 2 × 13 = 26 × 2.</p><p><b>a)</b> Le plus grand diviseur commun est 2 × 13 = 26 : <b>26 assiettes</b> au maximum.</p><p><b>b)</b> 78 ÷ 26 = 3 et 52 ÷ 26 = 2 : <b>3 crevettes et 2 huîtres</b> par assiette.</p>
   <p><b>Problème 4.</b> 120 = 2 × 2 × 2 × 3 × 5 = 12 × 10 et 132 = 2 × 2 × 3 × 11 = 12 × 11.</p><p><b>a)</b> Le plus grand diviseur commun est 2 × 2 × 3 = 12 : <b>12 corbeilles</b>.</p><p><b>b)</b> 120 ÷ 12 = 10 et 132 ÷ 12 = 11 : <b>10 croissants et 11 pains au chocolat</b> par corbeille.</p>`},
  {n:"Exercice 4", t:"Recherche du plus grand diviseur commun (PGCD)", w:"Sur ta feuille", h:`<p>Pour chaque cas, écris chaque nombre sous la forme « produit des facteurs communs × reste », puis donne le plus grand diviseur commun aux deux nombres.</p>
   <p><b>Cas n° 1 :</b> 63 = 3 × 3 × 7 et 42 = 2 × 3 × 7</p><p><b>Cas n° 2 :</b> 300 = 2 × 2 × 3 × 5 × 5 et 350 = 2 × 5 × 5 × 7</p><p><b>Cas n° 3 :</b> 1 638 = 2 × 3 × 3 × 7 × 13 et 572 = 2 × 2 × 11 × 13</p>
   <p><b>Cas n° 4 :</b> 1 575 = 3<sup>2</sup> × 5<sup>2</sup> × 7 et 750 = 2 × 3 × 5<sup>3</sup></p><p><b>Cas n° 5 :</b> 1 040 = 2<sup>4</sup> × 5 × 13 et 3 500 = 2<sup>2</sup> × 5<sup>3</sup> × 7</p><p><b>Cas n° 6 :</b> 675 = 3<sup>3</sup> × 5<sup>2</sup> et 75 = 3 × 5<sup>2</sup></p><p><b>Cas n° 7 :</b> 40 = 2<sup>3</sup> × 5 et 57 = 3 × 19</p>`,
   c:[[63,42],[300,350],[1638,572],[1575,750],[1040,3500],[675,75],[40,57]].map(([a,b],i)=>{ const g=gcd(a,b); return `<p><b>Cas n° ${i+1} :</b></p><p class="calc">${pgcdLine(a,g)}<br>${pgcdLine(b,g)}</p><p>${comTxt(a,b)}. Le plus grand diviseur commun à ${sp(a)} et ${sp(b)} est <b>${sp(g)}</b>.</p>`; }).join("")},
  {n:"Exercice 5", t:"Chez le primeur", w:"Sur ton cahier", h:`<p><i>Calculatrice autorisée pour les décompositions : pas besoin de détailler les étapes de calculs.</i></p><p>Un primeur dispose de 440 pommes et 100 poires. Il souhaite préparer avec tous ses fruits des paquets de composition identique.</p><p>Combien de paquets le primeur peut-il faire au maximum et quelle sera la composition de chaque paquet ?</p>`,
   c:`<p class="calc">440 = 2 × 2 × 2 × 5 × 11 = 20 × 22<br>100 = 2 × 2 × 5 × 5 = 20 × 5</p><p>Le plus grand diviseur commun à 440 et 100 est 2 × 2 × 5 = 20 : le primeur peut faire <b>20 paquets</b> au maximum.</p><p>440 ÷ 20 = 22 et 100 ÷ 20 = 5 : chaque paquet contiendra <b>22 pommes et 5 poires</b>.</p>`},
  {n:"Exercice 6", t:"Colliers de perles", w:"Sur ton cahier", h:`<p>Laura possède 12 perles bleues et 30 perles grises. Elle souhaite faire des colliers identiques avec toutes ses perles.</p><p><b>a)</b> Combien de colliers peut-elle faire ? Donne toutes les possibilités. Elle ne veut pas faire qu'un seul collier.</p><p><b>b)</b> Quelle sera la composition de chaque collier ?</p>`,
   c:`<p><b>a)</b> Diviseurs de 12 : 1, 2, 3, 4, 6, 12. Diviseurs de 30 : 1, 2, 3, 5, 6, 10, 15, 30.</p><p>Diviseurs communs : 1, 2, 3 et 6. Elle ne veut pas un seul collier : elle peut faire <b>2, 3 ou 6 colliers</b>.</p>
   <p><b>b)</b></p>${tab(["Nombre de colliers","Perles bleues","Perles grises"],[["2","6","15"],["3","4","10"],["6","2","5"]])}`},
  {n:"Exercice en + 3", t:"Plantation (calculatrice autorisée)", w:"Sur ton cahier", h:`<p>Ludovic dirige un grand terrain de camping de forme triangulaire dont les dimensions sont 518 m, 448 m et 350 m.</p><p>Pour le protéger du vent et du soleil, Ludovic envisage de planter des arbres, régulièrement espacés, le long des côtés, avec un arbre à chaque sommet du triangle.</p><p>Il décide que la distance qui séparera deux arbres consécutifs doit être un nombre entier de mètres.</p>
   <p><b>1.</b> Quel est le nombre minimum d'arbres qu'il faut acheter ?</p><p><b>2.</b> Sachant qu'un arbre coûte 54 €, quel sera le coût de cet investissement ?</p>`,
   c:`<p><b>1.</b> La distance entre deux arbres doit diviser 518, 448 et 350. Pour avoir le moins d'arbres possible, elle doit être la plus grande possible : c'est le plus grand diviseur commun.</p>
   <p class="calc">518 = 2 × 7 × 37<br>448 = 2 × 2 × 2 × 2 × 2 × 2 × 7<br>350 = 2 × 5 × 5 × 7</p><p>Le plus grand diviseur commun est 2 × 7 = 14 : un arbre tous les 14 m.</p>
   <p>Périmètre : 518 + 448 + 350 = 1 316 m. Sur un tour complet, il y a autant d'arbres que d'intervalles : 1 316 ÷ 14 = 94.</p><p>Il faut acheter au minimum <b>94 arbres</b>.</p>
   <p><b>2.</b> 94 × 54 = 5 076 : l'investissement coûtera <b>5 076 €</b>.</p>`}
 ]},
{t:"Bilan", e:[
  {n:"QCM", t:"Arithmétique QCM", w:"Sur ton cahier", h:`<p>Pour chaque proposition, il y a toujours une ou plusieurs bonnes réponses. Trouve-les toutes.</p>
   ${tab(["Proposition","A","B","C"],[["1. 423 est un nombre :","divisible par 9.","premier.","qui n'est pas premier."],["2. 59 est un nombre :","premier.","qui n'est pas premier.","divisible par 9."],["3. 3 021 est un nombre :","premier.","divisible par 3.","multiple de 1 007."],["4. La décomposition en facteurs premiers de 32 est :","8 × 4","4 × 2 × 2 × 2","2 × 2 × 2 × 2 × 2"],["5. La décomposition en facteurs premiers de 56 est :","7 × 8","2 × 2 × 2 × 7","28 × 2"],["6. 600 = 8 × 3 × 25. La décomposition en produit de facteurs premiers de 600 est :","2 × 2 × 2 × 3 × 5 × 5","8 × 3 × 25","3 × 5 × 5 × 8"]])}`,
   c:`<p><b>1. A et C.</b> 4 + 2 + 3 = 9 : 423 est divisible par 9 (423 = 9 × 47), donc il n'est pas premier.</p>
   <p><b>2. A.</b> 59 n'est divisible que par 1 et 59 : il est premier (5 + 9 = 14, il n'est pas divisible par 9).</p>
   <p><b>3. B et C.</b> 3 + 0 + 2 + 1 = 6 : 3 021 est divisible par 3, et 3 021 = 3 × 1 007 : c'est un multiple de 1 007. Il n'est pas premier.</p>
   <p><b>4. C.</b> 8 et 4 ne sont pas premiers : 32 = 2 × 2 × 2 × 2 × 2.</p>
   <p><b>5. B.</b> 56 = 2 × 2 × 2 × 7 (8 et 28 ne sont pas premiers).</p>
   <p><b>6. A.</b> 600 = 2 × 2 × 2 × 3 × 5 × 5 : seuls des nombres premiers (8 et 25 ne le sont pas).</p>`}
 ]},
{t:"Soutien", e:[
  {n:"Soutien 1", t:"Tournoi de handball", w:"Sur ton cahier", h:`<p>Le professeur d'EPS veut organiser un tournoi de handball avec toutes les classes de 3<sup>e</sup> du collège. Il souhaite que chaque équipe soit composée du même nombre de filles et du même nombre de garçons.</p><p>Sachant qu'il y a 96 filles et 132 garçons, donne le nombre maximum d'équipes que le professeur peut faire. Indique la composition d'une équipe.</p>`,
   c:`<p class="calc">96 = 2 × 2 × 2 × 2 × 2 × 3 = 12 × 8<br>132 = 2 × 2 × 3 × 11 = 12 × 11</p><p>Le plus grand diviseur commun est 2 × 2 × 3 = 12 : <b>12 équipes</b> au maximum.</p><p>96 ÷ 12 = 8 et 132 ÷ 12 = 11 : chaque équipe a <b>8 filles et 11 garçons</b>.</p>`},
  {n:"Soutien 2", t:"Plus grand diviseur commun", w:"Sur ton cahier", h:`<p>Dans chaque cas, décompose chaque nombre en produit de facteurs premiers, et donne le plus grand diviseur commun à ces deux nombres.</p><p><b>Série 1 :</b> 240 et 252</p><p><b>Série 2 :</b> 86 et 153</p>`,
   c:`<p><b>Série 1 :</b></p><p class="calc">240 = 2 × 2 × 2 × 2 × 3 × 5 = 2<sup>4</sup> × 3 × 5<br>252 = 2 × 2 × 3 × 3 × 7 = 2<sup>2</sup> × 3<sup>2</sup> × 7</p><p>Le plus grand diviseur commun est 2 × 2 × 3 = <b>12</b>.</p>
   <p><b>Série 2 :</b></p><p class="calc">86 = 2 × 43<br>153 = 3 × 3 × 17 = 3<sup>2</sup> × 17</p><p>Aucun facteur premier commun : le plus grand diviseur commun est <b>1</b>.</p>`},
  {n:"Soutien 3", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>Pour chaque affirmation, dis si elle est vraie ou fausse, et <b>justifie rigoureusement</b> ta réponse.</p><p><b>a)</b> 36 est un multiple de 6.</p><p><b>b)</b> 387 est un nombre premier.</p><p><b>c)</b> 16 possède 4 diviseurs.</p>`,
   c:`<p><b>a)</b> Vrai : 6 × 6 = 36.</p><p><b>b)</b> Faux : 3 + 8 + 7 = 18 est un multiple de 3, donc 387 est divisible par 3 (387 = 3 × 129).</p><p><b>c)</b> Faux : 16 a 5 diviseurs : 1, 2, 4, 8 et 16.</p>`},
  {n:"Soutien 4", t:"Tournoi de softball", w:"Sur ton cahier", h:`<p>Le professeur d'EPS veut organiser un tournoi de softball avec toutes les classes de 3<sup>e</sup> du collège.</p><p>Il souhaite que, dans chaque équipe, il y ait le même nombre de filles et le même nombre de garçons, qu'il n'y ait aucun remplaçant, et qu'une équipe soit composée de 8 à 15 joueurs.</p><p>Sachant qu'il y a 72 filles et 108 garçons, donne toutes les compositions possibles des équipes.</p>`,
   c:`<p>Le nombre d'équipes doit diviser 72 et 108.</p><p class="calc">72 = 2<sup>3</sup> × 3<sup>2</sup> et 108 = 2<sup>2</sup> × 3<sup>3</sup></p><p>Le plus grand diviseur commun est 2<sup>2</sup> × 3<sup>2</sup> = 36. Les diviseurs communs sont les diviseurs de 36 : 1, 2, 3, 4, 6, 9, 12, 18 et 36.</p>
   <p>Il y a 72 + 108 = 180 joueurs. Une équipe a 180 ÷ (nombre d'équipes) joueurs, entre 8 et 15. Avec 1, 2, 3, 4 ou 6 équipes, il y aurait 180, 90, 60, 45 ou 30 joueurs par équipe : c'est beaucoup trop.</p>
   ${tab(["Nombre d'équipes","9","12","18","36"],[["Joueurs par équipe","20 (trop)","15","10","5 (pas assez)"]])}
   <p><b>12 équipes de 6 filles et 9 garçons</b> (15 joueurs), ou <b>18 équipes de 4 filles et 6 garçons</b> (10 joueurs).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Multiples et diviseurs", schema:S_MULT, q:{
 1:[ {g:()=>{ const b=ri(3,15), ok=Math.random()<0.5, a=ok?b*ri(2,12):b*ri(2,12)+ri(1,b-1); return {q:`${a} est-il un multiple de ${b} ?`, c:ON, rep:ok?"Oui":"Non", ex:ok?`${b} × ${a/b} = ${a}.`:`${a} = ${b} × ${Math.floor(a/b)} + ${a%b} : la division ne tombe pas juste.`, sx:S_MULT}; }} ],
 2:[ {g:()=>{ const n=pick([12,18,20,24,28,30,32,36,40,45,48,50]), d=divisors(n); return {q:`Combien de diviseurs le nombre ${n} a-t-il ?`, rep:String(d.length), ex:`Les diviseurs de ${n} sont ${divTxt(n)}.`, sx:S_MULT}; }},
     {g:()=>{ const n=ri(6,30); return {q:`Quels sont les trois premiers multiples de ${n} ?`, c:shuf([`0, ${n} et ${2*n}`, `1, ${n} et ${2*n}`, `${n}, ${n+1} et ${n+2}`]), rep:`0, ${n} et ${2*n}`, ex:`${n} × 0 = 0, ${n} × 1 = ${n}, ${n} × 2 = ${2*n}.`, sx:S_MULT}; }} ],
 3:[ {g:()=>{ const n=pick([24,30,36,40,42,48,60,72]), d=divisors(n), miss=pick(d.slice(1,-1)); let extra; do{ extra=ri(2,n-1); }while(n%extra===0);
       const bad1=d.filter(x=>x!==miss), bad2=[...d,extra].sort((x,y)=>x-y), t=L=>L.slice(0,-1).join(", ")+" et "+L[L.length-1];
       return {q:`Quelle liste donne <b>tous</b> les diviseurs de ${n} ?`, c:shuf([t(d),t(bad1),t(bad2)]), rep:t(d), ex:`On cherche les divisions de ${n} qui tombent juste : ${t(d)}.`, sx:S_MULT}; }} ]
}},
{nom:"Critères de divisibilité", schema:S_CRIT, q:{
 1:[ {g:()=>{ const d=pick([2,5,10]), n=ri(100,9999); const ok=n%d===0; return {q:`${sp(n)} est-il divisible par ${d} ?`, c:ON, rep:ok?"Oui":"Non", ex:`${sp(n)} se termine par ${n%10}. ${d===2?"Divisible par 2 : il se termine par 0, 2, 4, 6 ou 8.":d===5?"Divisible par 5 : il se termine par 0 ou 5.":"Divisible par 10 : il se termine par 0."}`, sx:S_CRIT}; }} ],
 2:[ {g:()=>{ const d=pick([3,9]); let n=ri(100,9999); if(Math.random()<0.5) n-=n%d; const ok=n%d===0; return {q:`${sp(n)} est-il divisible par ${d} ?`, c:ON, rep:ok?"Oui":"Non", ex:`${digitTxt(n)}, ${ok?"":"qui n'est pas "}un multiple de ${d}.`, sx:S_CRIT}; }} ],
 3:[ {g:()=>{ const a=ri(1,9), b=ri(0,9); const ok=[]; for(let x=0;x<=9;x++) if((a+x+b)%9===0) ok.push(x);
       return {q:`Quel chiffre faut-il écrire à la place de □ pour que ${a}□${b} soit divisible par 9 ?`, rep:ok.map(String), ex:`${a} + ${ok[0]} + ${b} = ${a+ok[0]+b}, un multiple de 9.${ok.length>1?` (${ok[1]} convient aussi.)`:""}`, sx:S_CRIT}; }},
     {g:()=>{ let n; do{ n=ri(10,99)*10+pick([0,5]); }while(n<100); const L=[2,3,5,9,10].filter(d=>n%d===0), txt=L.join(", ");
       const all=["2, 5 et 10","5","3 et 5","2, 3, 5 et 10","3, 5 et 9","2, 3, 5, 9 et 10","5 et 9","2, 3, 5, 9 et 10"];
       return {q:`Par quels nombres parmi 2, 3, 5, 9 et 10 le nombre ${sp(n)} est-il divisible ?`, c:shuf(uniq(txt.replace(/, (\d+)$/," et $1"), shuf(all).slice(0,4)).slice(0,4)), rep:txt.replace(/, (\d+)$/," et $1"), ex:`Il se termine par ${n%10} ; ${digitTxt(n)}.`, sx:S_CRIT}; }} ]
}},
{nom:"Nombres premiers", schema:S_PREM, q:{
 1:[ {g:()=>{ const p=pick(PRIMES.filter(x=>x>10&&x<60)), bad=shuf([21,27,33,35,39,45,49,51,55,57,15,25]).slice(0,3); return {q:"Lequel de ces nombres est un nombre premier ?", c:shuf([String(p),...bad.map(String)]), rep:String(p), ex:`${p} n'a que deux diviseurs : 1 et ${p}. ${bad.map(b=>`${b} = ${spf(b)} × ${b/spf(b)}`).join(" ; ")}.`, sx:S_PREM}; }} ],
 2:[ {g:()=>{ const pr=Math.random()<0.4; let n; if(pr) n=pick(PRIMES.filter(x=>x>30&&x<200)); else do{ n=ri(31,199); }while(isPrime(n)||n%2===0||n%5===0);
       return {q:`${n} est-il un nombre premier ?`, c:ON, rep:pr?"Oui":"Non", ex:pr?`${n} n'est divisible que par 1 et par lui-même.`:`${n} = ${spf(n)} × ${n/spf(n)} : il a d'autres diviseurs que 1 et ${n}.`, sx:S_PREM}; }} ],
 3:[ {q:"Vrai ou faux : 1 est un nombre premier.", c:VF, rep:"Faux", ex:"1 n'a qu'un seul diviseur : lui-même.", sx:S_PREM},
     {q:"Vrai ou faux : un nombre premier ne peut pas être pair.", c:VF, rep:"Faux", ex:"2 est pair et il est premier : ses seuls diviseurs sont 1 et 2.", sx:S_PREM},
     {g:()=>{ const n=pick([51,57,87,91,93,111,119,133,143,161,169,187,203,209,221]); return {q:`Vrai ou faux : ${n} est un nombre premier.`, c:VF, rep:"Faux", ex:`${n} = ${spf(n)} × ${n/spf(n)}.`, sx:S_PREM}; }} ]
}},
{nom:"Décomposition en facteurs premiers", schema:S_DEC, q:{
 1:[ {g:()=>{ const n=pick(COMPO.filter(x=>x<=60)); return {q:`Quelle est la décomposition en produit de facteurs premiers de ${n} ?`, c:decChoices(n), rep:pow(factors(n)), ex:`${stepLines(n).join(" ; ")}.`, sx:S_DEC}; }} ],
 2:[ {g:()=>{ let n; do{ n=pick([2,4,8,3,9,6,12,18])*pick([5,7,25,35,11,15])*pick([1,2,3]); }while(n<100||n>1500||isPrime(n)); return {q:`Quelle est la décomposition en produit de facteurs premiers de ${sp(n)} ?`, c:decChoices(n), rep:pow(factors(n)), ex:`${flat(factors(n))} = ${pow(factors(n))}.`, sx:S_DEC}; }} ],
 3:[ {g:()=>{ const f=[2,2,2,3,3,11,11], ok=pick(["6","33","8","2<sup>2</sup> × 3 × 11","3<sup>2</sup> × 11<sup>2</sup>","2 × 3 × 11<sup>2</sup>"]), bad=shuf(["2<sup>2</sup> × 7","5 × 11","2<sup>4</sup> × 3","3<sup>3</sup>","2 × 13"]).slice(0,3);
       return {q:"8 712 = 2<sup>3</sup> × 3<sup>2</sup> × 11<sup>2</sup>. Lequel de ces nombres est un diviseur de 8 712 ?", c:shuf([ok,...bad]), rep:ok, ex:`Un diviseur de 8 712 ne contient que des facteurs de sa décomposition, sans dépasser les puissances : 2<sup>3</sup>, 3<sup>2</sup> et 11<sup>2</sup>.`, sx:S_DEC}; }},
     {g:()=>{ const a=pick([2,3,5]), b=pick([7,11,13]), n=a*a*b; return {q:`Combien de facteurs premiers (comptés avec leur répétition) y a-t-il dans la décomposition de ${n} ?`, rep:"3", ex:`${n} = ${a} × ${a} × ${b} : 3 facteurs premiers.`, sx:S_DEC}; }} ]
}},
{nom:"Plus grand diviseur commun et partage", schema:S_PGCD, q:{
 1:[ {g:()=>{ let a,b; do{ a=pick(COMPO); b=pick(COMPO); }while(a===b||gcd(a,b)===1); const g=gcd(a,b); return {q:`${a} = ${flat(factors(a))} et ${b} = ${flat(factors(b))}. Quel est le plus grand diviseur commun à ${a} et ${b} ?`, rep:String(g), ex:`${comTxt(a,b)}.`, sx:S_PGCD}; }} ],
 2:[ {g:()=>{ const P=genPartage(), K=pick(CONTEXTES); return {q:`Avec ${P.a} ${K[0]} et ${P.b} ${K[1]}, on veut faire le plus grand nombre de ${K[2]} identiques en utilisant tout. Combien de ${K[2]} peut-on faire ?`, rep:String(P.g), ex:`On cherche le plus grand diviseur commun à ${P.a} et ${P.b} : ${P.a} = ${P.g} × ${P.a/P.g} et ${P.b} = ${P.g} × ${P.b/P.g}, avec ${P.a/P.g} et ${P.b/P.g} sans diviseur commun autre que 1.`, sx:S_PGCD}; }} ],
 3:[ {g:()=>{ const P=genPartage(), K=pick(CONTEXTES), A=P.a/P.g, B=P.b/P.g; const good=`${A} ${K[0]} et ${B} ${K[1]}`;
       return {q:`Avec ${P.a} ${K[0]} et ${P.b} ${K[1]}, on fait le plus grand nombre possible de ${K[2]} identiques, en utilisant tout. Que contient chaque ${K[3]} ?`, c:shuf(uniq(good,[`${B} ${K[0]} et ${A} ${K[1]}`,`${A*2} ${K[0]} et ${B*2} ${K[1]}`,`${P.g} ${K[0]} et ${P.g} ${K[1]}`])), rep:good, ex:`On peut faire ${P.g} ${K[2]} (plus grand diviseur commun). ${P.a} ÷ ${P.g} = ${A} et ${P.b} ÷ ${P.g} = ${B}.`, sx:S_PGCD}; }},
     {g:()=>{ const a=pick([12,16,18,20,24,30]), b=pick([18,28,30,36,40,42]); if(a===b) return {q:"Combien de diviseurs communs ont 12 et 18 ?", rep:"4", ex:"1, 2, 3 et 6.", sx:S_PGCD}; const c=divisors(a).filter(d=>b%d===0);
       return {q:`Combien de diviseurs communs ont ${a} et ${b} ?`, rep:String(c.length), ex:`${c.join(", ")}.`, sx:S_PGCD}; }} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 1", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Stylo et crayon",
comp:[
  ["CONNAÎTRE","Je connais les mots multiple, diviseur et nombre premier.","Ex. 1 (3 points)"],
  ["CALCULER","J'utilise les critères de divisibilité par 2, 3, 5, 9 et 10.","Ex. 2 (3 points)"],
  ["CALCULER","Je décompose un nombre en produit de facteurs premiers.","Ex. 3 (4 points)"],
  ["RAISONNER","Je trouve le plus grand diviseur commun à deux nombres.","Ex. 4 (3 points)"],
  ["MODÉLISER","Je résous un problème de partage.","Ex. 5 (5 points)"],
  ["RAISONNER","Je combine plusieurs informations pour trouver un nombre.","Ex. 6 (2 points)"]
],
exos:[
{t:"Vrai ou faux ?", p:3, h:`<p>Dis si chaque affirmation est vraie ou fausse, et <b>justifie</b>.</p><p>a) 1 245 est divisible par 5.</p><p>b) 3 est un diviseur de 1 024.</p><p>c) 91 est un nombre premier.</p><p>d) 17 a exactement deux diviseurs.</p>`,
 c:`<p>a) Vrai : 1 245 se termine par 5.</p><p>b) Faux : 1 + 0 + 2 + 4 = 7, qui n'est pas un multiple de 3. Donc 1 024 n'est pas divisible par 3.</p><p>c) Faux : 91 = 7 × 13.</p><p>d) Vrai : 17 est premier, ses diviseurs sont 1 et 17.</p><p><i>(0,75 point par réponse justifiée)</i></p>`},
{t:"Critères de divisibilité", p:3, h:`<p>Recopie et complète le tableau avec une croix lorsque le nombre est divisible.</p>${critTab([2340,1755,4158,980],false)}`,
 c:`${critTab([2340,1755,4158,980],true)}<p>2 340, 4 158 et 980 sont pairs (divisibles par 2). 2 340, 1 755 et 980 se terminent par 0 ou 5 (divisibles par 5). 2 340 et 980 se terminent par 0 (divisibles par 10).</p><p>Sommes des chiffres : ${[2340,1755,4158,980].map(digitTxt).join(" ; ")}.</p><p><i>(0,75 point par ligne juste)</i></p>`},
{t:"Décomposer", p:4, h:`<p>Décompose 84 et 360 en produit de facteurs premiers, en détaillant tes étapes de calcul. Écris le résultat avec des puissances.</p>`,
 c:`<div class="calcs"><p class="calc">${stepLines(84).join("<br>")}<br>84 = ${pow(factors(84))}</p><p class="calc">${stepLines(360).join("<br>")}<br>360 = ${pow(factors(360))}</p></div><p><i>(2 points par décomposition : 1,5 point pour les étapes, 0,5 point pour l'écriture avec des puissances)</i></p>`},
{t:"Plus grand diviseur commun", p:3, h:`<p>Voici des décompositions en produit de facteurs premiers. Donne, en justifiant, le plus grand diviseur commun aux deux nombres.</p><p>a) 1 470 = 2 × 3 × 5 × 7<sup>2</sup> et 2 100 = 2<sup>2</sup> × 3 × 5<sup>2</sup> × 7</p><p>b) 81 = 3<sup>4</sup> et 64 = 2<sup>6</sup></p>`,
 c:`<p>a) Facteurs communs : 2 × 3 × 5 × 7 = <b>210</b>. En effet, 1 470 = 210 × 7 et 2 100 = 210 × 10. <i>(1,5 point)</i></p><p>b) Aucun facteur premier commun : le plus grand diviseur commun est <b>1</b>. <i>(1,5 point)</i></p>`},
{t:"La fête du collège", p:5, h:`<p>Pour la fête du collège, l'association des parents a préparé 240 crêpes et 168 gaufres.</p><p>Elle veut faire des plateaux identiques en utilisant toutes les crêpes et toutes les gaufres.</p><p>a) Peut-on faire 8 plateaux ? Justifie.</p><p>b) Décompose 240 et 168 en produit de facteurs premiers.</p><p>c) Quel est le nombre maximum de plateaux ?</p><p>d) Que contiendra alors chaque plateau ?</p>`,
 c:`<p>a) Oui : 240 ÷ 8 = 30 et 168 ÷ 8 = 21 tombent juste. <i>(1 point)</i></p><p>b)</p><div class="calcs"><p class="calc">${stepLines(240).join("<br>")}<br>240 = ${pow(factors(240))}</p><p class="calc">${stepLines(168).join("<br>")}<br>168 = ${pow(factors(168))}</p></div><p><i>(1,5 point)</i></p><p>c) Facteurs communs : 2 × 2 × 2 × 3 = 24 : <b>24 plateaux</b> au maximum. <i>(1,5 point)</i></p><p>d) 240 ÷ 24 = 10 et 168 ÷ 24 = 7 : <b>10 crêpes et 7 gaufres</b> par plateau. <i>(1 point)</i></p>`},
{t:"Qui suis-je ?", p:2, h:`<p>Je suis un nombre entier compris entre 50 et 100.</p><p>Je suis un nombre premier.</p><p>Le nombre qui me précède est divisible par 2, par 3 et par 5.</p><p>Qui suis-je ?</p>`,
 c:`<p>Le nombre qui me précède est un multiple de 2 × 3 × 5 = 30 : entre 49 et 99, c'est 60 ou 90. <i>(1 point)</i></p><p>Je suis donc 61 ou 91. Or 91 = 7 × 13 n'est pas premier : je suis <b>61</b>. <i>(1 point)</i></p>`}
]}
};
/* Le bouton « Pas à pas » (data/plus.js) est inséré juste avant chaque calcul : dans une grille .calcs, il prenait une case
   à lui seul et décalait les calculs. On met donc chaque calcul de la grille dans sa propre case (<div>). */
const WRAPC=h=>typeof h!=="string"?h:h.replace(/(<div class="calcs"[^>]*>)([\s\S]*?)(<\/div>)/g,(m,a,b,c)=>a+b.replace(/<p class="calc">([\s\S]*?)<\/p>/g,'<div><p class="calc">$1</p></div>')+c);
{ const D=CH["3e-1"]; (D.cours||[]).forEach(c=>c.h=WRAPC(c.h)); (D.exos||[]).forEach(S=>S.e.forEach(e=>{ e.h=WRAPC(e.h); e.c=WRAPC(e.c); })); if(D.eval) D.eval.exos.forEach(e=>{ e.h=WRAPC(e.h); e.c=WRAPC(e.c); }); }
})();
