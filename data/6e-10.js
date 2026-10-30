/* 6e — Chapitre 10 : La division (cours et fiche d'exercices de M. Staal)
   Les divisions posées des corrections sont dessinées par pot() : elles sont calculées, pas recopiées. */
(function(){
const VF = ["Vrai","Faux"];
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const co = (p,alt,w) => img("c610co/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
/* nombre décimal à partir d'un entier n et de k chiffres après la virgule (sans zéros inutiles) */
const D = (n,k=0) => { let s=String(Math.abs(n)).padStart(k+1,"0"); let a=s.slice(0,s.length-k), b=k?s.slice(-k):""; b=b.replace(/0+$/,""); return (n<0?"−":"")+sp(+a)+(b?","+b:""); };

/* ---------- la potence ----------
   pot("75,8", 4)              division décimale jusqu'à un reste nul (6 décimales au plus)
   pot("872", 11, {dec:4})     division décimale arrêtée à 4 décimales (… si le reste n'est pas nul)
   pot("935", 7, {mode:"euc"}) division euclidienne                                          */
function pot(dvd, dvs, o={}){
  const [ip, fp=""] = String(dvd).replace(/\s/g,"").split(",");
  const D0 = (ip+fp).split("").map(Number), ci = ip.length, given = D0.length;
  const euc = o.mode==="euc", maxDec = euc ? 0 : (o.dec ?? 6);
  const digs = D0.map(d=>({d, red:false}));
  const rows = []; let q="", cur=0, rem=0, startedQ=false, shown=false, last=null, i=0;
  while(i < given || (!euc && (rem!==0 || !startedQ) && (i-ci) < maxDec)){
    if(i >= given) digs.push({d:0, red:true});
    const d = digs[i].d;
    cur = cur*10 + d;
    if(shown && last){ last.c.push({ch:String(d), red:digs[i].red}); last.end=i; }
    if(i===ci && startedQ) q += ",";
    if(!(startedQ || cur>=dvs || i>=ci-1)){ i++; continue; }
    startedQ = true;
    const qd = Math.floor(cur/dvs), pr = qd*dvs; q += qd; rem = cur - pr;
    if(qd===0 && !shown){ cur = rem; i++; continue; }
    if(qd>0){
      shown = true;
      rows.push({c:("−"+pr).split("").map(ch=>({ch})), end:i, under:true});
      last = {c:String(rem).split("").map(ch=>({ch})), end:i};
      rows.push(last);
    }
    cur = rem; i++;
  }
  if(!euc && rem!==0) q += "…";
  /* dessin */
  const cw=13, rh=22, x0=8, n=digs.length, xb = x0 + n*cw + 8;
  const qch = q.split(""), qw = qch.reduce((s,c)=>s+(c===","?cw*0.55:c==="…"?cw*1.2:cw),0);
  const W = xb + Math.max(qw, String(dvs).length*cw) + 22, H = (rows.length+1)*rh + 8;
  const T = (x,y,t,st="") => `<text x="${x.toFixed(1)}" y="${y}" text-anchor="middle" style="font-size:16px;${st}">${t}</text>`;
  let s = `<svg class="fig pot" viewBox="0 0 ${W.toFixed(0)} ${H}" width="${Math.round(W*1.45)}" style="max-width:100%" role="img" aria-label="Division posée de ${dvd} par ${dvs}">`;
  digs.forEach((g,k)=>{ s += T(x0+k*cw+cw/2, 18, g.d, g.red?"fill:#d0342c":"fill:var(--ink)"); });
  if(digs.length>ci) s += T(x0+ci*cw, 20, ",", "fill:var(--ink)");
  rows.forEach(r=>{ if(!r.under) while(r.c.length>1 && r.c[0].ch==="0") r.c.shift(); });
  rows.forEach((r,k)=>{ const y=18+(k+1)*rh, st=r.c.length;
    r.c.forEach((g,j)=>{ s += T(x0+(r.end-st+1+j)*cw+cw/2, y, g.ch, g.red?"fill:#d0342c":"fill:var(--ink)"); });
    if(r.under){ s += `<line x1="${x0+(r.end-st+1)*cw-2}" y1="${y+5}" x2="${x0+(r.end+1)*cw+2}" y2="${y+5}" style="stroke:var(--ink);stroke-width:1.3"/>`; } });
  s += `<line x1="${xb}" y1="2" x2="${xb}" y2="${H-4}" style="stroke:var(--ink);stroke-width:2"/><line x1="${xb}" y1="24" x2="${W-6}" y2="24" style="stroke:var(--ink);stroke-width:2"/>`;
  String(dvs).split("").forEach((c,k)=>{ s += T(xb+10+k*cw+cw/2, 18, c, "fill:var(--ink)"); });
  let x = xb+10; qch.forEach(c=>{ const w = c===","?cw*0.55:c==="…"?cw*1.2:cw; s += T(x+w/2, 18+rh, c, "fill:#1e5aa8;font-weight:700"); x += w; });
  return s + "</svg>";
}
window.FIG10 = {pot, D};

/* ---------- schémas ---------- */
const S_VOC = sch("Le vocabulaire", co("vocab","Division posée de 107 par 7 : dividende, diviseur, quotient, reste",260)+`<p class="calc">107 = 7 × 15 + 2 &nbsp; avec 2 &lt; 7</p><p class="schN">dividende = diviseur × quotient + reste, et le reste est <b>plus petit</b> que le diviseur.</p>`);
const S_CRIT = sch("Critères de divisibilité", `<div class="scroll"><table class="std"><tbody><tr><th>par 2</th><td>chiffre des unités 0, 2, 4, 6 ou 8</td></tr><tr><th>par 5</th><td>chiffre des unités 0 ou 5</td></tr><tr><th>par 10</th><td>chiffre des unités 0</td></tr><tr><th>par 3</th><td>somme des chiffres divisible par 3</td></tr><tr><th>par 9</th><td>somme des chiffres divisible par 9</td></tr></tbody></table></div>`);
const S_RESTE = sch("Que représente le reste ?", `<p class="calc">419 = 18 × 23 + 5</p><p class="schN">23 tours transportent 414 colis ; il reste 5 colis : il faut <b>un tour de plus</b>, soit 24 tours.</p>`);
const S_10 = sch("Diviser par 10, 100, 1 000", `<p class="calc">375 ÷ 10 = 37,5 &nbsp;·&nbsp; 375 ÷ 100 = 3,75 &nbsp;·&nbsp; 375 ÷ 1 000 = 0,375</p><p class="schN">La virgule se déplace de 1, 2 ou 3 rangs vers la <b>gauche</b>. On complète par des zéros si besoin : 4,2 ÷ 1 000 = 0,0042.</p>`);
const S_DEC = sch("La division décimale", pot("75,8",4)+`<p class="schN">Quand j'abaisse le chiffre des dixièmes, je place la virgule au quotient. J'ajoute des zéros au dividende jusqu'à un reste nul.</p>`);
const S_ARR = sch("Arrondir un quotient", `<p class="calc">872 ÷ 11 = 79,272727…</p><p class="schN">au dixième : 79,3 (le chiffre des centièmes est 7) · au centième : 79,27 (le chiffre suivant est 2).</p>`);
const S_CHOIX = sch("Euclidienne ou décimale ?", `<p class="schN">Des personnes, des objets entiers : division <b>euclidienne</b>. Une somme d'argent, une longueur, une masse, un volume : division <b>décimale</b>.</p>`);

/* données des exercices (calculées) */
const E2 = [[87,4],[365,7],[1254,9],[4507,15],[2024,24],[9876,32]];
const eg = (a,b) => `${sp(a)} = ${b} × ${Math.floor(a/b)} + ${a%b}`;
const crit = n => { const s=String(n).split("").reduce((x,c)=>x+ +c,0), u=n%10; return [u%2===0, s%3===0, u%5===0, s%9===0, u===0, s]; };
const E4 = [60,75,128,243,1035,4590];
const ok = b => b?`<b style="color:#1d7a46">✔</b>`:"";
const E12 = [["13",4],["63,5",5],["192,9",6],["3,4",8],["0,9",5],["58,2",12]];
const E12r = ["3,25","12,7","32,15","0,425","0,18","4,85"];

CH["6e-10"] = {
intro:"La division euclidienne (quotient et reste), les multiples, les diviseurs et les critères de divisibilité, diviser par 10, 100, 1 000, la division décimale et la valeur arrondie d'un quotient.",
savoir:[
  "connaître le vocabulaire : dividende, diviseur, quotient, reste ;",
  "poser une division euclidienne et écrire l'égalité correspondante ;",
  "reconnaître un multiple ou un diviseur, et utiliser les critères de divisibilité par 2, 3, 5, 9 et 10 ;",
  "utiliser la division euclidienne pour résoudre un problème (partage, groupement, conversion de durées) ;",
  "diviser un nombre décimal par 10, 100, 1 000 ;",
  "poser la division décimale d'un nombre décimal par un nombre entier ;",
  "donner une valeur arrondie d'un quotient ;",
  "choisir entre la division euclidienne et la division décimale."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"La division euclidienne", h:`
  <h4>1. Vocabulaire</h4>
  <p>On répartit 107 élèves en 7 groupes de même effectif : on peut faire 7 groupes de 15 élèves, et il reste 2 élèves.</p>
  <div class="figs">${co("vocab","Division posée de 107 par 7 : dividende 107, diviseur 7, quotient 15, reste 2",300)}</div>
  <p>On écrit : <span class="calc">107 = 7 × 15 + 2</span></p>
  <div class="retenir" data-l="Définition"><p>Effectuer la <b>division euclidienne</b> d'un nombre entier (le <b>dividende</b>) par un nombre entier non nul (le <b>diviseur</b>), c'est trouver deux nombres entiers, le <b>quotient</b> et le <b>reste</b>, tels que :</p><p class="calc">dividende = diviseur × quotient + reste, &nbsp; avec &nbsp; reste &lt; diviseur.</p></div>
  <p class="attention"><b>ATTENTION :</b> le reste est toujours plus petit que le diviseur. L'égalité 107 = 7 × 14 + 9 est vraie, mais ce n'est pas la division euclidienne de 107 par 7, car 9 &gt; 7.</p>
  <h4>2. Poser une division euclidienne</h4>
  <p><b>Exemple :</b> j'effectue la division euclidienne de 935 par 7.</p>
  <div class="cpt"><div class="retenir" data-l="Méthode"><ol><li>Je cherche le nombre de chiffres du quotient : 9 centaines, c'est plus que 7, donc le quotient commence aux centaines : il a 3 chiffres.</li><li>Je partage 9 centaines en 7 : 1 centaine (7 × 1 = 7), il reste 2 centaines.</li><li>J'abaisse le chiffre suivant : 23 dizaines en 7 : 3 dizaines (7 × 3 = 21), il reste 2.</li><li>J'abaisse le dernier chiffre : 25 unités en 7 : 3 unités (7 × 3 = 21), il reste 4. Comme 4 &lt; 7, c'est terminé.</li></ol></div>${co("d935","Division posée de 935 par 7",150)}</div>
  <p>Je conclus : <span class="calc">935 = 7 × 133 + 4</span>. Je vérifie :</p><p class="calc">A = 7 × 133 + 4<br>A = 931 + 4<br>A = 935</p>
  <h4>3. Multiples et diviseurs</h4>
  <div class="retenir" data-l="Définition"><p>Lorsque le reste de la division euclidienne de a par b est nul, on dit que a est un <b>multiple</b> de b, que b est un <b>diviseur</b> de a, ou que a est <b>divisible</b> par b.</p></div>
  <p><b>Exemple :</b> 84 = 7 × 12 + 0. Donc 84 est un multiple de 7 ; 7 est un diviseur de 84 ; 84 est divisible par 7.</p>
  <div class="retenir" data-l="Critères de divisibilité"><div class="scroll"><table class="std"><thead><tr><th>Un nombre entier est divisible…</th><th>si…</th></tr></thead><tbody><tr><th>par 2</th><td>son chiffre des unités est 0, 2, 4, 6 ou 8 (il est pair)</td></tr><tr><th>par 5</th><td>son chiffre des unités est 0 ou 5</td></tr><tr><th>par 10</th><td>son chiffre des unités est 0</td></tr><tr><th>par 3</th><td>la somme de ses chiffres est divisible par 3</td></tr><tr><th>par 9</th><td>la somme de ses chiffres est divisible par 9</td></tr></tbody></table></div></div>
  <p><b>Exemple :</b> 2 745 se termine par 5 : il est divisible par 5, mais pas par 2 ni par 10. La somme de ses chiffres est 2 + 7 + 4 + 5 = 18 : 2 745 est divisible par 3 et par 9.</p>
  <h4>4. Utiliser la division euclidienne</h4>
  <p><b>Exemple 1 :</b> un transporteur doit livrer 419 colis. Son camion contient au maximum 18 colis. Combien de tours doit-il faire ?</p>
  <p>419 = 18 × 23 + 5. En 23 tours, il transporte 414 colis ; il reste 5 colis, donc il faut un tour de plus. <b>Il doit faire 24 tours.</b></p>
  <p class="attention"><b>ATTENTION :</b> je me demande toujours ce que représente le reste pour bien répondre à la question.</p>
  <p><b>Exemple 2 :</b> convertir 250 min en heures et minutes (voir le chapitre 7 — Les durées). 1 h = 60 min et 250 = 60 × 4 + 10, donc <b>250 min = 4 h 10 min</b>.</p>`},
{k:"II", t:"Diviser par 10, 100, 1 000", h:`
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Je divise par…</th><th>Exemple</th><th>La virgule se déplace…</th></tr></thead><tbody><tr><th>10</th><td>375 ÷ 10 = 37,5</td><td>d'1 rang vers la gauche</td></tr><tr><th>100</th><td>375 ÷ 100 = 3,75</td><td>de 2 rangs vers la gauche</td></tr><tr><th>1 000</th><td>375 ÷ 1 000 = 0,375</td><td>de 3 rangs vers la gauche</td></tr></tbody></table></div></div>
  <p><b>Remarque :</b> quand il n'y a plus assez de chiffres, on complète par des zéros : 4,2 ÷ 1 000 = 0,0042.</p>
  <p><b>Remarque :</b> diviser par 10, c'est multiplier par 0,1 (voir le chapitre 8) : 375 ÷ 10 = 375 × 0,1 = 37,5.</p>`},
{k:"III", t:"La division décimale", h:`
  <h4>1. Définition</h4>
  <div class="retenir" data-l="Définition"><p>Effectuer la <b>division décimale</b> d'un nombre par un nombre entier non nul, c'est trouver la valeur exacte ou une valeur approchée du quotient. Ce quotient peut être un nombre décimal.</p><p><b>Rappel :</b> un nombre entier est aussi un nombre décimal (13 = 13,0 = 13,00).</p></div>
  <h4>2. Poser une division décimale</h4>
  <p><b>Exemple 1 :</b> j'effectue la division décimale de 75,8 par 4.</p>
  <div class="cpt"><div class="retenir" data-l="Méthode"><ol><li>Je divise la partie entière comme pour une division euclidienne : 75 en 4 → 18, il reste 3.</li><li>Quand j'abaisse le chiffre des dixièmes, je place la virgule au quotient : 38 dixièmes en 4 → 9 dixièmes, il reste 2.</li><li>J'ajoute un zéro au dividende (75,8 = 75,80) et je continue : 20 centièmes en 4 → 5 centièmes, il reste 0.</li><li>Quand le reste est nul, le calcul est terminé.</li></ol></div>${co("d758","Division posée de 75,8 par 4",170)}</div>
  <p>Je conclus : <span class="calc">75,8 ÷ 4 = 18,95</span>. Je vérifie : 4 × 18,95 = 75,8.</p>
  <p><b>Remarque :</b> je contrôle avec un ordre de grandeur : 75,8 ÷ 4 ≈ 80 ÷ 4 = 20. Le résultat 18,95 est cohérent.</p>
  <p><b>Exemple 2 :</b> le dividende est plus petit que le diviseur : j'effectue la division décimale de 3,6 par 8.</p>
  <div class="cpt"><div><p>3 &lt; 8 : je ne peux pas partager 3 unités en 8. Le quotient a 0 unité : j'écris « 0, » au quotient.</p><p>Je partage 36 dixièmes en 8 : 4 dixièmes (8 × 4 = 32), il reste 4.</p><p>J'ajoute un zéro : 40 centièmes en 8 : 5 centièmes, il reste 0.</p><p>Je conclus : <span class="calc">3,6 ÷ 8 = 0,45</span>.</p></div>${co("d36","Division posée de 3,6 par 8",150)}</div>
  <p><b>Remarque :</b> quand le dividende est plus petit que le diviseur, le quotient est plus petit que 1.</p>
  <h4>3. Quand la division ne s'arrête pas : la valeur arrondie</h4>
  <p><b>Exemple :</b> j'effectue la division décimale de 872 par 11.</p>
  <div class="cpt"><div><p>Les restes 8 et 3 reviennent sans cesse, et les chiffres 2 et 7 se répètent au quotient : 872 ÷ 11 = 79,272727…</p><p>Le calcul ne s'arrête jamais : on ne peut pas écrire la valeur exacte du quotient avec un nombre décimal. On donne une <b>valeur arrondie</b> :</p><ul><li>à l'unité : 872 ÷ 11 ≈ 79</li><li>au dixième : 872 ÷ 11 ≈ 79,3</li><li>au centième : 872 ÷ 11 ≈ 79,27</li></ul><p>Le signe ≈ se lit « environ égal à ».</p></div>${co("d872","Division posée de 872 par 11",230)}</div>
  <div class="retenir" data-l="Rappel (chapitre 5)"><p>Pour arrondir au dixième, je regarde le chiffre des centièmes : si c'est 0, 1, 2, 3 ou 4, je garde le chiffre des dixièmes ; si c'est 5, 6, 7, 8 ou 9, j'ajoute 1 au chiffre des dixièmes. Pour arrondir à l'unité ou au centième, on fait de même avec le chiffre qui suit.</p></div>
  <p><b>Remarque :</b> la calculatrice affiche 79,27272727 : elle aussi ne donne qu'une valeur approchée du quotient.</p>`},
{k:"IV", t:"Division euclidienne ou division décimale ?", h:`
  <div class="retenir" data-l="À retenir"><ul><li>Si ce que je partage ne peut pas être coupé en dixièmes, en centièmes… (des personnes, des objets entiers…), j'utilise la <b>division euclidienne</b>.</li><li>Si ce que je partage peut être coupé (une somme d'argent, une longueur, une masse, un volume…), j'utilise la <b>division décimale</b>.</li></ul></div>
  <p><b>Exemple 1 :</b> 107 élèves sont répartis en 7 groupes. 107 = 7 × 15 + 2 : il y a 15 élèves par groupe, et deux groupes auront un élève de plus.</p>
  <p><b>Exemple 2 :</b> 12 enfants se partagent 54 L de jus de pomme. 54 ÷ 12 = 4,5 : chaque enfant reçoit 4,5 L de jus.</p>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"La division euclidienne", e:[
  {n:"Exercice 1", t:"Le vocabulaire", w:"Sur ta feuille", h:`<p>L'égalité <span class="calc">158 = 12 × 13 + 2</span> traduit la division euclidienne de 158 par 12.</p><p>1) Complète : dividende : …… diviseur : …… quotient : …… reste : ……</p><p>2) L'égalité 158 = 12 × 12 + 14 est-elle vraie ? Traduit-elle la division euclidienne de 158 par 12 ? Justifie.</p>`,
   c:`<p>1) dividende : <b>158</b> ; diviseur : <b>12</b> ; quotient : <b>13</b> ; reste : <b>2</b>.</p><p>2) Je calcule :</p><p class="calc">A = 12 × 12 + 14<br>A = 144 + 14<br>A = 158</p><p>L'égalité est <b>vraie</b>. Mais elle ne traduit <b>pas</b> la division euclidienne de 158 par 12, car le reste 14 est plus grand que le diviseur 12.</p>`},
  {n:"Exercice 2", t:"Poser des divisions euclidiennes", w:"Sur ton cahier", h:`<p>Pose sur ton cahier la division euclidienne, puis écris l'égalité correspondante et vérifie-la.</p><p>a) de 87 par 4 · b) de 365 par 7 · c) de 1 254 par 9 · d) de 4 507 par 15 · e) de 2 024 par 24 · f) de 9 876 par 32</p>`,
   c:`<div class="cgrid">${E2.map(([a,b],k)=>`<figure><figcaption>${"abcdef"[k]}) <span class="calc">${eg(a,b)}</span></figcaption>${pot(String(a),b,{mode:"euc"})}<p style="font-size:14px">Vérification : ${b} × ${Math.floor(a/b)} = ${sp(b*Math.floor(a/b))} et ${sp(b*Math.floor(a/b))} + ${a%b} = ${sp(a)}.</p></figure>`).join("")}</div>`},
  {n:"Exercice 3", t:"Multiples et diviseurs", w:"Sur ta feuille", h:`<p>Effectue une division euclidienne pour répondre par oui ou par non. Justifie avec l'égalité.</p><p>a) 91 est-il un multiple de 7 ? · b) 7 est-il un diviseur de 100 ? · c) 216 est-il divisible par 12 ? · d) 15 est-il un diviseur de 345 ?</p>`,
   c:`<p>a) 91 = 7 × 13 + 0 : le reste est nul, <b>oui</b>.</p><p>b) 100 = 7 × 14 + 2 : le reste n'est pas nul, <b>non</b>.</p><p>c) 216 = 12 × 18 + 0 : <b>oui</b>.</p><p>d) 345 = 15 × 23 + 0 : <b>oui</b>.</p>`},
  {n:"Exercice 4", t:"Les critères de divisibilité", w:"Sur ta feuille", h:`<p>Sans poser de division, coche les cases qui conviennent.</p><div class="scroll"><table class="std"><thead><tr><th>Le nombre… est divisible</th><th>par 2</th><th>par 3</th><th>par 5</th><th>par 9</th><th>par 10</th></tr></thead><tbody>${E4.map(n=>`<tr><th>${sp(n)}</th><td></td><td></td><td></td><td></td><td></td></tr>`).join("")}</tbody></table></div><p><b>Défi :</b> par quels chiffres peut-on remplacer le carré dans 4 □ 2 pour obtenir un nombre divisible par 3 ?</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Nombre</th><th>par 2</th><th>par 3</th><th>par 5</th><th>par 9</th><th>par 10</th><th>somme des chiffres</th></tr></thead><tbody>${E4.map(n=>{ const c=crit(n); return `<tr><th>${sp(n)}</th>${c.slice(0,5).map(b=>`<td style="text-align:center">${ok(b)}</td>`).join("")}<td>${c[5]}</td></tr>`; }).join("")}</tbody></table></div>
   <p><b>Défi :</b> la somme des chiffres est 4 + □ + 2 = 6 + □. Elle doit être divisible par 3 : □ = <b>0, 3, 6 ou 9</b> (402, 432, 462, 492).</p>`},
  {n:"Exercice 5", t:"Convertir des durées", w:"Sur ta feuille", h:`<p>Utilise une division euclidienne pour convertir (revois le chapitre 7 si besoin).</p><p>a) 135 min = …… h …… min · b) 500 min = …… h …… min · c) 1 000 min = …… h …… min · d) 7 385 s = …… h …… min …… s</p><p>e) Un film dure 158 min. Il commence à 20 h 45. À quelle heure se termine-t-il ?</p>`,
   c:`<p>a) 135 = 60 × 2 + 15 : <b>2 h 15 min</b></p><p>b) 500 = 60 × 8 + 20 : <b>8 h 20 min</b></p><p>c) 1 000 = 60 × 16 + 40 : <b>16 h 40 min</b></p><p>d) 7 385 = 60 × 123 + 5 : 7 385 s = 123 min 5 s. Puis 123 = 60 × 2 + 3 : <b>2 h 3 min 5 s</b>.</p><p>e) 158 = 60 × 2 + 38 : le film dure 2 h 38 min. L'horaire de fin H :</p><p class="calc">H = 20 h 45 + 2 h 38 min<br>H = 22 h 83 min<br>H = <b>23 h 23 min</b></p><p>Le film se termine à 23 h 23.</p>`},
  {n:"Exercice 6", t:"Des problèmes", w:"Sur ta feuille", h:`<p>Pour chaque problème, écris l'égalité de la division euclidienne, puis réponds par une phrase.</p><p><b>Problème 1 :</b> un fleuriste a 890 roses. Il veut faire des bouquets de 7 roses. Combien de bouquets complets pourra-t-il faire ? Combien de roses lui restera-t-il ?</p><p><b>Problème 2 :</b> pour une sortie, 263 personnes doivent prendre le car. Un car a 55 places. Combien de cars faut-il réserver ?</p><p><b>Problème 3 :</b> un pâtissier a fabriqué 500 macarons. Il les range dans des boîtes de 12. Combien de boîtes pleines peut-il remplir ? Combien de macarons ne seront pas dans une boîte pleine ?</p><p><b>Problème 4 :</b> le 1<sup>er</sup> janvier 2027 est un vendredi. Quel jour de la semaine sera le 100<sup>e</sup> jour de l'année 2027 ? Aide : du 1<sup>er</sup> jour au 100<sup>e</sup> jour, il s'écoule 99 jours.</p><p><b>Problème 5 :</b> un pack contient 6 bouteilles de 1,5 L de jus d'orange. Combien de gobelets de 20 cL, pleins à ras bord, peut-on servir ? Rappel : 1 L = 100 cL.</p>`,
   c:`<p><b>Problème 1 :</b> 890 = 7 × 127 + 1. Il pourra faire <b>127 bouquets</b> et il lui restera <b>1 rose</b>.</p><p><b>Problème 2 :</b> 263 = 55 × 4 + 43. Avec 4 cars, 43 personnes n'ont pas de place : il faut un car de plus. Il faut réserver <b>5 cars</b>.</p><p><b>Problème 3 :</b> 500 = 12 × 41 + 8. Il peut remplir <b>41 boîtes</b> ; <b>8 macarons</b> ne seront pas dans une boîte pleine.</p><p><b>Problème 4 :</b> 99 = 7 × 14 + 1. En 14 semaines, on retombe sur un vendredi ; il reste 1 jour. Le 100<sup>e</sup> jour est le lendemain d'un vendredi : un <b>samedi</b>.</p><p><b>Problème 5 :</b> 1,5 L = 150 cL, donc le pack contient 6 × 150 = 900 cL. 900 = 20 × 45 + 0 : on peut servir <b>45 gobelets</b>.</p>`},
  {n:"Exercice 7", t:"Défi", w:"Sur ta feuille", h:`<p>1) Dans une division euclidienne, le diviseur est 9, le quotient est 23 et le reste est 5. Quel est le dividende ?</p><p>2) Trouve tous les nombres entiers dont le quotient dans la division euclidienne par 5 est égal à 12.</p>`,
   c:`<p>1) dividende = diviseur × quotient + reste. Le dividende D :</p><p class="calc">D = 9 × 23 + 5<br>D = 207 + 5<br>D = <b>212</b></p><p>2) Ces nombres s'écrivent 5 × 12 + reste, avec un reste plus petit que 5 : 0, 1, 2, 3 ou 4. Ce sont <b>60, 61, 62, 63 et 64</b>.</p>`}
 ]},
{t:"Diviser par 10, 100, 1 000", e:[
  {n:"Exercice 8", t:"Calcul mental", w:"Sur ta feuille", h:`<p>a) 45 ÷ 10 · b) 45 ÷ 100 · c) 3,7 ÷ 10 · d) 128 ÷ 1 000 · e) 0,5 ÷ 10 · f) 2 030 ÷ 100 · g) 6 ÷ 1 000 · h) 74,1 ÷ 100</p>`,
   c:`<p>La virgule se déplace vers la gauche : 1 rang pour ÷ 10, 2 rangs pour ÷ 100, 3 rangs pour ÷ 1 000.</p><p>a) 45 ÷ 10 = <b>4,5</b> (1 rang) · b) 45 ÷ 100 = <b>0,45</b> (2 rangs) · c) 3,7 ÷ 10 = <b>0,37</b> (1 rang) · d) 128 ÷ 1 000 = <b>0,128</b> (3 rangs)</p><p>e) 0,5 ÷ 10 = <b>0,05</b> (1 rang) · f) 2 030 ÷ 100 = <b>20,3</b> (2 rangs) · g) 6 ÷ 1 000 = <b>0,006</b> (3 rangs) · h) 74,1 ÷ 100 = <b>0,741</b> (2 rangs)</p>`},
  {n:"Exercice 9", t:"Les nombres manquants", w:"Sur ta feuille", h:`<p>a) 52 ÷ …… = 0,52 · b) …… ÷ 10 = 3,8 · c) 7 ÷ …… = 0,007 · d) …… ÷ 1 000 = 0,25 · e) 409 ÷ …… = 40,9 · f) …… ÷ 100 = 0,06</p>`,
   c:`<p>a) 52 ÷ <b>100</b> = 0,52 · b) <b>38</b> ÷ 10 = 3,8 · c) 7 ÷ <b>1 000</b> = 0,007</p><p>d) <b>250</b> ÷ 1 000 = 0,25 · e) 409 ÷ <b>10</b> = 40,9 · f) <b>6</b> ÷ 100 = 0,06</p><p><i>Pour a, c et e, je compte de combien de rangs la virgule s'est déplacée vers la gauche : 2 rangs (÷ 100), 3 rangs (÷ 1 000), 1 rang (÷ 10).</i></p><p><i>Pour b, d et f, on fait l'opération inverse : 3,8 × 10 = 38 ; 0,25 × 1 000 = 250 ; 0,06 × 100 = 6.</i></p>`},
  {n:"Exercice 10", t:"Petits problèmes", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> un paquet de 100 enveloppes identiques pèse 450 g. Quelle est la masse d'une enveloppe ?</p><p><b>Problème 2 :</b> 1 000 grains de riz pèsent 25 g. Quelle est la masse d'un grain de riz ?</p><p><b>Problème 3 :</b> dix amis se partagent équitablement une facture de 236,50 €. Combien paie chacun ?</p>`,
   c:`<p><b>Problème 1 :</b> 450 ÷ 100 = 4,5. Une enveloppe pèse <b>4,5 g</b>.</p><p><b>Problème 2 :</b> 25 ÷ 1 000 = 0,025. Un grain de riz pèse <b>0,025 g</b>.</p><p><b>Problème 3 :</b> 236,50 ÷ 10 = 23,65. Chacun paie <b>23,65 €</b>.</p>`}
 ]},
{t:"La division décimale", e:[
  {n:"Activité 1", t:"La recette de crêpes", w:"Sur ta feuille", h:`<p>Nathan a retrouvé la recette de crêpes de sa voisine, prévue pour 5 personnes. Il veut faire des crêpes pour lui seul. Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Ingrédient</th><th>Œufs</th><th>Farine</th><th>Beurre</th><th>Lait</th></tr></thead><tbody><tr><th>Pour 5 personnes</th><td>5</td><td>310 g</td><td>63 g</td><td>0,7 L</td></tr><tr><th>Pour 1 personne</th><td></td><td></td><td></td><td></td></tr></tbody></table></div>`,
   c:`<p>Pour 1 personne, il faut 5 fois moins de chaque ingrédient : je divise par 5.</p><div class="scroll"><table class="std"><thead><tr><th>Ingrédient</th><th>Œufs</th><th>Farine</th><th>Beurre</th><th>Lait</th></tr></thead><tbody><tr><th>Pour 1 personne</th><td><b>1</b></td><td><b>62 g</b></td><td><b>12,6 g</b></td><td><b>0,14 L</b></td></tr></tbody></table></div><p class="calc">5 ÷ 5 = 1 · 310 ÷ 5 = 62 · 63 ÷ 5 = 12,6 · 0,7 ÷ 5 = 0,14</p><div class="figs">${pot("63",5)}${pot("0,7",5)}</div>`},
  {n:"Exercice 11", t:"Encadrer un quotient", w:"Sur ta feuille", h:`<p>Sans poser la division, encadre le quotient par deux nombres entiers consécutifs.</p><p>a) … &lt; 38 ÷ 5 &lt; … · b) … &lt; 39 ÷ 6 &lt; … · c) … &lt; 43,9 ÷ 8 &lt; … · d) … &lt; 3 ÷ 8 &lt; … · e) … &lt; 34,9 ÷ 15 &lt; … · f) … &lt; 1,9 ÷ 4 &lt; …</p>`,
   c:`<p>a) 5 × 7 = 35 et 5 × 8 = 40 : <b>7 &lt; 38 ÷ 5 &lt; 8</b></p><p>b) 6 × 6 = 36 et 6 × 7 = 42 : <b>6 &lt; 39 ÷ 6 &lt; 7</b></p><p>c) 8 × 5 = 40 et 8 × 6 = 48 : <b>5 &lt; 43,9 ÷ 8 &lt; 6</b></p><p>d) 3 &lt; 8 : <b>0 &lt; 3 ÷ 8 &lt; 1</b></p><p>e) 15 × 2 = 30 et 15 × 3 = 45 : <b>2 &lt; 34,9 ÷ 15 &lt; 3</b></p><p>f) 1,9 &lt; 4 : <b>0 &lt; 1,9 ÷ 4 &lt; 1</b></p>`},
  {n:"Exercice 12", t:"Poser des divisions décimales", w:"Sur ton cahier", h:`<p>Pose ces divisions sur ton cahier jusqu'à obtenir un reste nul, puis écris le calcul en ligne.</p><p>a) 13 ÷ 4 · b) 63,5 ÷ 5 · c) 192,9 ÷ 6 · d) 3,4 ÷ 8 · e) 0,9 ÷ 5 · f) 58,2 ÷ 12</p>`,
   c:`<div class="cgrid">${E12.map(([a,b],k)=>`<figure><figcaption>${"abcdef"[k]}) <span class="calc">${a} ÷ ${b} = <b>${E12r[k]}</b></span></figcaption>${pot(a,b)}</figure>`).join("")}</div><p><i>Les zéros en rouge ont été ajoutés au dividende.</i></p>`},
  {n:"Exercice 13", t:"Des problèmes", w:"Sur ta feuille", h:`<p>Pour chaque problème, écris le calcul en ligne et réponds par une phrase.</p><p><b>Problème 1 :</b> en 4 h, j'ai parcouru 372,8 km en voiture, toujours à la même vitesse. Combien de kilomètres ai-je parcourus en 1 h ?</p><p><b>Problème 2 :</b> Mathieu a acheté 8 sucettes qu'il a payées 2,80 € au total. Quel est le prix d'une sucette ?</p><p><b>Problème 3 :</b> Léa coupe un ruban de 75 cm en 6 bandes de même longueur. Combien mesure chaque bande ?</p><p><b>Problème 4 :</b> Myriam a dépensé 85,56 € d'essence ce mois-ci. Flora a dépensé trois fois moins qu'elle. Combien Flora a-t-elle dépensé ?</p><p><b>Problème 5 :</b> un camion transporte 15 caisses identiques d'une masse totale de 678 kg. Quelle est la masse d'une caisse ?</p><p><b>Problème 6 :</b> un initiateur de tennis achète 16 raquettes à 8,50 € l'unité et 20 cerceaux identiques. Il paie 192 € en tout. Quel est le prix d'un cerceau ? (Calculatrice autorisée.)</p>`,
   c:`<p><b>Problème 1 :</b> 372,8 ÷ 4 = 93,2. En 1 h, j'ai parcouru <b>93,2 km</b>.</p><p><b>Problème 2 :</b> 2,80 ÷ 8 = 0,35. Une sucette coûte <b>0,35 €</b>.</p><p><b>Problème 3 :</b> 75 ÷ 6 = 12,5. Chaque bande mesure <b>12,5 cm</b>.</p><p><b>Problème 4 :</b> 85,56 ÷ 3 = 28,52. Flora a dépensé <b>28,52 €</b>.</p><p><b>Problème 5 :</b> 678 ÷ 15 = 45,2. Une caisse pèse <b>45,2 kg</b>.</p><p><b>Problème 6 :</b> les raquettes coûtent 16 × 8,50 = 136 €. Les cerceaux coûtent donc 192 − 136 = 56 €. 56 ÷ 20 = 2,8 : un cerceau coûte <b>2,80 €</b>.</p>`},
  {n:"Activité 2", t:"Quelle division choisir ?", w:"Sur ta feuille", h:`<p>Pour chaque situation, entoure la division qui convient, puis réponds à la question.</p><p>a) 6 élèves se partagent équitablement un bénéfice de 525 €. Combien reçoit chacun ?</p><p>b) 525 balles de tennis sont rangées dans des boîtes de 6. Combien faut-il de boîtes ?</p><p>c) Un ruban de 250 cm est coupé en 8 morceaux de même longueur. Combien mesure un morceau ?</p><p>d) 250 élèves partent en sortie dans des cars de 52 places. Combien faut-il de cars ?</p>`,
   c:`<p>a) Une somme d'argent se partage : division <b>décimale</b>. 525 ÷ 6 = 87,5 : chacun reçoit <b>87,50 €</b>.</p><p>b) Des balles entières : division <b>euclidienne</b>. 525 = 6 × 87 + 3 : 87 boîtes pleines, et 3 balles qui ont besoin d'une boîte de plus. Il faut <b>88 boîtes</b>.</p><p>c) Une longueur se partage : division <b>décimale</b>. 250 ÷ 8 = 31,25 : un morceau mesure <b>31,25 cm</b>.</p><p>d) Des élèves : division <b>euclidienne</b>. 250 = 52 × 4 + 42 : avec 4 cars, 42 élèves n'ont pas de place. Il faut <b>5 cars</b>.</p>`}
 ]},
{t:"Valeur arrondie d'un quotient", e:[
  {n:"Activité 3", t:"Le gel hydroalcoolique", w:"Sur ta feuille", h:`<p>Le patron d'une entreprise reçoit 458 cL de gel hydroalcoolique. Il veut le répartir équitablement dans 11 flacons, un par bureau.</p><p>1) Pose la division décimale de 458 par 11 jusqu'au centième. Que remarques-tu ?</p><p>2) Quelle quantité de gel doit-il mettre dans chaque flacon ? Donne l'arrondi au dixième.</p>`,
   c:`<div class="cpt"><div><p>1) 458 ÷ 11 = 41,6363… Les restes 7 et 4 reviennent sans cesse, et les chiffres 6 et 3 se répètent au quotient : <b>la division ne s'arrête jamais</b>.</p><p>2) Au dixième : je regarde le chiffre des centièmes, 3 : je garde le 6. 458 ÷ 11 ≈ 41,6. Il doit mettre environ <b>41,6 cL</b> de gel dans chaque flacon.</p></div>${pot("458",11,{dec:3})}</div>`},
  {n:"Exercice 14", t:"Arrondir un nombre", w:"Sur ta feuille", h:`<p>Voici des résultats affichés par une calculatrice. Complète le tableau.</p><div class="scroll"><table class="std"><thead><tr><th>Résultat affiché</th><th>Arrondi à l'unité</th><th>Arrondi au dixième</th><th>Arrondi au centième</th></tr></thead><tbody>${["3,723","47,375","9,142857143","0,2727272727","11,83333333"].map(x=>`<tr><th>${x}</th><td></td><td></td><td></td></tr>`).join("")}</tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Résultat affiché</th><th>à l'unité</th><th>au dixième</th><th>au centième</th></tr></thead><tbody><tr><th>3,723</th><td>4</td><td>3,7</td><td>3,72</td></tr><tr><th>47,375</th><td>47</td><td>47,4</td><td>47,38</td></tr><tr><th>9,142857143</th><td>9</td><td>9,1</td><td>9,14</td></tr><tr><th>0,2727272727</th><td>0</td><td>0,3</td><td>0,27</td></tr><tr><th>11,83333333</th><td>12</td><td>11,8</td><td>11,83</td></tr></tbody></table></div><p><i>Exemple : 47,375 au centième. Le chiffre qui suit les centièmes est 5 : j'ajoute 1 au chiffre des centièmes, 47,38.</i></p>`},
  {n:"Exercice 15", t:"Poser et arrondir", w:"Sur ton cahier", h:`<p>Pose chaque division sur ton cahier, puis donne l'arrondi demandé.</p><p>a) 25 ÷ 3 au centième · b) 17 ÷ 6 au dixième · c) 100 ÷ 7 au centième · d) 5,3 ÷ 9 au dixième</p>`,
   c:`<div class="cgrid"><figure><figcaption>a) 25 ÷ 3 = 8,333… ≈ <b>8,33</b></figcaption>${pot("25",3,{dec:3})}</figure><figure><figcaption>b) 17 ÷ 6 = 2,833… ≈ <b>2,8</b></figcaption>${pot("17",6,{dec:2})}</figure><figure><figcaption>c) 100 ÷ 7 = 14,285… ≈ <b>14,29</b></figcaption>${pot("100",7,{dec:3})}</figure><figure><figcaption>d) 5,3 ÷ 9 = 0,588… ≈ <b>0,6</b></figcaption>${pot("5,3",9,{dec:2})}</figure></div><p><i>On calcule toujours un chiffre de plus que l'arrondi demandé, pour savoir s'il faut ajouter 1.</i></p>`},
  {n:"Exercice 16", t:"Des problèmes", w:"Sur ta feuille", h:`<p><b>Problème 1 :</b> une pochette de 9 crayons identiques coûte 7,31 €. Quel est le prix d'un crayon ? Donne l'arrondi au centième.</p><p><b>Problème 2 :</b> trois amis vont au restaurant. La note est de 83 €. Ils décident de payer tous la même somme.</p><p>a) Combien doit payer chacun ? Donne l'arrondi au centième.</p><p>b) S'ils paient chacun cette somme, combien le restaurant reçoit-il ? Que remarques-tu ?</p><p><b>Problème 3 :</b> un pack de 6 yaourts coûte 2,35 €. Quel est le prix d'un yaourt, arrondi au centième ?</p>`,
   c:`<p><b>Problème 1 :</b> 7,31 ÷ 9 = 0,812… ≈ 0,81. Un crayon coûte environ <b>0,81 €</b>.</p><p><b>Problème 2 :</b> a) 83 ÷ 3 = 27,666… ≈ 27,67. Chacun doit payer environ <b>27,67 €</b>.</p><p>b) 3 × 27,67 = 83,01. Le restaurant reçoit <b>83,01 €</b> : c'est 1 centime de plus que la note, car 27,67 est une valeur arrondie (un peu plus grande que le vrai quotient).</p><p><b>Problème 3 :</b> 2,35 ÷ 6 = 0,3916… ≈ 0,39. Un yaourt coûte environ <b>0,39 €</b>.</p>`},
  {n:"En ++", t:"Le chiffre caché", w:"Sur ta feuille", h:`<p>À la calculatrice, on obtient : 1 ÷ 7 = 0,142857142857… Les six chiffres 1, 4, 2, 8, 5, 7 se répètent sans fin.</p><p>1) Quel est le 20<sup>e</sup> chiffre après la virgule ? Explique ta méthode.</p><p>2) Quel est le 100<sup>e</sup> chiffre après la virgule ?</p>`,
   c:`<p>Le motif 142857 a 6 chiffres. Je cherche combien de motifs complets il y a avant le chiffre cherché, grâce à une division euclidienne par 6.</p><p>1) 20 = 6 × 3 + 2 : après 3 motifs complets (18 chiffres), le 20<sup>e</sup> chiffre est le 2<sup>e</sup> chiffre du motif : <b>4</b>.</p><p>2) 100 = 6 × 16 + 4 : après 16 motifs complets (96 chiffres), le 100<sup>e</sup> chiffre est le 4<sup>e</sup> chiffre du motif : <b>8</b>.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"La division euclidienne", schema:S_VOC, q:{
 1:[ {g:()=>{ const b=ri(3,9), qq=ri(5,30), r=ri(0,b-1), a=b*qq+r; return {q:`${a} = ${b} × ${qq} + ${r}. Quel est le reste de la division euclidienne de ${a} par ${b} ?`, rep:String(r), sx:S_VOC}; }},
     {g:()=>{ const b=ri(3,9), qq=ri(10,30), r=ri(0,b-1), a=b*qq+r; return {q:`Dans ${a} = ${b} × ${qq} + ${r}, quel est le dividende ?`, c:shuf([String(a),String(b),String(qq)]), rep:String(a), sx:S_VOC}; }} ],
 2:[ {g:()=>{ const b=ri(4,9), qq=ri(11,40), r=ri(1,b-1), a=b*qq+r; return {q:`Quel est le quotient de la division euclidienne de ${a} par ${b} ?`, rep:String(qq), ex:eg(a,b)+".", sx:S_VOC}; }},
     {g:()=>{ const b=ri(5,9), qq=ri(10,20), a=b*qq+ri(1,b-1); const r=a-b*(qq-1); return {q:`${a} = ${b} × ${qq-1} + ${r}. Est-ce la division euclidienne de ${a} par ${b} ?`, c:["Non","Oui"], rep:"Non", ex:`Le reste ${r} est plus grand que le diviseur ${b}. La bonne égalité : ${eg(a,b)}.`, sx:S_VOC}; }} ],
 3:[ {g:()=>{ const b=ri(6,12), qq=ri(15,40), r=ri(1,b-1); return {q:`Le diviseur est ${b}, le quotient ${qq} et le reste ${r}. Quel est le dividende ?`, rep:String(b*qq+r), ex:`${b} × ${qq} + ${r} = ${b*qq+r}.`, sx:S_VOC}; }},
     {g:()=>{ const b=ri(11,25), qq=ri(12,60), r=ri(0,b-1), a=b*qq+r; return {q:`Quel est le reste de la division euclidienne de ${sp(a)} par ${b} ?`, rep:String(r), ex:eg(a,b)+".", sx:S_VOC}; }} ]
}},
{nom:"Multiples et critères", schema:S_CRIT, q:{
 1:[ {g:()=>{ const n=ri(10,999)*10+pick([0,5]); return {q:`${sp(n)} est-il divisible par 5 ?`, c:["Oui","Non"], rep:"Oui", ex:"Son chiffre des unités est 0 ou 5.", sx:S_CRIT}; }},
     {g:()=>{ const n=ri(100,9999)*10+pick([1,3,7,9]); return {q:`${sp(n)} est-il divisible par 2 ?`, c:["Oui","Non"], rep:"Non", ex:"Son chiffre des unités est impair.", sx:S_CRIT}; }} ],
 2:[ {g:()=>{ const n=3*ri(40,3000); const s=String(n).split("").reduce((x,c)=>x+ +c,0); return {q:`${sp(n)} est-il divisible par 3 ?`, c:["Oui","Non"], rep:"Oui", ex:`La somme de ses chiffres est ${s}, divisible par 3.`, sx:S_CRIT}; }},
     {g:()=>{ let n; do{ n=ri(100,9999); }while(n%3===0); const s=String(n).split("").reduce((x,c)=>x+ +c,0); return {q:`${sp(n)} est-il divisible par 3 ?`, c:["Oui","Non"], rep:"Non", ex:`La somme de ses chiffres est ${s}, qui n'est pas divisible par 3.`, sx:S_CRIT}; }},
     {g:()=>{ const b=ri(3,9), k=ri(6,25); return {q:`${b} est-il un diviseur de ${b*k} ?`, c:["Oui","Non"], rep:"Oui", ex:`${b*k} = ${b} × ${k} + 0.`, sx:S_CRIT}; }} ],
 3:[ {g:()=>{ let n; do{ n=3*ri(40,3000); }while(n%9===0); const s=String(n).split("").reduce((x,c)=>x+ +c,0); return {q:`${sp(n)} est-il divisible par 9 ?`, c:["Oui","Non"], rep:"Non", ex:`La somme de ses chiffres est ${s} : divisible par 3, mais pas par 9.`, sx:S_CRIT}; }},
     {q:"Par quel chiffre remplacer □ pour que 7□4 soit divisible par 9 ?", c:["7","5","9"], rep:"7", ex:"7 + 7 + 4 = 18, divisible par 9.", sx:S_CRIT},
     {q:"Vrai ou faux : un nombre divisible par 9 est aussi divisible par 3.", c:VF, rep:"Vrai", ex:"Si la somme des chiffres est divisible par 9, elle est aussi divisible par 3.", sx:S_CRIT} ]
}},
{nom:"Que représente le reste ?", schema:S_RESTE, q:{
 1:[ {g:()=>{ const b=ri(5,9), qq=ri(10,40), r=ri(1,b-1), a=b*qq+r; return {q:`On range ${a} œufs dans des boîtes de ${b}. Combien de boîtes pleines ?`, rep:String(qq), ex:`${eg(a,b)} : ${qq} boîtes pleines.`, sx:S_RESTE}; }} ],
 2:[ {g:()=>{ const b=pick([45,50,52,55,60]), qq=ri(2,6), r=ri(3,b-3), a=b*qq+r; return {q:`${a} personnes prennent des cars de ${b} places. Combien de cars faut-il ?`, rep:String(qq+1), ex:`${eg(a,b)} : il faut un car de plus pour les ${r} personnes restantes, donc ${qq+1} cars.`, sx:S_RESTE}; }} ],
 3:[ {g:()=>{ const m=ri(2,9)*60+ri(1,59); return {q:`Convertis ${m} min en heures et minutes.`, c:shuf(uniq(`${Math.floor(m/60)} h ${m%60} min`,[`${Math.floor(m/100)} h ${m%100} min`,`${Math.floor(m/60)+1} h ${m%60} min`,`${Math.floor(m/60)} h ${(m%60+10)%60} min`])), rep:`${Math.floor(m/60)} h ${m%60} min`, ex:`${m} = 60 × ${Math.floor(m/60)} + ${m%60}.`}; }},
     {g:()=>{ const j=ri(10,60), d=["lundi","mardi","mercredi","jeudi","vendredi","samedi","dimanche"], s=ri(0,6); return {q:`Aujourd'hui, c'est ${d[s]}. Quel jour serons-nous dans ${j} jours ?`, c:shuf(uniq(d[(s+j)%7],[d[(s+j+1)%7],d[(s+j+6)%7]])), rep:d[(s+j)%7], ex:`${eg(j,7)} : ${Math.floor(j/7)} semaine${Math.floor(j/7)>1?"s":""}${j%7?` plus ${j%7} jour${j%7>1?"s":""}`:""}.`}; }} ]
}},
{nom:"Diviser par 10, 100, 1 000", schema:S_10, q:{
 1:[ {g:()=>{ const n=ri(11,999); return {q:`${n} ÷ 10 = ?`, rep:D(n,1), sx:S_10}; }} ],
 2:[ {g:()=>{ const n=ri(11,999), p=pick([2,3]); return {q:`${n} ÷ ${p===2?"100":"1 000"} = ?`, rep:D(n,p), sx:S_10}; }},
     {g:()=>{ const n=ri(11,99), p=pick([1,2]); return {q:`${D(n,1)} ÷ ${p===1?"10":"100"} = ?`, rep:D(n,1+p), sx:S_10}; }} ],
 3:[ {g:()=>{ const n=ri(2,9), p=pick([2,3]); return {q:`${n} ÷ ${p===2?"100":"1 000"} = ?`, c:shuf(uniq(D(n,p),[D(n,p-1),D(n,p+1),sp(n*10**p)])), rep:D(n,p), ex:"On complète avec des zéros.", sx:S_10}; }},
     {g:()=>{ const n=ri(101,999), p=pick([1,2,3]), t=["10","100","1 000"][p-1]; return {q:`${n} ÷ … = ${D(n,p)}`, c:["10","100","1 000"], rep:t, sx:S_10}; }} ]
}},
{nom:"La division décimale", schema:S_DEC, q:{
 1:[ {g:()=>{ const b=pick([2,4,5]), qq=ri(11,60)*10+5*(b===5?0:1); const a=b*qq; return {q:`${D(a,1)} ÷ ${b} = ?`, rep:D(qq,1), sx:S_DEC}; }} ],
 2:[ {g:()=>{ const b=pick([4,8]), qq=ri(101,999)*(b===8?5:25); const a=b*qq; const k=b===8?3:2; return {q:`${D(a,k)} ÷ ${b} = ?`, rep:D(qq,k), ex:`On vérifie : ${b} × ${D(qq,k)} = ${D(a,k)}.`, sx:S_DEC}; }},
     {g:()=>{ const b=pick([5,6,8]), qq=ri(2,9)*(b===8?125:b===6?5:2); const k=b===8?3:b===6?1:1; const a=b*qq; return a<b*10**k?{q:`Le dividende est plus petit que le diviseur : ${D(a,k)} ÷ ${b} = ?`, rep:D(qq,k), sx:S_DEC}:{q:`${D(a,k)} ÷ ${b} = ?`, rep:D(qq,k), sx:S_DEC}; }} ],
 3:[ {g:()=>{ const b=ri(3,9); let a; do{ a=ri(10,99); }while(a%b===0); const lo=Math.floor(a/b); return {q:`Encadre ${a} ÷ ${b} par deux entiers consécutifs.`, c:shuf(uniq(`${lo} et ${lo+1}`,[`${lo-1} et ${lo}`,`${lo+1} et ${lo+2}`])), rep:`${lo} et ${lo+1}`, ex:`${b} × ${lo} = ${b*lo} et ${b} × ${lo+1} = ${b*(lo+1)}.`}; }},
     {q:"Quel est l'ordre de grandeur de 75,8 ÷ 4 ?", c:["20","2","200"], rep:"20", ex:"75,8 ÷ 4 ≈ 80 ÷ 4 = 20.", sx:S_DEC} ]
}},
{nom:"Arrondir un quotient", schema:S_ARR, q:{
 1:[ {q:"872 ÷ 11 = 79,2727… Quel est l'arrondi à l'unité ?", c:["79","80","79,3"], rep:"79", sx:S_ARR},
     {q:"Que signifie le signe ≈ ?", c:["environ égal à","égal à","plus petit que"], rep:"environ égal à"} ],
 2:[ {g:()=>{ let n, v; do{ n=ri(1001,9999); v=Math.round(n/100); }while(v%10===0 || n%10===0); const k=3; return {q:`Arrondis ${D(n,k)} au dixième.`, rep:D(v,1), ex:`Je regarde le chiffre des centièmes : ${String(n).slice(-2,-1)}.`, sx:S_ARR}; }} ],
 3:[ {g:()=>{ const b=pick([3,6,7,9,11]); let a, v; do{ a=ri(10,99); v=Math.round(a*100/b); }while((a*1000)%b===0 || v%10===0); return {q:`Donne l'arrondi au centième de ${a} ÷ ${b}.`, rep:D(v,2), ex:`${a} ÷ ${b} = ${D(Math.floor(a*1000/b),3)}… ≈ ${D(v,2)}.`, sx:S_ARR}; }} ]
}},
{nom:"Euclidienne ou décimale ?", schema:S_CHOIX, q:{
 1:[ {q:"On partage 50 € entre 4 enfants. Quelle division ?", c:["décimale","euclidienne"], rep:"décimale", sx:S_CHOIX},
     {q:"On range 50 livres sur des étagères de 8 livres. Quelle division ?", c:["euclidienne","décimale"], rep:"euclidienne", sx:S_CHOIX} ],
 2:[ {q:"On coupe une corde de 9 m en 4 morceaux égaux. Combien mesure un morceau ?", c:["2,25 m","2 m, il reste 1 m","2,1 m"], rep:"2,25 m", ex:"Une longueur se partage : 9 ÷ 4 = 2,25.", sx:S_CHOIX} ],
 3:[ {q:"26 élèves font des équipes de 4. Combien d'équipes complètes ?", c:["6","6,5","7"], rep:"6", ex:"26 = 4 × 6 + 2 : 6 équipes complètes.", sx:S_CHOIX} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const MEM = t => `<div class="retenir" data-l="Je me souviens">${t}</div>`;
const AIDE = t => `<p><i><b>Aide :</b> ${t}</i></p>`;
const ZONE = `<div style="border:1.5px dashed #999;border-radius:8px;min-height:190px;margin:10px 0;padding:8px 12px;color:#777"><i>Je pose la division ici.</i></div>`;
const DIVT = (cells) => `<div class="scroll"><table class="std"><tbody>${[2,3,5,9].map((d,i)=>`<tr><th>divisibles par ${d}</th><td>${cells?cells[i]:"……………………"}</td></tr>`).join("")}</tbody></table></div>`;
const COMP = [
  ["RAISONNER","Je reconnais un multiple ou un diviseur et j'utilise les critères de divisibilité.","Ex. 1 (3 points)"],
  ["CALCULER","Je pose une division décimale jusqu'à obtenir un reste nul.","Ex. 2 (2 points)"],
  ["CALCULER","Je pose une division euclidienne et j'écris l'égalité qui la traduit.","Ex. 3 (3 points)"],
  ["MODÉLISER","Je choisis la division qui convient pour résoudre un problème.","Ex. 4 (2 points)"]
];
return {
titre:"Évaluation d'entraînement — Chapitre 10", duree:30, info:"Durée : 30 min · Calculatrice non autorisée",
comp:COMP,
exos:[
{t:"Multiples et diviseurs", p:3, h:`<p>a) Complète avec le mot « multiple » ou le mot « diviseur » : 7 est un …… de 63 ; 63 est un …… de 7.</p>
  <p>b) Voici cinq nombres : 135 &nbsp;·&nbsp; 248 &nbsp;·&nbsp; 714 &nbsp;·&nbsp; 1 080 &nbsp;·&nbsp; 495. Sans poser de division, complète le tableau avec ces nombres.</p>${DIVT()}
  <p>c) Écris la liste de tous les diviseurs de 28.</p>`,
 c:`<p>a) 63 = 7 × 9 : 7 est un <b>diviseur</b> de 63, et 63 est un <b>multiple</b> de 7. <i>(0,5 point)</i></p>
  <p>b) Chiffre des unités : 135 → 5 ; 248 → 8 ; 714 → 4 ; 1 080 → 0 ; 495 → 5.</p><p>Somme des chiffres : 135 → 1 + 3 + 5 = 9 ; 248 → 2 + 4 + 8 = 14 ; 714 → 7 + 1 + 4 = 12 ; 1 080 → 1 + 0 + 8 + 0 = 9 ; 495 → 4 + 9 + 5 = 18.</p>
  ${DIVT(["<b>248 ; 714 ; 1 080</b> (chiffre des unités pair)","<b>135 ; 714 ; 1 080 ; 495</b> (somme des chiffres divisible par 3)","<b>135 ; 1 080 ; 495</b> (chiffre des unités 0 ou 5)","<b>135 ; 1 080 ; 495</b> (somme des chiffres divisible par 9)"])}
  <p><i>0,5 point par ligne entièrement juste.</i></p>
  <p>c) 28 = 1 × 28 = 2 × 14 = 4 × 7. Les diviseurs de 28 sont : <b>1 ; 2 ; 4 ; 7 ; 14 ; 28</b>. <i>(0,5 point)</i></p>`},
{t:"Une division décimale", p:2, h:`<p>Pose la division décimale de 58,5 par 6. Continue jusqu'à obtenir un reste nul.</p>${ZONE}`,
 c:`<div class="figs">${pot("58,5",6)}</div><p>58 en 6 : 9, il reste 4. J'abaisse le 5 des dixièmes et je place la virgule au quotient : 45 en 6 : 7, il reste 3. J'ajoute un zéro (58,5 = 58,50) : 30 en 6 : 5, il reste 0.</p>
  <p class="calc">58,5 ÷ 6 = 9,75</p><p>Vérification : 6 × 9,75 = 58,5. Ordre de grandeur : 60 ÷ 6 = 10, c'est cohérent.</p>
  <p><i>1,5 point pour la division bien posée (virgule placée au bon moment, zéro ajouté), 0,5 point pour le résultat.</i></p>`},
{t:"Une division euclidienne", p:3, h:`<p>a) Pose la division euclidienne de 1 274 par 9.</p>${ZONE}<p>b) Écris l'égalité qui traduit cette division, puis vérifie-la.</p><p>c) 1 274 est-il un multiple de 9 ? Justifie.</p>`,
 c:`<p>a)</p><div class="figs">${pot("1274",9,{mode:"euc"})}</div><p>Le quotient est 141 et le reste est 5. <i>(1,5 point)</i></p>
  <p>b) <span class="calc">1 274 = 9 × 141 + 5</span>, avec 5 &lt; 9.</p><p class="calc">A = 9 × 141 + 5<br>A = 1 269 + 5<br>A = 1 274</p><p><i>(1 point)</i></p>
  <p>c) <b>Non</b> : le reste de la division de 1 274 par 9 n'est pas nul (il vaut 5). On peut aussi le voir avec le critère : 1 + 2 + 7 + 4 = 14, et 14 n'est pas divisible par 9. <i>(0,5 point)</i></p>`},
{t:"Quelle division ?", p:2, h:`<p>a) Un ruban de 14 m est coupé en 8 morceaux de même longueur. Quelle est la longueur d'un morceau ?</p>
  <p>b) Clara range 86 photos dans un album. Chaque page contient 6 photos. Combien de pages seront complètes ? Combien de photos y aura-t-il sur la dernière page ?</p>`,
 c:`<p>a) Une longueur peut se couper : je fais une <b>division décimale</b>.</p><div class="figs">${pot("14",8)}</div><p class="calc">14 ÷ 8 = 1,75</p><p>Un morceau mesure <b>1,75 m</b>. <i>(1 point)</i></p>
  <p>b) On ne coupe pas une photo : je fais une <b>division euclidienne</b>.</p><p class="calc">86 = 6 × 14 + 2, avec 2 &lt; 6</p><p><b>14 pages</b> seront complètes. Il restera 2 photos : la dernière page (la 15<sup>e</sup>) contiendra <b>2 photos</b>. <i>(1 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 10 · version aménagée", duree:30, info:"Version aménagée (tiers-temps) · Durée : 30 min · Calculatrice non autorisée",
note:"Le même sujet avec 2 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:COMP,
exos:[
{t:"Multiples et diviseurs", p:3, h:`<p>a) Complète avec le mot « multiple » ou le mot « diviseur » : 7 est un …… de 63 ; 63 est un …… de 7.</p>
  <p>b) Voici cinq nombres : 135 &nbsp;·&nbsp; 248 &nbsp;·&nbsp; 714 &nbsp;·&nbsp; 1 080 &nbsp;·&nbsp; 495. Sans poser de division, complète le tableau avec ces nombres.</p>${DIVT()}`,
 c:`<p>a) 63 = 7 × 9 : 7 est un <b>diviseur</b> de 63, et 63 est un <b>multiple</b> de 7. <i>(1 point)</i></p>
  <p>b) Chiffre des unités : 135 → 5 ; 248 → 8 ; 714 → 4 ; 1 080 → 0 ; 495 → 5.</p><p>Somme des chiffres : 135 → 1 + 3 + 5 = 9 ; 248 → 2 + 4 + 8 = 14 ; 714 → 7 + 1 + 4 = 12 ; 1 080 → 1 + 0 + 8 + 0 = 9 ; 495 → 4 + 9 + 5 = 18.</p>
  ${DIVT(["<b>248 ; 714 ; 1 080</b> (chiffre des unités pair)","<b>135 ; 714 ; 1 080 ; 495</b> (somme des chiffres divisible par 3)","<b>135 ; 1 080 ; 495</b> (chiffre des unités 0 ou 5)","<b>135 ; 1 080 ; 495</b> (somme des chiffres divisible par 9)"])}
  <p><i>0,5 point par ligne entièrement juste.</i></p>`},
{t:"Une division décimale", p:2, h:`<p>Pose la division décimale de 58,5 par 6. Continue jusqu'à obtenir un reste nul.</p>${ZONE}`,
 c:`<div class="figs">${pot("58,5",6)}</div><p>58 en 6 : 9, il reste 4. J'abaisse le 5 des dixièmes et je place la virgule au quotient : 45 en 6 : 7, il reste 3. J'ajoute un zéro (58,5 = 58,50) : 30 en 6 : 5, il reste 0.</p>
  <p class="calc">58,5 ÷ 6 = 9,75</p><p>Vérification : 6 × 9,75 = 58,5. Ordre de grandeur : 60 ÷ 6 = 10, c'est cohérent.</p>
  <p><i>1,5 point pour la division bien posée (virgule placée au bon moment, zéro ajouté), 0,5 point pour le résultat.</i></p>`},
{t:"Une division euclidienne", p:3, h:`<p>a) Pose la division euclidienne de 1 274 par 9.</p>${ZONE}<p>b) Écris l'égalité qui traduit cette division, puis vérifie-la.</p>`,
 c:`<p>a)</p><div class="figs">${pot("1274",9,{mode:"euc"})}</div><p>Le quotient est 141 et le reste est 5. <i>(1,5 point)</i></p>
  <p>b) <span class="calc">1 274 = 9 × 141 + 5</span>, avec 5 &lt; 9.</p><p class="calc">A = 9 × 141 + 5<br>A = 1 269 + 5<br>A = 1 274</p><p><i>(1,5 point)</i></p>`},
{t:"Quelle division ?", p:2, h:`<p>a) Un ruban de 14 m est coupé en 8 morceaux de même longueur. Quelle est la longueur d'un morceau ?</p>
  <p>b) Clara range 86 photos dans un album. Chaque page contient 6 photos. Combien de pages seront complètes ? Combien de photos y aura-t-il sur la dernière page ?</p>`,
 c:`<p>a) Une longueur peut se couper : je fais une <b>division décimale</b>.</p><div class="figs">${pot("14",8)}</div><p class="calc">14 ÷ 8 = 1,75</p><p>Un morceau mesure <b>1,75 m</b>. <i>(1 point)</i></p>
  <p>b) On ne coupe pas une photo : je fais une <b>division euclidienne</b>.</p><p class="calc">86 = 6 × 14 + 2, avec 2 &lt; 6</p><p><b>14 pages</b> seront complètes. Il restera 2 photos : la dernière page (la 15<sup>e</sup>) contiendra <b>2 photos</b>. <i>(1 point)</i></p>`}
]}
};
})()
};
})();
