/* 5e — Chapitre 16 : Probabilités (cours, fiche d'exercices et corrigé de M. Staal)
   Les sacs, la roue et l'échelle de probabilité du QCM et de la fiche d'entraînement sont dessinés en SVG
   à partir des valeurs : ce qui est dessiné est exactement ce qui est compté dans la correction. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const co = (p,alt,w) => img("5k16co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("5k16ex/"+p+".png", alt, w);
const cr = (p,alt,w) => img("5k16cr/"+p+".png", alt, w);
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const Fr = (a,b) => `{${a}/${b}}`;
/* calcul en chaîne (choix de M. Staal) : une étape par ligne, chaque ligne commence par le nom de la grandeur ; « ≈ … » pour une valeur arrondie */
const KCl = (n, L) => L.map(String).filter((x,i,a)=>i===0||x!==a[i-1]).map(x=>/^≈/.test(String(x))?`${n} ${x}`:`${n} = ${x}`).join("<br>");
const KC = (n, L) => `<p class="calc">${KCl(n,L)}</p>`;
const KCi = (n, L) => `<span class="calc" style="display:block;margin:6px 0">${KCl(n,L)}</span>`;
/* nombre décimal à la française (3 décimales au plus) */
const D = x => { const r=Math.round(x*1000)/1000; const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
/* fraction a/b, puis sa forme irréductible si elle est différente */
const irr = (a,b) => { if(a===0) return "0"; if(a===b) return `${Fr(a,b)} = 1`; const g=gcd(a,b); return g>1 ? `${Fr(a,b)} = ${Fr(a/g,b/g)}` : Fr(a,b); };
const irrOnly = (a,b) => { if(a===0) return "0"; if(a===b) return "1"; const g=gcd(a,b); return Fr(a/g,b/g); };
/* pourcentage : exact s'il a au plus une décimale, sinon « ≈ » arrondi à l'unité */
const pct = (a,b) => { const p=a*100/b; return Math.abs(p*10-Math.round(p*10))<1e-9 ? `${D(p)} %` : `≈ ${Math.round(p)} %`; };
const pctEq = (a,b) => { const s=pct(a,b); return s.startsWith("≈") ? s : "= "+s; };
/* décimal exact si la division tombe juste (au plus 3 décimales) */
const decOk = (a,b) => Math.abs(a*1000/b - Math.round(a*1000/b))<1e-9;

/* ---------- couleurs des boules et des secteurs (celles des images de la fiche) ---------- */
const COL = {R:["#e06666","rouge","rouges"], B:["#6fa8dc","bleue","bleues"], V:["#93c47d","verte","vertes"], J:["#ffd966","jaune","jaunes"]};
const COLm = {R:"rouge", B:"bleu", V:"vert", J:"jaune"};

/* un sac : liste de lettres R, B, V, J */
function sac(list, o={}){
  const per = o.per || Math.min(6, Math.max(3, Math.ceil(list.length/2))), r=19, gap=44;
  const rows = Math.ceil(list.length/per), W = per*gap+30, H = rows*gap+26;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(W*1.15,420).toFixed(0)}" role="img" aria-label="${o.alt||"Un sac de boules"}">`;
  s+=`<rect x="3" y="3" width="${W-6}" height="${H-6}" rx="16" style="fill:#f6f6f6;stroke:#1f4e79;stroke-width:2.5"/>`;
  list.forEach((c,i)=>{ const x=15+gap/2+(i%per)*gap+(Math.floor(i/per)%2?-6:6), y=13+gap/2+Math.floor(i/per)*gap;
    s+=`<circle cx="${x}" cy="${y}" r="${r}" style="fill:${COL[c][0]};stroke:#333;stroke-width:1.8"/>`; });
  return s+"</svg>";
}
/* une roue : liste des couleurs des secteurs, en partant du haut dans le sens des aiguilles d'une montre */
function roue(list, o={}){
  const n=list.length, R=86, cx=100, cy=112;
  let s=`<svg class="fig" viewBox="0 0 200 210" width="${o.w||190}" role="img" aria-label="${o.alt||"Une roue partagée en "+n+" secteurs identiques"}">`;
  list.forEach((c,i)=>{ const a0=-Math.PI/2+i*2*Math.PI/n, a1=a0+2*Math.PI/n;
    const p=a=>`${(cx+R*Math.cos(a)).toFixed(1)} ${(cy+R*Math.sin(a)).toFixed(1)}`;
    s+=`<path d="M${cx} ${cy} L${p(a0)} A${R} ${R} 0 0 1 ${p(a1)} Z" style="fill:${COL[c][0]};stroke:#1f4e79;stroke-width:2"/>`; });
  s+=`<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:none;stroke:#1f4e79;stroke-width:2.5"/>`;
  s+=`<path d="M${cx-10} 6 L${cx+10} 6 L${cx} 26 Z" style="fill:#222"/>`;
  return s+"</svg>";
}
/* échelle de probabilité de 0 à 1 ; pts [[nom, valeur]] */
function echelle(pts=[], o={}){
  const x0=40, x1=600, X=v=>x0+v*(x1-x0), Y=60, sorted=[...pts].sort((a,b)=>a[1]-b[1]);
  let s=`<svg class="fig" viewBox="0 0 650 120" width="${o.w||620}" role="img" aria-label="${o.alt||"Échelle de probabilité de 0 à 1"}">`;
  s+=`<line x1="${x0-8}" y1="${Y}" x2="${x1+16}" y2="${Y}" class="ln" style="stroke:#1f4e79;stroke-width:2.5"/><path d="M${x1+8} ${Y-6} L${x1+20} ${Y} L${x1+8} ${Y+6} Z" style="fill:#1f4e79"/>`;
  for(let k=0;k<=10;k++){ const x=X(k/10), big=k%5===0; s+=`<line x1="${x}" y1="${Y-(big?9:7)}" x2="${x}" y2="${Y+(big?9:7)}" style="stroke:#1f4e79;stroke-width:${big?2.5:2}"/>`; }
  s+=`<text x="${X(0)}" y="${Y+30}" class="lab">0</text><text x="${X(0.5)}" y="${Y+30}" class="lab">0,5</text><text x="${X(1)}" y="${Y+30}" class="lab">1</text>`;
  s+=`<text x="${X(0)}" y="${Y+52}" class="lab" style="font-size:13px;fill:var(--muted)">impossible</text><text x="${X(0.5)}" y="${Y+52}" class="lab" style="font-size:13px;fill:var(--muted)">une chance sur deux</text><text x="${X(1)}" y="${Y+52}" class="lab" style="font-size:13px;fill:var(--muted)">certain</text>`;
  let last=-99, lift=0;
  sorted.forEach(([L,v])=>{ const x=X(v); lift = (x-last<22) ? (lift?0:18) : 0; last=x;
    s+=`<circle cx="${x.toFixed(1)}" cy="${Y}" r="6" style="fill:#c00000"/><text x="${x.toFixed(1)}" y="${Y-16-lift}" class="ptl" style="fill:#c00000">${L}</text>`; });
  return s+"</svg>";
}
window.PROBA = {sac, roue, echelle, COL, COLm, Fr, D, irr, irrOnly, pct, pctEq, gcd, decOk, KC};

/* ---------- schémas (rappels en image) ---------- */
const S_EXP = sch("Expérience aléatoire, issues, événement", `<p class="schN">On lance un dé à 6 faces : les <b>issues</b> sont 1, 2, 3, 4, 5 et 6.</p><p class="schN">L'<b>événement</b> « obtenir un nombre pair » est réalisé par les issues 2, 4 et 6.</p><p class="schN">« Obtenir 7 » est <b>impossible</b>. « Obtenir un nombre inférieur à 7 » est <b>certain</b>.</p>`);
const S_ECH = sch("L'échelle de probabilité", echelle([["pile",0.5]],{w:440})+`<p class="schN">Une probabilité est un nombre entre 0 (impossible) et 1 (certain).</p><p class="calc">une chance sur quatre = {1/4} = 0,25 = 25 %</p>`);
const S_EQ = sch("Calculer une probabilité", sac(["R","R","R","B","B","B","B","B"],{per:4})+`<p class="calc">probabilité = {nombre d'issues favorables/nombre total d'issues}</p><p class="schN">3 boules rouges sur 8 boules : la probabilité p de tirer une rouge est :</p><p class="calc">p = {3/8}<br>p = 0,375<br>p = 37,5 %</p>`);
const S_FREQ = sch("Fréquences et probabilité", `<div class="scroll"><table class="std"><thead><tr><th>Nombre de lancers</th><th>10</th><th>100</th><th>1 000</th></tr></thead><tbody><tr><th>Fréquence de pile</th><td>0,7</td><td>0,54</td><td>0,506</td></tr></tbody></table></div><p class="schN">Plus on fait de lancers, plus la fréquence se rapproche de la probabilité ({1/2} = 0,5).</p><p class="schN">Le hasard n'a pas de mémoire.</p>`);

/* ---------- outils du QCM ---------- */
const DE = [["obtenir un nombre pair",[2,4,6]],["obtenir un nombre impair",[1,3,5]],["obtenir un multiple de 3",[3,6]],["obtenir un diviseur de 6",[1,2,3,6]],["obtenir un nombre inférieur à 3",[1,2]],["obtenir un nombre supérieur à 4",[5,6]],["obtenir un nombre inférieur à 5",[1,2,3,4]]];
const lst = a => a.length===1 ? String(a[0]) : a.slice(0,-1).join(", ")+" et "+a[a.length-1];
/* choix de fractions de valeurs toutes différentes */
const fracChoices = (good, bads) => { const val=([a,b])=>a/b; const out=[good]; bads.forEach(f=>{ if(f[1]>0 && f[0]>=0 && f[0]<=f[1] && !out.some(g=>Math.abs(val(g)-val(f))<1e-9)) out.push(f); }); return out.slice(0,3).map(([a,b])=>irrOnly(a,b)); };
const bagList = cnt => Object.entries(cnt).flatMap(([c,n])=>Array(n).fill(c));
const cntTxt = cnt => Object.entries(cnt).filter(([,n])=>n).map(([c,n])=>`${n} boule${n>1?"s":""} ${n>1?COL[c][2]:COL[c][1]}`).join(", ").replace(/, ([^,]*)$/," et $1");

CH["5e-16"] = {
intro:"Le vocabulaire des probabilités (expérience aléatoire, issue, événement), l'échelle de probabilité, le calcul d'une probabilité quand les issues sont équiprobables, et le lien entre fréquences et probabilité.",
savoir:[
  "utiliser le vocabulaire des probabilités : expérience aléatoire, issue, événement ;",
  "placer un événement sur une échelle de probabilité ;",
  "calculer une probabilité dans une situation d'équiprobabilité ;",
  "exprimer une probabilité sous forme de fraction, de nombre décimal ou de pourcentage ;",
  "relier fréquences observées et probabilité."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Expériences aléatoires", h:`
  <div class="retenir" data-l="Définition"><p>Une <b>expérience aléatoire</b> est une expérience dont on connaît tous les résultats possibles, appelés <b>issues</b>.</p><p>Mais on ne peut pas prévoir le résultat à l'avance.</p></div>
  <div class="retenir" data-l="Définition"><p>Un <b>événement</b> est un ensemble d'issues.</p><p>Un événement qui est toujours réalisé est <b>certain</b>.</p><p>Un événement qui ne peut pas être réalisé est <b>impossible</b>.</p></div>
  <p><b>Exemple :</b> on lance un dé équilibré à 6 faces.</p>
  <ul><li>Les issues sont 1, 2, 3, 4, 5 et 6.</li><li>L'événement « obtenir un nombre pair » est réalisé par les issues 2, 4 et 6.</li><li>L'événement « obtenir 7 » est impossible.</li><li>L'événement « obtenir un nombre inférieur à 7 » est certain.</li></ul>`},
{k:"II", t:"Probabilité d'un événement", h:`
  <div class="retenir" data-l="Définition"><p>La <b>probabilité</b> d'un événement est un nombre compris entre 0 et 1 qui mesure ses « chances » de se réaliser.</p><p>Un événement impossible a pour probabilité 0.</p><p>Un événement certain a pour probabilité 1.</p></div>
  <p>Une probabilité peut s'écrire sous forme d'une fraction, d'un nombre décimal ou d'un pourcentage.</p>
  <p><b>Exemple :</b> « une chance sur quatre » se traduit par :</p><p class="calc">{1/4} = 0,25 = 25 %</p>
  <div class="retenir" data-l="Propriété"><p>Si toutes les issues ont la même probabilité (on dit qu'elles sont <b>équiprobables</b>), alors la probabilité d'un événement est :</p><p class="calc">{nombre d'issues favorables/nombre total d'issues}</p></div>
  <p><b>Exemple :</b> dans un sac, il y a 3 boules rouges et 5 boules bleues. On tire une boule au hasard.</p>
  <p>La probabilité p de tirer une boule rouge est :</p><p class="calc">p = {3/8}<br>p = 0,375<br>p = 37,5 %</p>
  <h4>L'échelle de probabilité</h4>
  <p>On peut placer des événements sur une <b>échelle de probabilité</b> :</p>
  <ul><li>A est impossible ;</li><li>B est « obtenir 4 en lançant un dé » ;</li><li>C est « obtenir pile en lançant une pièce équilibrée » ;</li><li>D est certain.</li></ul>
  ${co("echelle","Échelle de probabilité de 0 à 1 : A en 0, B vers un sixième, C en 0,5 et D en 1",620)}
  <p><b>À toi de jouer :</b> dans un sac, il y a 2 boules vertes et 6 boules jaunes.</p><p>Quelle est la probabilité de tirer une boule verte ?</p>
  <details><summary>Voir la correction</summary><div class="corr"><p>Il y a 2 + 6 = 8 boules, dont 2 vertes.</p><p>La probabilité p de tirer une boule verte :</p><p class="calc">p = {2/8}<br>p = {1/4}<br>p = 0,25<br>p = 25 %</p></div></details>`},
{k:"III", t:"Fréquences et probabilité", h:`
  <p>Quand on <b>répète</b> une expérience aléatoire, on note les résultats dans un tableau d'effectifs.</p><p>On calcule les <b>fréquences</b> d'apparition.</p>
  <div class="retenir" data-l="À retenir"><p>Si le nombre de répétitions est grand, les fréquences observées se rapprochent de la probabilité.</p></div>
  <p><b>Exemple :</b> on lance une pièce équilibrée.</p>
  <div class="scroll"><table class="std"><thead><tr><th>Nombre de lancers</th><th>10</th><th>100</th><th>1 000</th></tr></thead><tbody><tr><th>Nombre de piles</th><td>7</td><td>54</td><td>506</td></tr><tr><th>Fréquence de pile</th><td>0,7</td><td>0,54</td><td>0,506</td></tr></tbody></table></div>
  <p class="attention"><b>ATTENTION :</b> le hasard n'a pas de mémoire. Même après 5 « pile » de suite, la probabilité d'obtenir « pile » au lancer suivant reste {1/2}.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Expériences aléatoires", e:[
  {n:"Activité 1", t:"Tirer une boule", w:"Sur ta feuille", h:`<p>Un sac opaque contient 3 boules rouges, 2 boules bleues et 1 boule verte.</p><p>Les boules sont indiscernables au toucher. On tire une boule au hasard.</p>${ex("act1","Un sac avec 3 boules rouges, 2 boules bleues et 1 boule verte",300)}
   <p><b>1)</b> Combien y a-t-il d'issues possibles ?</p><p><b>2)</b> Quel est l'événement le plus probable : « tirer une boule rouge », « tirer une boule bleue » ou « tirer une boule verte » ?</p><p><b>3)</b> Peut-on être certain de tirer une boule rouge ? Peut-on tirer une boule jaune ?</p>`,
   c:`<p><b>1)</b> La boule tirée peut être rouge, bleue ou verte.</p><p>Il y a donc <b>3 issues</b> possibles : « rouge », « bleue » et « verte ».</p><p><b>2)</b> <b>« Tirer une boule rouge »</b> : il y a 3 boules rouges, plus que de boules bleues ou vertes.</p><p><b>3)</b> <b>Non</b> : il y a aussi des boules bleues et une verte.</p><p><b>Non</b> : il n'y a pas de boule jaune, l'événement est <b>impossible</b>.</p>`},
  {n:"Exercice 1", t:"Vocabulaire", w:"Sur ton cahier", h:`<p>On lance un dé équilibré à 6 faces.</p><p><b>a)</b> Quelles sont les issues possibles ?</p><p><b>b)</b> Quelles issues réalisent l'événement « obtenir un multiple de 3 » ? « obtenir un diviseur de 6 » ?</p><p><b>c)</b> Donne un événement certain et un événement impossible pour cette expérience.</p>`,
   c:`<p><b>a)</b> 1, 2, 3, 4, 5, 6.</p><p><b>b)</b> Multiple de 3 : <b>3 et 6</b>.</p><p>Diviseur de 6 : <b>1, 2, 3 et 6</b>.</p><p><b>c)</b> Par exemple : « obtenir un nombre inférieur ou égal à 6 » est <b>certain</b>.</p><p>« Obtenir 10 » est <b>impossible</b>.</p>`}
 ]},
{t:"Probabilité d'un événement", e:[
  {n:"Exercice 2", t:"Échelle de probabilité", w:"Sur ta feuille", h:`<p>Voici sept événements. Place sur l'échelle la lettre de chaque événement.</p>
   <ul><li><b>A :</b> un événement impossible</li><li><b>B :</b> un événement certain</li><li><b>C :</b> obtenir « pile » en lançant une pièce équilibrée</li><li><b>D :</b> obtenir 4 en lançant un dé équilibré à 6 faces</li><li><b>E :</b> tirer la boule bleue dans un sac de 4 boules identiques dont une seule est bleue</li><li><b>F :</b> ne pas gagner en jouant au loto</li><li><b>G :</b> obtenir 10 fois de suite le 1 en lançant un dé à 6 faces</li></ul>
   ${ex("e2","Échelle de probabilité vide, de 0 (impossible) à 1 (certain)",620)}`,
   c:`${cr("e2c","Échelle de probabilité : A en 0, G près de 0, D vers 0,17, E en 0,25, C en 0,5, F près de 1 et B en 1",620)}<p>A : probabilité <b>0</b>.</p><p>B : probabilité <b>1</b>.</p><p>C : <b>{1/2}</b>.</p><p>D : <b>{1/6}</b> ≈ 0,17.</p><p>E : <b>{1/4}</b> = 0,25.</p><p>F : <b>très proche de 1</b> (gagner au loto est très rare).</p><p>G : <b>très proche de 0</b> (c'est extrêmement rare).</p>`},
  {n:"Exercice 3", t:"Probabilités avec un dé", w:"Sur ton cahier", h:`<p>On lance un dé équilibré à 6 faces.</p><p>Donne la probabilité de chaque événement sous la forme d'une fraction irréductible, puis d'un pourcentage (arrondi à l'unité si nécessaire).</p>
   <p><b>a)</b> obtenir 6</p><p><b>b)</b> obtenir un nombre pair</p><p><b>c)</b> obtenir un nombre inférieur à 3</p><p><b>d)</b> obtenir un multiple de 3</p><p><b>e)</b> obtenir 7</p><p><b>f)</b> obtenir un nombre inférieur à 7</p>`,
   c:`<p><b>a)</b> {1/6} ≈ <b>17 %</b></p><p><b>b)</b> Issues 2, 4, 6 :</p>${KC("p",["{3/6}","<b>{1/2}</b>","<b>50 %</b>"])}<p><b>c)</b> Issues 1, 2 :</p>${KC("p",["{2/6}","<b>{1/3}</b>","≈ <b>33 %</b>"])}<p><b>d)</b> Issues 3, 6 :</p>${KC("p",["{2/6}","<b>{1/3}</b>","≈ <b>33 %</b>"])}<p><b>e)</b> <b>0</b> = 0 % (événement impossible)</p><p><b>f)</b> Événement certain :</p>${KC("p",["{6/6}","<b>1</b>","<b>100 %</b>"])}`},
  {n:"Exercice 4", t:"Un sac de boules", w:"Sur ton cahier", h:`<p>Un sac contient 2 boules rouges, 3 boules bleues et 5 boules vertes. On tire une boule au hasard.</p><p><b>a)</b> Calcule la probabilité de tirer une boule rouge, une boule bleue, une boule verte.</p><p><b>b)</b> Quelle est la probabilité de ne pas tirer une boule verte ?</p><p><b>c)</b> Exprime la probabilité de tirer une boule verte avec l'expression « une chance sur … ».</p>`,
   c:`<p><b>a)</b> Il y a 2 + 3 + 5 = 10 boules.</p><p>Rouge :</p>${KC("p",["{2/10}","<b>{1/5}</b>","<b>20 %</b>"])}<p>Bleue : <b>{3/10} = 30 %</b>.</p><p>Verte :</p>${KC("p",["{5/10}","<b>{1/2}</b>","<b>50 %</b>"])}<p><b>b)</b> Les boules non vertes sont les 5 boules rouges et bleues :</p>${KC("p",["{5/10}","<b>{1/2}</b>","<b>50 %</b>"])}<p>(Les probabilités de « verte » et de « pas verte » ont pour somme 1.)</p><p><b>c)</b> <b>Une chance sur deux.</b></p>`},
  {n:"Exercice 5", t:"La roue de loterie", w:"Sur ton cahier", h:`<p>La roue est partagée en 8 secteurs identiques.</p><p>On la fait tourner : la couleur indiquée par la flèche fixe en haut est le résultat.</p>${roue(["R","B","V","R","J","B","V","R"],{w:220,alt:"Roue de 8 secteurs : 3 rouges, 2 bleus, 2 verts et 1 jaune, avec une flèche fixe en haut"})}
   <p><b>a)</b> Quelle est la probabilité d'obtenir rouge ? bleu ? vert ? jaune ?</p><p><b>b)</b> Quelle est la probabilité d'obtenir une couleur autre que rouge ?</p><p><b>c)</b> Combien de secteurs faudrait-il colorier en jaune pour que la probabilité d'obtenir jaune soit {1/4} ?</p>`,
   c:`<p><b>a)</b> Rouge : 3 secteurs sur 8 :</p>${KC("p",["<b>{3/8}</b>","<b>0,375</b>","<b>37,5 %</b>"])}<p>Bleu :</p>${KC("p",["{2/8}","<b>{1/4}</b>","<b>25 %</b>"])}<p>Vert :</p>${KC("p",["{2/8}","<b>{1/4}</b>","<b>25 %</b>"])}<p>Jaune :</p>${KC("p",["<b>{1/8}</b>","<b>0,125</b>","<b>12,5 %</b>"])}<p><b>b)</b> 5 secteurs ne sont pas rouges :</p>${KC("p",["<b>{5/8}</b>","<b>0,625</b>","<b>62,5 %</b>"])}<p><b>c)</b> {1/4} = {2/8} : il faudrait <b>2 secteurs jaunes</b>.</p>`},
  {n:"Exercice 6", t:"Comparer des chances", w:"Sur ton cahier", h:`<p>Voici deux sacs.</p><p>Dans le sac A, il y a 2 boules rouges et 3 boules bleues.</p><p>Dans le sac B, il y a 3 boules rouges et 5 boules bleues.</p><div class="figs"><figure><figcaption>Sac A</figcaption>${ex("e6a","Sac A : 2 boules rouges et 3 boules bleues",230)}</figure><figure><figcaption>Sac B</figcaption>${ex("e6b","Sac B : 3 boules rouges et 5 boules bleues",290)}</figure></div>
   <p><b>a)</b> Dans quel sac a-t-on le plus de chances de tirer une boule rouge ? Justifie par un calcul.</p><p><b>b)</b> On ajoute 2 boules rouges dans le sac A. Quelle est la nouvelle probabilité de tirer une boule rouge ?</p>`,
   c:`<p><b>a)</b> Sac A :</p>${KC("p",["{2/5}","0,4","40 %"])}<p>Sac B :</p>${KC("p",["{3/8}","0,375","37,5 %"])}<p>Comme 0,4 &gt; 0,375, c'est dans le <b>sac A</b> qu'on a le plus de chances.</p><p><b>b)</b> Le sac A contient maintenant 4 boules rouges sur 7 boules : <b>{4/7}</b> ≈ 0,57, soit environ <b>57 %</b>.</p>`},
  {n:"Exercice 7", t:"Hasard et idées fausses", w:"Sur ton cahier", h:`<p><b>a)</b> Lise lance une pièce équilibrée et obtient 5 fois « pile » de suite.</p><p>Elle affirme : « Au prochain lancer, j'ai plus de chances d'obtenir face. »</p><p>A-t-elle raison ?</p><p><b>b)</b> Un sac contient 1 boule rouge et 99 boules bleues.</p><p>Tom dit : « Je tire une boule : c'est sûr que ce sera une bleue. »</p><p>Corrige son affirmation.</p>`,
   c:`<p><b>a)</b> <b>Non</b> : la pièce n'a pas de mémoire.</p><p>La probabilité d'obtenir « face » reste {1/2} à chaque lancer.</p><p><b>b)</b> Il est <b>très probable</b> de tirer une bleue (probabilité {99/100} = 99 %), mais ce n'est <b>pas certain</b>.</p><p>On peut tirer la boule rouge (probabilité {1/100} = 1 %).</p>`}
 ]},
{t:"Fréquences et probabilité", e:[
  {n:"Exercice 8", t:"Lancers de dé", w:"Sur ta feuille", h:`<p>On a lancé 60 fois un dé équilibré à 6 faces. Voici les résultats.</p><p>Complète le tableau (fréquences en pourcentage, arrondies à l'unité).</p>
   <div class="scroll"><table class="std"><thead><tr><th>Face obtenue</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th><td>8</td><td>11</td><td>9</td><td>12</td><td>10</td><td>10</td><td></td></tr><tr><th>Fréquence</th><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></div>
   <p>Compare ces fréquences à la probabilité théorique d'obtenir chaque face.</p><p>Que constates-tu ? Réponds sur ton cahier.</p>`,
   c:`<p>Fréquence = effectif ÷ 60. Par exemple, 8 ÷ 60 ≈ 0,13, soit 13 %.</p><div class="scroll"><table class="std"><thead><tr><th>Face obtenue</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th><td>8</td><td>11</td><td>9</td><td>12</td><td>10</td><td>10</td><td><b>60</b></td></tr><tr><th>Fréquence</th><td><b>13 %</b></td><td><b>18 %</b></td><td><b>15 %</b></td><td><b>20 %</b></td><td><b>17 %</b></td><td><b>17 %</b></td><td><b>100 %</b></td></tr></tbody></table></div>
   <p>Probabilité théorique de chaque face : {1/6} ≈ 17 %.</p><p>Les fréquences observées (de 13 % à 20 %) sont <b>proches de 17 %</b>, sans lui être exactement égales.</p><p>Avec un plus grand nombre de lancers, elles s'en rapprocheraient encore.</p>`},
  {n:"Exercice 9", t:"Une expérience en classe", w:"Sur ta feuille", h:`<p>Avec ta voisine ou ton voisin, lance 20 fois une pièce de monnaie. Complète le tableau.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Résultat</th><th>Pile</th><th>Face</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th><td></td><td></td><td>20</td></tr><tr><th>Fréquence</th><td></td><td></td><td>1</td></tr></tbody></table></div>
   <p>Compare ta fréquence de « pile » à celles des autres élèves de la classe et à la probabilité théorique.</p><p>Que remarques-tu ? Réponds sur ton cahier.</p>`,
   c:`<p>Les résultats varient d'un binôme à l'autre.</p><p>Par exemple, avec 9 « pile » et 11 « face » :</p><div class="scroll"><table class="std"><thead><tr><th>Résultat</th><th>Pile</th><th>Face</th><th>Total</th></tr></thead><tbody><tr><th>Effectif</th><td><b>9</b></td><td><b>11</b></td><td>20</td></tr><tr><th>Fréquence</th><td><b>0,45</b></td><td><b>0,55</b></td><td>1</td></tr></tbody></table></div><p>Fréquence de « pile » : 9 ÷ 20 = 0,45.</p><p>Fréquence de « face » : 11 ÷ 20 = 0,55.</p><p>La probabilité théorique de « pile » est {1/2} = 0,5.</p><p>Les fréquences observées sont <b>proches de 0,5</b>, mais rarement égales.</p><p>En regroupant les résultats de toute la classe (plus de lancers), on se rapproche davantage de 0,5.</p>`},
  {n:"Exercice 10", t:"Pour aller plus loin : construire un sac", w:"Sur ton cahier", h:`<p><b>a)</b> Un sachet contient 12 bonbons. La probabilité de tirer un bonbon à la fraise est {1/4}.</p><p>Combien y a-t-il de bonbons à la fraise ?</p><p><b>b)</b> Un sac contient 3 boules rouges et 1 boule bleue.</p><p>Combien faut-il ajouter de boules bleues pour que la probabilité de tirer une boule bleue soit {1/2} ?</p><p><b>c)</b> Dans un sac de 20 boules, 5 sont rouges. On veut que la probabilité de tirer une rouge soit de 50 %.</p><p>Combien faut-il ajouter de boules rouges ? (Attention : le nombre total de boules change.)</p>`,
   c:`<p><b>a)</b> 12 × {1/4} = 3 : il y a <b>3 bonbons à la fraise</b>.</p><p><b>b)</b> Il y a déjà 3 rouges. Pour une probabilité de {1/2}, il faut autant de bleues que de rouges : 3 bleues au total.</p><p>On ajoute <b>2 boules bleues</b>.</p><p><b>c)</b> Il y a 15 boules non rouges. Pour que la moitié des boules soient rouges, il faut 15 rouges au total.</p><p>On ajoute <b>10 boules rouges</b> (et {15/30} = {1/2}).</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Expériences aléatoires", schema:S_EXP, q:{
 1:[ {g:()=>{ const e=pick(DE); return {q:`On lance un dé à 6 faces. Quelles issues réalisent l'événement « ${e[0]} » ?`, c:shuf(uniq(lst(e[1]), shuf(DE.filter(d=>d!==e).map(d=>lst(d[1])))).slice(0,3)), rep:lst(e[1]), ex:`Parmi 1, 2, 3, 4, 5 et 6, ce sont : ${lst(e[1])}.`, sx:S_EXP}; }},
     {q:"On lance un dé à 6 faces. Combien y a-t-il d'issues possibles ?", c:["6","1","7"], rep:"6", ex:"Les issues sont 1, 2, 3, 4, 5 et 6.", sx:S_EXP} ],
 2:[ {g:()=>{ const E=[[`obtenir ${ri(7,12)}`,"impossible"],["obtenir 0","impossible"],[`obtenir un nombre inférieur à ${ri(7,10)}`,"certain"],["obtenir un nombre inférieur ou égal à 6","certain"],["obtenir un nombre pair","ni certain, ni impossible"],[`obtenir ${ri(1,6)}`,"ni certain, ni impossible"]]; const e=pick(E);
       return {q:`On lance un dé à 6 faces. L'événement « ${e[0]} » est :`, c:["certain","impossible","ni certain, ni impossible"], rep:e[1], ex:e[1]==="certain"?"Toutes les issues le réalisent : il est toujours réalisé.":e[1]==="impossible"?"Aucune issue ne le réalise.":"Certaines issues le réalisent, d'autres non.", sx:S_EXP}; }} ],
 3:[ {g:()=>{ const cs=shuf(["R","B","V"]), n=shuf([1,2,ri(3,5)]); const cnt={}; cs.forEach((c,i)=>cnt[c]=n[i]); const best=cs[n.indexOf(Math.max(...n))];
       return {q:`Un sac contient ${cntTxt(cnt)}. On tire une boule au hasard. Quel est l'événement le plus probable ?`, fig:sac(shuf(bagList(cnt))), c:cs.map(c=>`tirer une boule ${COL[c][1]}`), rep:`tirer une boule ${COL[best][1]}`, ex:`Il y a plus de boules ${COL[best][2]} que de boules des autres couleurs.`, sx:S_EXP}; }},
     {g:()=>{ const n=pick([49,99,199]); return {q:`Un sac contient 1 boule rouge et ${n} boules bleues. Vrai ou faux : tirer une boule bleue est un événement certain.`, c:VF, rep:"Faux", ex:`C'est très probable, mais pas certain : on peut tirer la boule rouge.`, sx:S_EXP}; }} ]
}},
{nom:"Probabilité et échelle", schema:S_ECH, q:{
 1:[ {g:()=>{ const t=pick([["impossible","0"],["certain","1"]]); return {q:`Un événement ${t[0]} a pour probabilité :`, c:["0","1","{1/2}"], rep:t[1], ex:"Impossible : 0. Certain : 1.", sx:S_ECH}; }},
     {q:"Une probabilité est toujours un nombre compris entre :", c:["0 et 1","0 et 100","1 et 10"], rep:"0 et 1", ex:"0 pour un événement impossible, 1 pour un événement certain.", sx:S_ECH} ],
 2:[ {g:()=>{ const f=pick([[1,2],[1,4],[3,4],[1,5],[2,5],[1,10],[3,10],[1,8],[3,8],[1,20]]); const p=f[0]*100/f[1];
       return {q:`Quel pourcentage est égal à ${Fr(f[0],f[1])} ?`, c:shuf(uniq(`${D(p)} %`,[`${f[0]*10+f[1]} %`,`${f[1]} %`,`${D(p/10)} %`,`${f[0]} %`]).slice(0,3)), rep:`${D(p)} %`, ex:KCi("p",[Fr(f[0],f[1]),D(f[0]/f[1]),`${D(p)} %`]), sx:S_ECH}; }},
     {g:()=>{ const k=pick([2,3,4,5,6]); return {q:`« Une chance sur ${["","","deux","trois","quatre","cinq","six"][k]} » se traduit par la probabilité :`, c:shuf([Fr(1,k),String(k),"0,"+k]), rep:Fr(1,k), ex:`Une chance sur ${k} : ${Fr(1,k)}.`, sx:S_ECH}; }} ],
 3:[ {g:()=>{ const EV=[["obtenir pile avec une pièce équilibrée",1/2],["obtenir 4 avec un dé à 6 faces",1/6],["tirer la boule bleue dans un sac de 4 boules dont une seule est bleue",1/4],["un événement certain",1],["un événement impossible",0],["tirer une boule rouge dans un sac de 3 rouges et 1 bleue",3/4]];
       const ch=shuf(EV).slice(0,3), lab=shuf(["A","B","C"]); const pts=ch.map((e,i)=>[lab[i],e[1]]); const k=ri(0,2);
       return {q:`Sur l'échelle, quel point correspond à l'événement « ${ch[k][0]} » ?`, fig:echelle(pts,{w:560}), c:["A","B","C"], rep:lab[k], ex:`Sa probabilité est ${ch[k][1]===0?"0":ch[k][1]===1?"1":irrOnly(Math.round(ch[k][1]*12),12)}.`, sx:S_ECH}; }},
     {g:()=>{ const v=pick(["1,5","120 %","−0,2","{5/4}"]); return {q:`Vrai ou faux : une probabilité peut être égale à ${v}.`, c:VF, rep:"Faux", ex:"Une probabilité est toujours comprise entre 0 et 1 (entre 0 % et 100 %).", sx:S_ECH}; }} ]
}},
{nom:"Calculer une probabilité", schema:S_EQ, q:{
 1:[ {g:()=>{ const k=ri(1,6); return {q:`On lance un dé équilibré à 6 faces. Quelle est la probabilité d'obtenir ${k} ?`, c:shuf(fracChoices([1,6],[[k,6],[1,k],[5,6],[1,2]])), rep:Fr(1,6), ex:"1 issue favorable sur 6 issues équiprobables.", sx:S_EQ}; }},
     {g:()=>{ let r,b; do{ r=ri(1,7); b=ri(1,7); }while(r===b); const t=r+b; return {q:`Un sac contient ${r} boule${r>1?"s":""} rouge${r>1?"s":""} et ${b} boule${b>1?"s":""} bleue${b>1?"s":""}. Quelle est la probabilité de tirer une boule rouge ?`, fig:sac(shuf(bagList({R:r,B:b}))), c:shuf(fracChoices([r,t],[[b,t],[r,b],[1,t],[1,r]])), rep:irrOnly(r,t), ex:`${r} boules rouges sur ${t} boules : ${irr(r,t)}.`, sx:S_EQ}; }} ],
 2:[ {g:()=>{ const e=pick(DE); const n=e[1].length; return {q:`On lance un dé à 6 faces. Quelle est la probabilité de l'événement « ${e[0]} » ?`, c:shuf(fracChoices([n,6],[[1,6],[n,6-n],[6-n,6],[1,n],[n+1,6]])), rep:irrOnly(n,6), ex:`Issues favorables : ${lst(e[1])}. ${irr(n,6)}.`, sx:S_EQ}; }},
     {g:()=>{ const n=8; let cnt; do{ const a=ri(1,4), b=ri(1,3), c=ri(1,3); cnt={R:a,B:b,V:c,J:n-a-b-c}; }while(cnt.J<1); const L=["R","B","V","J"].flatMap(c=>Array(cnt[c]).fill(c)); const c=pick(["R","B","V","J"]);
       return {q:`La roue est partagée en 8 secteurs identiques. Quelle est la probabilité d'obtenir ${COLm[c]} ?`, fig:roue(shuf(L)), c:shuf(fracChoices([cnt[c],8],[[1,8],[cnt[c]+1,8],[8-cnt[c],8],[1,cnt[c]+1],[cnt[c],8-cnt[c]]])), rep:irrOnly(cnt[c],8), ex:`${cnt[c]} secteur${cnt[c]>1?"s":""} ${COLm[c]}${cnt[c]>1?"s":""} sur 8 : ${irr(cnt[c],8)}.`, sx:S_EQ}; }} ],
 3:[ {g:()=>{ const cnt={R:ri(1,5),B:ri(1,5),V:ri(2,6)}, t=cnt.R+cnt.B+cnt.V, nv=t-cnt.V; return {q:`Un sac contient ${cntTxt(cnt)}. Quelle est la probabilité de ne pas tirer une boule verte ?`, fig:sac(shuf(bagList(cnt))), c:shuf(fracChoices([nv,t],[[cnt.V,t],[nv,cnt.V],[1,t],[cnt.R,t]])), rep:irrOnly(nv,t), ex:`${nv} boules ne sont pas vertes, sur ${t} : ${irr(nv,t)}.`, sx:S_EQ}; }},
     {g:()=>{ let a,b,c,d; do{ a=ri(1,5); b=ri(1,6); c=ri(1,5); d=ri(1,6); }while(Math.round(a*100/(a+b))===Math.round(c*100/(c+d))); const pA=a/(a+b), pB=c/(c+d);
       return {q:`Sac A : ${a} rouge${a>1?"s":""} et ${b} bleue${b>1?"s":""}. Sac B : ${c} rouge${c>1?"s":""} et ${d} bleue${d>1?"s":""}. Dans quel sac a-t-on le plus de chances de tirer une boule rouge ?`, c:["Sac A","Sac B"], rep:pA>pB?"Sac A":"Sac B", ex:`Sac A : ${Fr(a,a+b)} ${decOk(a,a+b)?"=":"≈"} ${D(decOk(a,a+b)?pA:Math.round(pA*100)/100)}. Sac B : ${Fr(c,c+d)} ${decOk(c,c+d)?"=":"≈"} ${D(decOk(c,c+d)?pB:Math.round(pB*100)/100)}. On compare les probabilités, pas les nombres de boules.`, sx:S_EQ}; }},
     {g:()=>{ const k=pick([2,3,4,5,6]), N=k*ri(2,6), m=pick([1,1,2,3].filter(x=>x<k && gcd(x,k)===1)); return {q:`Un sachet contient ${N} bonbons. La probabilité de tirer un bonbon à la fraise est ${Fr(m,k)}. Combien y a-t-il de bonbons à la fraise ?`, rep:String(N*m/k), ex:`${N} × ${Fr(m,k)} = ${N*m/k}.`, sx:S_EQ}; }} ]
}},
{nom:"Fréquences et probabilité", schema:S_FREQ, q:{
 1:[ {g:()=>{ const n=ri(3,8); return {q:`Lise lance une pièce équilibrée et obtient ${n} fois « pile » de suite. Quelle est la probabilité d'obtenir « face » au lancer suivant ?`, c:["{1/2}","plus de {1/2}","moins de {1/2}"], rep:"{1/2}", ex:"Le hasard n'a pas de mémoire : la probabilité reste {1/2}.", sx:S_FREQ}; }} ],
 2:[ {g:()=>{ const N=pick([10,20,50,100]), k=ri(1,N-1); return {q:`On lance une pièce ${N} fois et on obtient ${k} fois « pile ». Quelle est la fréquence de « pile » (en nombre décimal) ?`, rep:D(k/N), ex:`${k} ÷ ${N} = ${D(k/N)}.`, sx:S_FREQ}; }} ],
 3:[ {g:()=>{ const k=ri(5,15); return {q:`On lance un dé 60 fois. La face 4 sort ${k} fois. Quelle est sa fréquence en pourcentage, arrondie à l'unité ?`, rep:[String(Math.round(k*100/60)), Math.round(k*100/60)+" %"], ex:`${k} ÷ 60 ${decOk(k,60)?"=":"≈"} ${D(Math.round(k*1000/60)/1000)}, soit ${Number.isInteger(k*100/60)?"":"environ "}${Math.round(k*100/60)} %.`, sx:S_FREQ}; }},
     {q:"On répète une expérience un très grand nombre de fois. Les fréquences observées se rapprochent alors…", c:["de la probabilité","de 0","de 1"], rep:"de la probabilité", ex:"Plus le nombre de répétitions est grand, plus la fréquence se rapproche de la probabilité.", sx:S_FREQ} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const ROUE = roue(["B","R","B","V","B","R","B","J"],{w:210,alt:"Roue de 8 secteurs identiques : 4 bleus, 2 rouges, 1 vert et 1 jaune, avec une flèche fixe en haut"});
const CARTES = `<p>Dans une boîte, il y a 12 cartes numérotées de 1 à 12, indiscernables au toucher. On tire une carte au hasard.</p><p>Donne chaque probabilité sous la forme d'une fraction irréductible.</p>`;
const C1 = {
  a:`Les issues sont 1, 2, 3, …, 12 : il y a <b>12 issues</b>, toutes équiprobables.`,
  b:`Une seule carte porte le numéro 7 : la probabilité est <b>{1/12}</b>.`,
  c:`Les multiples de 3 sont 3, 6, 9 et 12 : 4 issues favorables sur 12.</p><p class="calc">{4/12} = {1/3}</p><p>La probabilité est <b>{1/3}</b>.`,
  d:`Les nombres impairs sont 1, 3, 5, 7, 9 et 11 : 6 issues favorables sur 12.</p><p class="calc">{6/12} = {1/2}</p><p>La probabilité est <b>{1/2}</b>.`,
  e:`Aucune carte ne porte un nombre plus grand que 20 : l'événement est <b>impossible</b>, sa probabilité est <b>0</b>.`
};
const ROUEh = `<p>La roue est partagée en 8 secteurs identiques. On la fait tourner : la couleur indiquée par la flèche est le résultat.</p>${ROUE}`;
const SAC = `<p>Un sachet contient 20 bonbons de même forme : 8 à la fraise, 7 au citron, et les autres à l'orange. Noah prend un bonbon au hasard, sans regarder.</p>`;
const S1 = `1. 20 − 8 − 7 = 5 : il y a <b>5 bonbons à l'orange</b>.`;
const S2 = `2. 7 bonbons au citron sur 20 bonbons :</p><p class="calc">p = {7/20}<br>p = {35/100}<br>p = 35 %</p><p>La probabilité est <b>{7/20}</b>, soit <b>35 %</b>.`;
const S3 = n => `${n}. Fréquence de la fraise : 22 fois sur 50 tirages.</p><p class="calc">f = {22/50}<br>f = {44/100}<br>f = 44 %</p><p>Probabilité de tirer un bonbon à la fraise : 8 bonbons sur 20.</p><p class="calc">p = {8/20}<br>p = {40/100}<br>p = 40 %</p><p>La fréquence observée (<b>44 %</b>) est <b>proche</b> de la probabilité (<b>40 %</b>), sans lui être égale. Avec beaucoup plus de tirages, la fréquence se rapprocherait de 40 %.`;
const COMP = (a,b) => [
  ["CALCULER","Je calcule une probabilité, je l'écris sous forme de fraction irréductible ou de pourcentage, et je place des événements sur une échelle de probabilité.",`Ex. 1 et 2 (${a} points)`],
  ["CHERCHER","Je résous un problème de probabilités et je compare une fréquence à une probabilité.",`Ex. 3 (${b} points)`]
];
const INFO = "Durée : 25 min · Calculatrice non autorisée";
return {
titre:"Évaluation d'entraînement — Chapitre 16", duree:25, info:INFO,
comp:COMP(6,4),
exos:[
{t:"Tirer une carte", p:4, h:`${CARTES}<p>a) Combien y a-t-il d'issues possibles ?</p><p>b) Quelle est la probabilité de tirer la carte numéro 7 ?</p><p>c) Quelle est la probabilité de tirer un multiple de 3 ?</p><p>d) Quelle est la probabilité de tirer un nombre impair ?</p><p>e) Quelle est la probabilité de tirer un nombre plus grand que 20 ? Comment appelle-t-on cet événement ?</p>`,
 c:`<p>Probabilité = {nombre d'issues favorables/nombre total d'issues}.</p><p>a) ${C1.a} <i>(0,5 point)</i></p><p>b) ${C1.b} <i>(0,5 point)</i></p><p>c) ${C1.c} <i>(1 point)</i></p><p>d) ${C1.d} <i>(1 point)</i></p><p>e) ${C1.e} <i>(1 point)</i></p>`},
{t:"Une roue et une échelle de probabilité", p:2, h:`${ROUEh}<p>Calcule la probabilité de chaque événement, puis place sa lettre sur l'échelle de probabilité.</p><p><b>A</b> : « obtenir bleu »</p><p><b>B</b> : « obtenir rouge »</p><p><b>C</b> : « obtenir violet »</p><p><b>D</b> : « ne pas obtenir vert »</p>${echelle([],{w:560})}`,
 c:`<p>Il y a 8 secteurs identiques : 4 bleus, 2 rouges, 1 vert et 1 jaune.</p><p>A :</p><p class="calc">p = {4/8}<br>p = <b>{1/2}</b><br>p = 0,5</p><p>B :</p><p class="calc">p = {2/8}<br>p = <b>{1/4}</b><br>p = 0,25</p><p>C : il n'y a pas de secteur violet : probabilité <b>0</b> (impossible).</p><p>D : 7 secteurs ne sont pas verts : <b>{7/8}</b> = 0,875.</p>${echelle([["A",0.5],["B",0.25],["C",0],["D",0.875]],{w:560})}<p><i>0,5 point par événement (probabilité et place sur l'échelle).</i></p>`},
{t:"Le sachet de bonbons", p:4, h:`${SAC}
  <p>1. Combien y a-t-il de bonbons à l'orange ?</p><p>2. Quelle est la probabilité que Noah prenne un bonbon au citron ? Donne-la sous forme de fraction, puis de pourcentage.</p><p>3. Noah répète l'expérience 50 fois, en remettant le bonbon dans le sachet à chaque fois. Il obtient 22 fois un bonbon à la fraise. Calcule la fréquence de la fraise en pourcentage, puis compare-la à la probabilité de tirer un bonbon à la fraise.</p><p>4. Noah vient de tirer trois fois de suite un bonbon à la fraise. Il dit : « Au prochain tirage, j'aurai sûrement un autre parfum. » A-t-il raison ? Explique.</p>`,
 c:`<p>${S1} <i>(0,5 point)</i></p><p>${S2} <i>(1 point)</i></p><p>${S3(3)} <i>(1,5 point : 0,5 pour la fréquence, 0,5 pour la probabilité, 0,5 pour la comparaison)</i></p>
  <p>4. <b>Non</b> : le hasard n'a pas de mémoire. Le bonbon est remis dans le sachet, donc la probabilité de tirer un bonbon à la fraise reste {8/20} = {2/5} à chaque tirage. Ce n'est pas « sûr » : il peut encore tirer la fraise. <i>(1 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 16 · version aménagée", duree:25, info:"Version aménagée · "+INFO,
note:"Même durée, avec environ une question sur cinq en moins (les questions restantes sont renumérotées). Toujours sur 10 : les points sont répartis sur les questions gardées. Les justifications restent demandées.",
comp:COMP("6,5","3,5"),
exos:[
{t:"Tirer une carte", p:4.5, h:`${CARTES}<p>a) Combien y a-t-il d'issues possibles ?</p><p>b) Quelle est la probabilité de tirer un multiple de 3 ?</p><p>c) Quelle est la probabilité de tirer un nombre impair ?</p><p>d) Quelle est la probabilité de tirer un nombre plus grand que 20 ? Comment appelle-t-on cet événement ?</p>`,
 c:`<p>Probabilité = {nombre d'issues favorables/nombre total d'issues}.</p><p>a) ${C1.a} <i>(0,5 point)</i></p><p>b) ${C1.c} <i>(1,5 point)</i></p><p>c) ${C1.d} <i>(1,5 point)</i></p><p>d) ${C1.e} <i>(1 point)</i></p>`},
{t:"Une roue et une échelle de probabilité", p:2, h:`${ROUEh}<p>Calcule la probabilité de chaque événement, puis place sa lettre sur l'échelle de probabilité.</p><p><b>A</b> : « obtenir bleu »</p><p><b>B</b> : « obtenir rouge »</p><p><b>C</b> : « obtenir violet »</p>${echelle([],{w:560})}`,
 c:`<p>Il y a 8 secteurs identiques : 4 bleus, 2 rouges, 1 vert et 1 jaune.</p><p>A : <i>(0,5 point)</i></p><p class="calc">p = {4/8}<br>p = <b>{1/2}</b><br>p = 0,5</p><p>B : <i>(1 point)</i></p><p class="calc">p = {2/8}<br>p = <b>{1/4}</b><br>p = 0,25</p><p>C : il n'y a pas de secteur violet : probabilité <b>0</b> (impossible). <i>(0,5 point)</i></p>${echelle([["A",0.5],["B",0.25],["C",0]],{w:560})}`},
{t:"Le sachet de bonbons", p:3.5, h:`${SAC}
  <p>1. Combien y a-t-il de bonbons à l'orange ?</p><p>2. Quelle est la probabilité que Noah prenne un bonbon au citron ? Donne-la sous forme de fraction, puis de pourcentage.</p><p>3. Noah répète l'expérience 50 fois, en remettant le bonbon dans le sachet à chaque fois. Il obtient 22 fois un bonbon à la fraise. Calcule la fréquence de la fraise en pourcentage, puis compare-la à la probabilité de tirer un bonbon à la fraise.</p>`,
 c:`<p>${S1} <i>(0,5 point)</i></p><p>${S2} <i>(1,5 point)</i></p><p>${S3(3)} <i>(1,5 point : 0,5 pour la fréquence, 0,5 pour la probabilité, 0,5 pour la comparaison)</i></p>`}
]}
};
})()
};
})();
