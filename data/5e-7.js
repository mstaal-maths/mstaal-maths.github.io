/* 5e — Chapitre 7 : Fractions : addition et soustraction (cours, fiche d'exercices et corrigé de M. Staal)
   Droites graduées, barres partagées et murs de briques sont dessinés en SVG à partir des valeurs :
   ce qui est dessiné est exactement ce qui est écrit dans l'énoncé et dans la correction. */
(function(){
const VF=["Vrai","Faux"], LT="&lt;", GT="&gt;";
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;

/* ---------- fractions ---------- */
const F = (a,b) => `{${a}/${b}}`;
const gcd = (a,b) => b ? gcd(b, a%b) : a;
const lcm = (a,b) => a/gcd(a,b)*b;
const simp = (a,b) => { const g=gcd(a,b); return [a/g, b/g]; };
const FS = (a,b) => { const [p,q]=simp(a,b); return q===1 ? String(p) : F(p,q); };      /* fraction simplifiée (ou entier) */
const RS = (a,b) => { const [p,q]=simp(a,b); return q===1 ? String(p) : `${p}/${q}`; };  /* réponse tapée */
const cmp = (a,b,c,d) => a*d<c*b ? LT : a*d>c*b ? GT : "=";
const cols = arr => `<div class="calcs">${arr.map(x=>`<span>${x}</span>`).join("")}</div>`;
/* x avec le dénominateur L : « {a × k/b × k} » (ou rien si k = 1) */
const conv = (a,b,L) => b===1 ? F(a*L,L) : (L===b ? F(a,b) : F(`${a} × ${L/b}`,`${b} × ${L/b}`));
/* simplification finale : « = {N ÷ g/L ÷ g} = {p/q} » */
const simpl = (N,L) => { const g=gcd(N,L); if(g===1) return ""; return L/g===1 ? ` = ${N/g}` : ` = ${F(`${N} ÷ ${g}`,`${L} ÷ ${g}`)} = ${F(N/g,L/g)}`; };
/* calcul détaillé de a/b op c/d (b ou d peut valoir 1 : nombre entier) */
function steps2(a,b,op,c,d){
  const L=lcm(b,d), A=a*L/b, C=c*L/d, N=op==="+"?A+C:A-C;
  const w=(x,y)=> y===1 ? String(x) : F(x,y);
  let s=`${w(a,b)} ${op} ${w(c,d)}`;
  if(b!==L||d!==L){ const ca=conv(a,b,L), cc=conv(c,d,L); s+=` = ${ca} ${op} ${cc}`; if(ca!==F(A,L)||cc!==F(C,L)) s+=` = ${F(A,L)} ${op} ${F(C,L)}`; }
  return s+` = ${F(N,L)}`+simpl(N,L);
}
const val2 = (a,b,op,c,d) => { const L=lcm(b,d), N=op==="+"?a*L/b+c*L/d:a*L/b-c*L/d; return simp(N,L); };

/* ---------- dessins ---------- */
const ORA="#f3c27e", BLU="#9fc3ea", DK="#1b2a44";
const X6 = (x,y) => `<path d="M${x-6} ${y-6} L${x+6} ${y+6} M${x+6} ${y-6} L${x-6} ${y+6}" class="pt"/>`;
/* fraction écrite dans un SVG */
const sF = (x,y,a,b,col="var(--ink)",fs=15) => { const h=Math.max(String(a).length,String(b).length)*fs*0.33+4;
  return `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:${fs}px;fill:${col}">${a}</text><line x1="${x-h}" y1="${y+5}" x2="${x+h}" y2="${y+5}" style="stroke:${col};stroke-width:1.5"/><text x="${x}" y="${y+5+fs+2}" text-anchor="middle" style="font-size:${fs}px;fill:${col}">${b}</text>`; };
/* droite graduée de 0 à units, chaque unité partagée en sub ; pts [[nom, rang]] ; show : écrit les abscisses */
function fl({units, sub, pts=[], show=false, w=560, alt}){
  const x0=30, n=units*sub, u=(w-70)/n, Y=46, H=show?140:96;
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="${alt||`Droite graduée de 0 à ${units}, chaque unité partagée en ${sub}`}">`;
  s+=`<line x1="${x0-16}" y1="${Y}" x2="${w-12}" y2="${Y}" class="ln"/><path d="M${w-22} ${Y-7} L${w-10} ${Y} L${w-22} ${Y+7}" class="ln"/>`;
  for(let k=0;k<=n;k++){ const x=(x0+k*u).toFixed(1), big=k%sub===0;
    s+=`<line x1="${x}" y1="${Y-(big?11:7)}" x2="${x}" y2="${Y+(big?11:7)}" class="ln" style="stroke-width:${big?2.2:1.4}"/>`;
    if(big) s+=`<text x="${x}" y="${Y+33}" class="lab">${k/sub}</text>`; }
  pts.forEach(([L,k])=>{ const x=+(x0+k*u).toFixed(1); s+=X6(x,Y)+`<text x="${x}" y="${Y-20}" class="ptl">${L}</text>`;
    if(show) s+=sF(x, Y+62, k, sub, "var(--c)", 15); });
  return s+"</svg>";
}
/* barres partagées : rows [{n, k, k2, lab}] ; k parts en orange, puis k2 parts en bleu ; lab : texte ou [a,b] */
function bars(rows, o={}){
  const W=o.w||440, lw=o.lw||100, h=40, gap=18, H=rows.length*(h+gap)-gap+4;
  let s=`<svg class="fig" viewBox="0 0 ${lw+W+4} ${H}" width="${lw+W+4}" role="img" aria-label="${o.alt||"Barres partagées en parts égales"}">`;
  rows.forEach((r,j)=>{ const y=2+j*(h+gap), cw=W/r.n;
    if(Array.isArray(r.lab)) s+=sF(lw-22, y+15, r.lab[0], r.lab[1]); else if(r.lab) s+=`<text x="${lw-10}" y="${y+26}" text-anchor="end">${r.lab}</text>`;
    for(let i=0;i<r.n;i++){ const f = i<(r.k||0) ? ORA : i<(r.k||0)+(r.k2||0) ? BLU : "var(--surface)";
      s+=`<rect x="${(lw+i*cw).toFixed(1)}" y="${y}" width="${cw.toFixed(1)}" height="${h}" style="fill:${f};stroke:var(--ink);stroke-width:2"/>`; } });
  return s+"</svg>";
}
/* mur de briques : v = [bas1, bas2, bas3, milieu1, milieu2, haut] (chaque valeur [p,q]) ; given : briques écrites */
function wall(v, given, show){
  const bw=110, bh=50, W=3*bw+4, H=3*bh+4;
  const pos=[[2,2+2*bh],[2+bw,2+2*bh],[2+2*bw,2+2*bh],[2+bw/2,2+bh],[2+bw*1.5,2+bh],[2+bw,2]];
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="Mur de briques : chaque brique est la somme des deux briques placées dessous">`;
  pos.forEach(([x,y],i)=>{ const g=given[i], on=g||show, f=g?ORA:(show?BLU:"var(--surface)");
    s+=`<rect x="${x}" y="${y}" width="${bw}" height="${bh}" style="fill:${f};stroke:var(--ink);stroke-width:2"/>`;
    if(on){ const [p,q]=v[i]; s+= q===1 ? `<text x="${x+bw/2}" y="${y+bh/2+8}" text-anchor="middle" style="font-size:22px;fill:${DK}">${p}</text>` : sF(x+bw/2, y+20, p, q, DK, 15); } });
  return s+"</svg>";
}
/* calcul nommé : une étape par ligne, chaque ligne commence par « A = » */
const NL = (n, ch) => `<p class="calc">${n} = ${ch.split(" = ").join(`<br>${n} = `)}</p>`;
window.FR7 = {F, FS, RS, gcd, lcm, simp, cmp, cols, conv, simpl, steps2, val2, fl, bars, wall, sF, LT, GT, NL};

/* ---------- figures du chapitre ---------- */
const DG_COURS = fl({units:3, sub:4, pts:[["A",3],["B",7]], alt:"Droite graduée : A a pour abscisse trois quarts et B sept quarts"});
const BARS_EG = bars([{n:5,k:2,lab:[2,5]},{n:10,k:4,lab:[4,10]}], {alt:"Deux cinquièmes et quatre dixièmes d'une même barre : même longueur coloriée"});
const W1 = [[1,2],[1,4],[3,4],[3,4],[1,1],[7,4]], W2 = [[1,4],[1,6],[1,3],[5,12],[1,2],[11,12]];

/* ---------- schémas (rappels en image) ---------- */
const S_Q = sch("La fraction, un quotient", `<p class="calc">${F("a","b")} = a ÷ b &nbsp; et &nbsp; b × ${F("a","b")} = a</p><p class="calc">3 × ${F(7,3)} = 7 &nbsp;·&nbsp; 3 ÷ 4 = ${F(3,4)} = 0,75</p><p class="schN">${F(1,3)} = 0,333… n'a pas d'écriture décimale exacte : on garde la fraction.</p>`);
const S_DG = sch("Une fraction sur une droite graduée", fl({units:3, sub:4, pts:[["A",3],["B",7]], show:true, w:420})+`<p class="schN">L'unité est partagée en 4 : on compte 3 graduations pour A({3/4}), 7 graduations pour B({7/4}).</p>`);
const S_ENT = sch("Entier + fraction inférieure à 1", `<p class="calc">17 = 5 × 3 + 2 &nbsp; donc &nbsp; ${F(17,5)} = ${F(15,5)} + ${F(2,5)} = 3 + ${F(2,5)}</p>`);
const S_PART = sch("Prendre une fraction d'une quantité", `<p class="schN">Les ${F(3,4)} de 20 :</p>${NL("A",`20 ÷ 4 × 3 = 5 × 3 = 15`)}<p class="schN">1) Je divise par le dénominateur. 2) Je multiplie par le numérateur.</p>`);
const S_EG = sch("Des fractions égales", BARS_EG.replace('width="544"','width="420"')+`<p class="calc">${F(2,5)} = ${F("2 × 2","5 × 2")} = ${F(4,10)}</p><p class="schN">On multiplie (ou on divise) le numérateur et le dénominateur par le <b>même</b> nombre.</p>`);
const S_SIMP = sch("Simplifier une fraction", `<p class="calc">${F(36,24)} = ${F("36 ÷ 12","24 ÷ 12")} = ${F(3,2)}</p><p class="schN">Je divise le numérateur et le dénominateur par un diviseur commun, jusqu'à obtenir une fraction irréductible.</p>`);
const S_CMP = sch("Comparer des fractions", `<p class="calc">${F(3,5)} = ${F("3 × 4","5 × 4")} = ${F(12,20)} &nbsp; et &nbsp; 12 &gt; 11, &nbsp; donc &nbsp; ${F(3,5)} &gt; ${F(11,20)}</p><p class="schN">Même dénominateur : la plus grande est celle qui a le plus grand numérateur.</p>`);
const S_ADD = sch("Additionner, soustraire", `${NL("A",`${F(3,7)} + ${F(2,7)} = ${F(5,7)}`)}${NL("B",`${F(1,2)} + ${F(1,3)} = ${F(3,6)} + ${F(2,6)} = ${F(5,6)}`)}<p class="schN">Même dénominateur d'abord, puis on additionne les numérateurs et on <b>garde</b> le dénominateur. On n'additionne jamais les dénominateurs.</p>`);
const S_PB = sch("Les parts d'un même tout", bars([{n:12,k:3,k2:4}], {lw:4, w:420, alt:"Trois douzièmes en orange, quatre douzièmes en bleu"})+`<p class="calc">${F(1,4)} + ${F(1,3)} = ${F(3,12)} + ${F(4,12)} = ${F(7,12)} &nbsp; et &nbsp; 1 − ${F(7,12)} = ${F(12,12)} − ${F(7,12)} = ${F(5,12)}</p><p class="schN">Le tout vaut 1.</p>`);

/* paires de dénominateurs « sans lien » */
const PAIRS = [[6,9],[4,7],[10,15],[4,6],[6,8],[3,4],[5,6],[9,12],[2,3],[3,5],[4,10],[6,10],[8,12],[2,5]];
const fr = (p,q) => q===1 ? String(p) : F(p,q);

CH["5e-7"] = {
intro:"La fraction comme quotient, sur une droite graduée et comme part d'une quantité ; les fractions égales et la simplification ; comparer, additionner et soustraire des fractions, et résoudre des problèmes.",
savoir:[
  "écrire un quotient sous la forme d'une fraction ;",
  "placer une fraction sur une droite graduée et lire son abscisse ;",
  "reconnaître des fractions égales et simplifier une fraction ;",
  "comparer des fractions ;",
  "additionner et soustraire des fractions ;",
  "résoudre un problème avec des fractions."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"Fractions et quotients", h:`
  <h4>1. Fraction et quotient</h4>
  <div class="retenir" data-l="Définition"><p>Soient <i>a</i> et <i>b</i> deux nombres entiers, avec <i>b</i> ≠ 0.</p><p>La <b>fraction</b> ${F("a","b")} est le <b>quotient</b> de <i>a</i> par <i>b</i> : c'est le nombre qui, multiplié par <i>b</i>, donne <i>a</i>.</p><p class="calc">${F("a","b")} = a ÷ b &nbsp;&nbsp; et &nbsp;&nbsp; b × ${F("a","b")} = a</p><p><i>a</i> est le <b>numérateur</b> et <i>b</i> est le <b>dénominateur</b>.</p></div>
  <p><b>Exemples :</b> 7 ÷ 3 = ${F(7,3)}, donc 3 × ${F(7,3)} = 7. &nbsp; 3 ÷ 4 = ${F(3,4)} = 0,75.</p>
  <p><b>Remarque :</b> certaines fractions n'ont pas d'écriture décimale exacte, par exemple ${F(1,3)} = 0,333… On garde alors l'écriture fractionnaire.</p>
  <p>Un nombre qui s'écrit comme une fraction est un <b>nombre rationnel</b>. Les entiers (3 = ${F(3,1)}) et les décimaux (0,75 = ${F(3,4)}) sont des nombres rationnels.</p>
  <h4>2. Fraction sur une droite graduée</h4>
  <p>Pour placer ${F("a","b")} sur une droite graduée :</p>
  <ul><li>je partage chaque unité en <i>b</i> parts égales ;</li><li>puis je compte <i>a</i> graduations à partir de 0.</li></ul>
  ${DG_COURS}
  <p>Ici, l'unité est partagée en 4. Le point A a pour abscisse ${F(3,4)}. Le point B a pour abscisse ${F(7,4)} : on note B(${F(7,4)}).</p>
  <div class="retenir" data-l="Propriété"><p>Une fraction supérieure à 1 peut s'écrire comme la somme d'un entier et d'une fraction inférieure à 1.</p></div>
  <p><b>Exemple :</b></p><p class="calc">${F(17,5)} = ${F(15,5)} + ${F(2,5)} = 3 + ${F(2,5)}</p><p>On utilise la division euclidienne : 17 = 5 × 3 + 2.</p>
  <h4>3. Prendre une fraction d'une quantité</h4>
  <div class="retenir" data-l="Méthode"><p>Pour prendre ${F("a","b")} d'une quantité :</p><ol><li>je divise la quantité par le dénominateur <i>b</i> ;</li><li>je multiplie le résultat par le numérateur <i>a</i>.</li></ol></div>
  <p><b>Exemple :</b> les ${F(3,4)} de 20 briques.</p>${NL("A",`20 ÷ 4 × 3 = 5 × 3 = 15`)}<p>Les ${F(3,4)} de 20 briques, c'est 15 briques.</p>`},
{k:"II", t:"Fractions égales et simplification", h:`
  <h4>1. Fractions égales</h4>
  <div class="retenir" data-l="Propriété"><p>On ne change pas la valeur d'une fraction quand on multiplie, ou quand on divise, son numérateur et son dénominateur par un <b>même nombre non nul</b>.</p><p class="calc">${F("a","b")} = ${F("a × k","b × k")} &nbsp;&nbsp; et &nbsp;&nbsp; ${F("a","b")} = ${F("a ÷ k","b ÷ k")} &nbsp;&nbsp; (k ≠ 0)</p></div>
  ${BARS_EG}
  <p><b>Exemples :</b></p><p class="calc">${F(2,5)} = ${F("2 × 2","5 × 2")} = ${F(4,10)} &nbsp;&nbsp;&nbsp; ${F(18,12)} = ${F("18 ÷ 6","12 ÷ 6")} = ${F(3,2)}</p>
  <h4>2. Simplifier une fraction</h4>
  <div class="retenir" data-l="Définition"><p><b>Simplifier</b> une fraction, c'est écrire une fraction égale avec un numérateur et un dénominateur plus petits.</p><p>Une fraction que l'on ne peut plus simplifier est <b>irréductible</b>.</p></div>
  <div class="retenir" data-l="Rappel"><p>Un nombre est divisible :</p><ul><li>par 2 s'il est pair ;</li><li>par 5 s'il se termine par 0 ou 5 ;</li><li>par 10 s'il se termine par 0 ;</li><li>par 3 (ou 9) si la somme de ses chiffres est divisible par 3 (ou 9).</li></ul></div>
  <div class="retenir" data-l="Méthode"><ol><li>Je cherche un diviseur commun (autre que 1) au numérateur et au dénominateur (tables, critères de divisibilité).</li><li>Je divise le numérateur et le dénominateur par ce nombre.</li><li>Je recommence jusqu'à obtenir une fraction irréductible.</li></ol></div>
  <p><b>Exemple :</b></p><p class="calc">${F(36,24)} = ${F("36 ÷ 6","24 ÷ 6")} = ${F(6,4)} = ${F("6 ÷ 2","4 ÷ 2")} = ${F(3,2)}</p><p>Ou, en une seule étape :</p><p class="calc">${F(36,24)} = ${F("36 ÷ 12","24 ÷ 12")} = ${F(3,2)}</p>`},
{k:"III", t:"Comparer des fractions", h:`
  <h4>1. Fractions de même dénominateur</h4>
  <div class="retenir" data-l="Propriété"><p>Si deux fractions ont le même dénominateur, la plus grande est celle qui a le plus grand numérateur.</p></div>
  <p><b>Exemple :</b> ${F(5,9)} &lt; ${F(7,9)} car 5 &lt; 7.</p>
  <h4>2. Fractions de dénominateurs différents</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je cherche un multiple commun aux deux dénominateurs.</li><li>J'écris les deux fractions avec ce dénominateur commun.</li><li>Je compare les numérateurs.</li></ol></div>
  <p><b>Exemple 1 :</b> comparer ${F(3,5)} et ${F(11,20)}.</p><p class="calc">${F(3,5)} = ${F("3 × 4","5 × 4")} = ${F(12,20)} &nbsp; et &nbsp; 12 &gt; 11, &nbsp; donc &nbsp; ${F(3,5)} &gt; ${F(11,20)}.</p>
  <p><b>Exemple 2 :</b> comparer ${F(5,6)} et ${F(7,9)}. 18 est un multiple de 6 et de 9.</p><p class="calc">${F(5,6)} = ${F(15,18)} &nbsp; et &nbsp; ${F(7,9)} = ${F(14,18)}, &nbsp; donc &nbsp; ${F(5,6)} &gt; ${F(7,9)}.</p>
  <p><b>Remarque :</b> une fraction est :</p><ul><li>inférieure à 1 si son numérateur est plus petit que son dénominateur (${F(4,7)} &lt; 1) ;</li><li>égale à 1 s'ils sont égaux ;</li><li>supérieure à 1 sinon.</li></ul>
  <p><b>À toi de jouer :</b> compare ${F(4,7)} et ${F(9,14)} en justifiant.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p class="calc">${F(4,7)} = ${F("4 × 2","7 × 2")} = ${F(8,14)} &nbsp; et &nbsp; 8 &lt; 9, &nbsp; donc &nbsp; ${F(4,7)} &lt; ${F(9,14)}.</p></div></details>`},
{k:"IV", t:"Additionner et soustraire des fractions", h:`
  <h4>1. Fractions de même dénominateur</h4>
  <div class="retenir" data-l="Propriété"><p>Pour additionner (ou soustraire) deux fractions de même dénominateur, on additionne (ou on soustrait) les numérateurs et <b>on garde le dénominateur</b>.</p><p class="calc">${F("a","c")} + ${F("b","c")} = ${F("a + b","c")} &nbsp;&nbsp; et &nbsp;&nbsp; ${F("a","c")} − ${F("b","c")} = ${F("a − b","c")} &nbsp;&nbsp; (avec c ≠ 0)</p></div>
  <p><b>Exemples :</b></p><div class="calcs"><div>${NL("A",`${F(3,7)} + ${F(2,7)} = ${F(5,7)}`)}</div><div>${NL("B",`${F(21,6)} − ${F(10,6)} = ${F(11,6)}`)}</div></div>
  <h4>2. Fractions de dénominateurs différents</h4>
  <div class="retenir" data-l="Méthode"><ol><li>Je cherche un multiple commun aux dénominateurs (le plus petit possible).</li><li>J'écris chaque fraction avec ce dénominateur.</li><li>J'additionne (ou je soustrais) les numérateurs et je garde le dénominateur.</li><li>Je simplifie le résultat si c'est possible.</li></ol></div>
  <p><b>Exemples :</b></p>
  <div class="calcs"><div>${NL("C",`${F(3,4)} + ${F(5,6)} = ${F(9,12)} + ${F(10,12)} = ${F(19,12)}`)}</div><div>${NL("D",`${F(11,12)} − ${F(1,4)} = ${F(11,12)} − ${F(3,12)} = ${F(8,12)} = ${F(2,3)}`)}</div><div>${NL("E",`2 − ${F(3,5)} = ${F(10,5)} − ${F(3,5)} = ${F(7,5)}`)}</div></div>
  <p>Pour E, on écrit l'entier avec le même dénominateur : 2 = ${F(10,5)}.</p>
  <div class="attention"><b>ATTENTION :</b> on n'additionne jamais les dénominateurs ! ${F(1,2)} + ${F(1,3)} n'est pas égal à ${F(2,5)}.<br>Le bon calcul est :${NL("F",`${F(1,2)} + ${F(1,3)} = ${F(3,6)} + ${F(2,6)} = ${F(5,6)}`)}</div>
  <h4>3. Résoudre un problème avec des fractions</h4>
  <p>Quand plusieurs fractions décrivent les parts d'un même tout, on les additionne.</p>
  <p>Le tout vaut 1 : la part qui reste est 1 moins la somme des parts connues.</p>
  <p><b>Exemple :</b> dans une boîte, ${F(1,4)} des briques sont rouges et ${F(1,3)} sont bleues.</p>
  <p>Les briques rouges ou bleues représentent :</p><p class="calc">${F(1,4)} + ${F(1,3)} = ${F(3,12)} + ${F(4,12)} = ${F(7,12)} de la boîte.</p>
  <p>Il reste :</p><p class="calc">1 − ${F(7,12)} = ${F(12,12)} − ${F(7,12)} = ${F(5,12)} de la boîte.</p>
  <p><b>À toi de jouer :</b> calcule G = ${F(5,6)} − ${F(1,4)} et donne le résultat sous forme irréductible.</p>
  <details><summary>Voir la correction</summary><div class="corr"><p>12 est un multiple de 6 et de 4.</p>${NL("G",`${F(5,6)} − ${F(1,4)} = ${F("5 × 2","6 × 2")} − ${F("1 × 3","4 × 3")} = ${F(10,12)} − ${F(3,12)} = ${F(7,12)}`)}<p>${F(7,12)} est irréductible.</p></div></details>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"Fractions et quotients", e:[
  {n:"Activité 1", t:"Partager une barre", w:"Sur ta feuille", h:`<p>Un constructeur partage des barres de <b>Lego</b>.</p>
   <p>1) Il coupe une barre de 3 dm en 4 morceaux de même longueur. Quelle est la longueur exacte d'un morceau ? Écris-la sous la forme d'une fraction, puis avec un nombre décimal.</p>
   <p>2) Il coupe maintenant une barre de 1 dm en 3 morceaux de même longueur. Quelle est la longueur exacte d'un morceau ? Peut-on l'écrire avec un nombre décimal ? Explique.</p>`,
   c:`<p>1) 3 ÷ 4 = ${F(3,4)} dm, soit 0,75 dm.</p><p>2) 1 ÷ 3 = ${F(1,3)} dm. La division « ne tombe pas juste » : on trouve 0,333… avec des 3 sans fin.</p><p>Le nombre ${F(1,3)} n'a donc pas d'écriture décimale exacte : on garde la fraction.</p>`},
  {n:"Exercice 1", t:"Opérations à trous", w:"Sur ta feuille", h:`<p>Donne le nombre manquant sous la forme d'une fraction (ou d'un entier).</p><p>Puis donne son écriture décimale quand elle existe.</p>
   <div class="scroll"><table class="std"><thead><tr><th>Égalité à compléter</th><th>Fraction</th><th>Écriture décimale</th></tr></thead><tbody>${["7 × …… = 35","10 × …… = 1","3 × …… = 7","4 × …… = 5","8 × …… = 3","6 × …… = 1"].map(x=>`<tr><td>${x}</td><td></td><td></td></tr>`).join("")}</tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Égalité</th><th>Fraction</th><th>Écriture décimale</th></tr></thead><tbody>
    <tr><td>7 × <b>5</b> = 35</td><td>5</td><td>5</td></tr>
    <tr><td>10 × <b>${F(1,10)}</b> = 1</td><td>${F(1,10)}</td><td>0,1</td></tr>
    <tr><td>3 × <b>${F(7,3)}</b> = 7</td><td>${F(7,3)}</td><td>pas d'écriture décimale exacte</td></tr>
    <tr><td>4 × <b>${F(5,4)}</b> = 5</td><td>${F(5,4)}</td><td>1,25</td></tr>
    <tr><td>8 × <b>${F(3,8)}</b> = 3</td><td>${F(3,8)}</td><td>0,375</td></tr>
    <tr><td>6 × <b>${F(1,6)}</b> = 1</td><td>${F(1,6)}</td><td>pas d'écriture décimale exacte</td></tr></tbody></table></div>`},
  {n:"Exercice 2", t:"Multiplier une fraction par son dénominateur", w:"Sur ta feuille", h:`<p>Complète.</p><p>a) 5 × ${F(3,5)} = …… · b) ${F(12,17)} × 17 = …… · c) 6 × ${F("…",6)} = 11 · d) ${F("…",9)} × 9 = 7 · e) 4 × ${F("…",4)} = 3 · f) ${F(9,13)} × …… = 9</p>`,
   c:`<p>On multiplie une fraction par son dénominateur : on trouve son numérateur. b × ${F("a","b")} = a.</p><p>a) 5 × ${F(3,5)} = <b>3</b></p><p>b) ${F(12,17)} × 17 = <b>12</b></p><p>c) 6 × <b>${F(11,6)}</b> = 11</p><p>d) <b>${F(7,9)}</b> × 9 = 7</p><p>e) 4 × <b>${F(3,4)}</b> = 3</p><p>f) ${F(9,13)} × <b>13</b> = 9</p>`},
  {n:"Exercice 3", t:"Lire des abscisses", w:"Sur ta feuille", h:`<p>Lis l'abscisse de chaque point sous la forme d'une fraction.</p>${fl({units:3, sub:4, pts:[["A",3],["B",5],["C",9],["D",11]]})}<p>A(……) &nbsp; B(……) &nbsp; C(……) &nbsp; D(……)</p>`,
   c:`<p>Chaque unité est partagée en 4.</p>${fl({units:3, sub:4, pts:[["A",3],["B",5],["C",9],["D",11]], show:true})}<p>A(${F(3,4)}) &nbsp; B(${F(5,4)}) &nbsp; C(${F(9,4)}) &nbsp; D(${F(11,4)})</p>`},
  {n:"Exercice 4", t:"Placer des fractions", w:"Sur ta feuille", h:`<p>Place les points demandés sur chaque droite, puis écris leur nom au-dessus.</p>
   <p>1) Sur la première droite : A(${F(1,3)}), B(${F(4,3)}) et C(${F(5,3)}).</p>${fl({units:2, sub:3})}
   <p>2) Sur la seconde droite : D(${F(3,10)}), E(${F(11,10)}) et G(${F(17,10)}).</p>${fl({units:2, sub:10})}`,
   c:`<p>1) Chaque unité est partagée en 3.</p>${fl({units:2, sub:3, pts:[["A",1],["B",4],["C",5]], show:true})}<p>2) Chaque unité est partagée en 10.</p>${fl({units:2, sub:10, pts:[["D",3],["E",11],["G",17]], show:true})}`},
  {n:"Exercice 5", t:"Partie entière et fraction", w:"Sur ton cahier", h:`<p>Écris chaque fraction sous la forme « entier + fraction inférieure à 1 ».</p><p>Aide-toi de la division euclidienne.</p><p>a) ${F(7,4)} · b) ${F(17,5)} · c) ${F(23,6)} · d) ${F(31,10)} · e) ${F(25,8)} · f) ${F(40,9)}</p>`,
   c:`<p>a) ${F(7,4)} = <b>1 + ${F(3,4)}</b> &nbsp; (7 = 4 × 1 + 3)</p><p>b) ${F(17,5)} = <b>3 + ${F(2,5)}</b> &nbsp; (17 = 5 × 3 + 2)</p><p>c) ${F(23,6)} = <b>3 + ${F(5,6)}</b> &nbsp; (23 = 6 × 3 + 5)</p><p>d) ${F(31,10)} = <b>3 + ${F(1,10)}</b> &nbsp; (31 = 10 × 3 + 1)</p><p>e) ${F(25,8)} = <b>3 + ${F(1,8)}</b> &nbsp; (25 = 8 × 3 + 1)</p><p>f) ${F(40,9)} = <b>4 + ${F(4,9)}</b> &nbsp; (40 = 9 × 4 + 4)</p>`},
  {n:"Exercice 6", t:"Prendre une fraction d'une quantité", w:"Sur ton cahier", h:`<p>Calcule.</p><p>a) les ${F(3,4)} de 20 · b) les ${F(2,5)} de 35 · c) les ${F(7,10)} de 40 · d) les ${F(5,6)} de 18 · e) les ${F(3,8)} de 64 · f) les ${F(4,9)} de 27</p>`,
   c:`<p>Je divise par le dénominateur, puis je multiplie par le numérateur.</p><div class="calcs">${[[3,4,20],[2,5,35],[7,10,40],[5,6,18],[3,8,64],[4,9,27]].map(([a,b,Q],i)=>`<div>${NL("ABCDEF"[i],`${Q} ÷ ${b} × ${a} = ${Q/b} × ${a} = <b>${Q/b*a}</b>`).replace('<p class="calc">',`<p class="calc">${"abcdef"[i]}) `)}</div>`).join("")}</div>`}
 ]},
{t:"Fractions égales et simplification", e:[
  {n:"Activité 2", t:"Des parts égales ?", w:"Sur ta feuille", h:`<p>Amélie et Victoire se partagent deux paquets de biscuits identiques.</p><p>Amélie mange les ${F(2,5)} du premier paquet. Victoire mange les ${F(6,15)} du second.</p>
   ${bars([{n:5,lab:"Amélie"},{n:15,lab:"Victoire"}], {alt:"Deux barres identiques : l'une partagée en 5, l'autre en 15"})}
   <p>1) Colorie la part mangée par chacune.</p><p>2) Laquelle a mangé le plus de biscuits ? Que peut-on dire des fractions ${F(2,5)} et ${F(6,15)} ?</p><p>3) Complète : ${F(2,5)} = ${F("2 × …","5 × …")} = ${F(6,"…")}.</p>`,
   c:`<p>1)</p>${bars([{n:5,k:2,lab:"Amélie"},{n:15,k:6,lab:"Victoire"}], {alt:"2 parts sur 5 et 6 parts sur 15 coloriées : même longueur"})}<p>2) Elles ont mangé la même quantité : les deux parts coloriées ont la même longueur. Donc ${F(2,5)} = ${F(6,15)}.</p><p>3) ${F(2,5)} = ${F("2 × 3","5 × 3")} = ${F(6,15)}.</p>`},
  {n:"Exercice 7", t:"Compléter des égalités de fractions", w:"Sur ta feuille", h:`<p>Complète.</p><p>a) ${F(3,4)} = ${F("…",20)} · b) ${F(2,7)} = ${F(10,"…")} · c) ${F(18,30)} = ${F("…",5)} · d) 4 = ${F("…",3)} · e) ${F(40,16)} = ${F("…",4)} · f) ${F(1,6)} = ${F("…",42)}</p>`,
   c:`<p>a) ${F(3,4)} = <b>${F(15,20)}</b> &nbsp; (× 5)</p><p>b) ${F(2,7)} = <b>${F(10,35)}</b> &nbsp; (× 5)</p><p>c) ${F(18,30)} = <b>${F(3,5)}</b> &nbsp; (÷ 6)</p><p>d) 4 = <b>${F(12,3)}</b> &nbsp; (4 × 3 = 12)</p><p>e) ${F(40,16)} = <b>${F(10,4)}</b> &nbsp; (÷ 4)</p><p>f) ${F(1,6)} = <b>${F(7,42)}</b> &nbsp; (× 7)</p>`},
  {n:"Exercice 8", t:"Reconnaître des fractions égales", w:"Sur ta feuille", h:`<p>Entoure toutes les fractions égales à la fraction donnée. Justifie sur ton cahier.</p>
   <p>a) Fractions égales à ${F(5,4)} : &nbsp; ${F(15,12)} &nbsp;&nbsp; ${F(6,5)} &nbsp;&nbsp; ${F(35,28)} &nbsp;&nbsp; ${F(4,5)} &nbsp;&nbsp; ${F(50,40)}</p>
   <p>b) Fractions égales à ${F(20,24)} : &nbsp; ${F(10,12)} &nbsp;&nbsp; ${F(30,34)} &nbsp;&nbsp; ${F(5,6)} &nbsp;&nbsp; ${F(60,72)} &nbsp;&nbsp; ${F(40,46)}</p>`,
   c:`<p>a) ${F(5,4)} = <b>${F(15,12)}</b> = <b>${F(35,28)}</b> = <b>${F(50,40)}</b> (on multiplie par 3, par 7 et par 10).</p><p>${F(6,5)} et ${F(4,5)} ne sont pas égales à ${F(5,4)}.</p>
   <p>b) ${F(20,24)} = ${F(5,6)} (on divise par 4).</p><p>Sont égales : <b>${F(10,12)}</b> (÷ 2 donne ${F(5,6)}), <b>${F(5,6)}</b> et <b>${F(60,72)}</b> (÷ 12 donne ${F(5,6)}).</p><p>${F(30,34)} et ${F(40,46)} ne le sont pas.</p>`},
  {n:"Exercice 9", t:"Simplifier des fractions", w:"Sur ton cahier", h:`<p>Simplifie chaque fraction au maximum. Détaille tes étapes.</p>${cols(["A) "+F(16,20),"B) "+F(30,18),"C) "+F(35,14),"D) "+F(80,60),"E) "+F(54,21),"F) "+F(18,72),"G) "+F(40,48),"H) "+F(45,60)])}`,
   c:`<p>A) ${F(16,20)} = ${F("16 ÷ 4","20 ÷ 4")} = <b>${F(4,5)}</b></p><p>B) ${F(30,18)} = ${F("30 ÷ 6","18 ÷ 6")} = <b>${F(5,3)}</b></p><p>C) ${F(35,14)} = ${F("35 ÷ 7","14 ÷ 7")} = <b>${F(5,2)}</b></p><p>D) ${F(80,60)} = ${F("80 ÷ 20","60 ÷ 20")} = <b>${F(4,3)}</b></p><p>E) ${F(54,21)} = ${F("54 ÷ 3","21 ÷ 3")} = <b>${F(18,7)}</b></p><p>F) ${F(18,72)} = ${F("18 ÷ 18","72 ÷ 18")} = <b>${F(1,4)}</b></p><p>G) ${F(40,48)} = ${F("40 ÷ 8","48 ÷ 8")} = <b>${F(5,6)}</b></p><p>H) ${F(45,60)} = ${F("45 ÷ 15","60 ÷ 15")} = <b>${F(3,4)}</b></p>`},
  {n:"Exercice 10", t:"Fractions irréductibles", w:"Sur ta feuille", h:`<p>Parmi ces fractions, lesquelles sont irréductibles ? Entoure-les.</p><p>${[[7,12],[15,21],[8,9],[14,35],[11,22],[9,10]].map(([a,b])=>F(a,b)).join(" &nbsp;&nbsp;&nbsp; ")}</p>`,
   c:`<p>${F(7,12)} : <b>irréductible</b></p><p>${F(15,21)} : non, ${F(15,21)} = ${F(5,7)} (÷ 3)</p><p>${F(8,9)} : <b>irréductible</b></p><p>${F(14,35)} : non, ${F(14,35)} = ${F(2,5)} (÷ 7)</p><p>${F(11,22)} : non, ${F(11,22)} = ${F(1,2)} (÷ 11)</p><p>${F(9,10)} : <b>irréductible</b></p>`},
  {n:"Exercice 11", t:"Trouver l'intrus", w:"Sur ton cahier", h:`<p>Parmi ces fractions, une seule n'est pas égale aux autres : laquelle ? Justifie.</p><p>${[[3,5],[6,10],[9,15],[12,25],[15,25],[30,50]].map(([a,b])=>F(a,b)).join(" &nbsp;&nbsp;&nbsp; ")}</p>`,
   c:`<p>Les fractions ${F(6,10)}, ${F(9,15)}, ${F(15,25)} et ${F(30,50)} se simplifient toutes en ${F(3,5)} (on divise par 2, par 3, par 5 et par 10).</p><p>Mais ${F(12,25)} est irréductible : <b>${F(12,25)} est l'intrus</b>.</p>`}
 ]},
{t:"Comparer des fractions", e:[
  {n:"Exercice 12", t:"Même dénominateur", w:"Sur ta feuille", h:`<p>Complète avec &lt;, &gt; ou =.</p><p>a) ${F(5,9)} …… ${F(7,9)} · b) ${F(13,8)} …… ${F(11,8)} · c) ${F(4,15)} …… ${F(9,15)} · d) ${F(21,10)} …… ${F(12,10)}</p>`,
   c:`<p>a) ${F(5,9)} <b>&lt;</b> ${F(7,9)} · b) ${F(13,8)} <b>&gt;</b> ${F(11,8)} · c) ${F(4,15)} <b>&lt;</b> ${F(9,15)} · d) ${F(21,10)} <b>&gt;</b> ${F(12,10)}</p><p><i>Même dénominateur : on compare les numérateurs.</i></p>`},
  {n:"Exercice 13", t:"Comparer avec un multiple", w:"Sur ton cahier", h:`<p>Compare chaque couple de fractions en justifiant.</p><p>a) ${F(3,5)} et ${F(11,20)} · b) ${F(7,4)} et ${F(5,2)} · c) ${F(2,3)} et ${F(7,12)} · d) ${F(9,10)} et ${F(4,5)} · e) ${F(12,35)} et ${F(2,7)} · f) ${F(8,5)} et ${F(21,15)}</p>`,
   c:`<p>a) ${F(3,5)} = ${F(12,20)} ; comme 12 &gt; 11, <b>${F(3,5)} &gt; ${F(11,20)}</b>.</p><p>b) ${F(5,2)} = ${F(10,4)} ; comme 7 &lt; 10, <b>${F(7,4)} &lt; ${F(5,2)}</b>.</p><p>c) ${F(2,3)} = ${F(8,12)} ; comme 8 &gt; 7, <b>${F(2,3)} &gt; ${F(7,12)}</b>.</p><p>d) ${F(4,5)} = ${F(8,10)} ; comme 9 &gt; 8, <b>${F(9,10)} &gt; ${F(4,5)}</b>.</p><p>e) ${F(2,7)} = ${F(10,35)} ; comme 12 &gt; 10, <b>${F(12,35)} &gt; ${F(2,7)}</b>.</p><p>f) ${F(8,5)} = ${F(24,15)} ; comme 24 &gt; 21, <b>${F(8,5)} &gt; ${F(21,15)}</b>.</p>`},
  {n:"Exercice 14", t:"Des dénominateurs sans lien", w:"Sur ton cahier", h:`<p>Ici, aucun dénominateur n'est un multiple de l'autre. Compare chaque couple de fractions en justifiant.</p><p>a) ${F(5,6)} et ${F(7,9)} (essaie avec 18) · b) ${F(3,4)} et ${F(5,7)} (essaie avec 28) · c) ${F(7,10)} et ${F(8,15)} (essaie avec 30)</p>`,
   c:`<p>a) ${F(5,6)} = ${F(15,18)} et ${F(7,9)} = ${F(14,18)} ; comme 15 &gt; 14, <b>${F(5,6)} &gt; ${F(7,9)}</b>.</p><p>b) ${F(3,4)} = ${F(21,28)} et ${F(5,7)} = ${F(20,28)} ; comme 21 &gt; 20, <b>${F(3,4)} &gt; ${F(5,7)}</b>.</p><p>c) ${F(7,10)} = ${F(21,30)} et ${F(8,15)} = ${F(16,30)} ; comme 21 &gt; 16, <b>${F(7,10)} &gt; ${F(8,15)}</b>.</p>`},
  {n:"Exercice 15", t:"Ranger des fractions", w:"Sur ton cahier", h:`<p>1) Range dans l'ordre croissant : ${F(1,2)} ; ${F(3,4)} ; ${F(5,8)} ; ${F(7,16)} ; 1.</p><p>2) Range dans l'ordre décroissant : ${F(2,3)} ; ${F(5,6)} ; ${F(1,2)} ; ${F(3,4)} ; ${F(7,12)}.</p>`,
   c:`<p>1) Avec le dénominateur 16 : ${F(8,16)} ; ${F(12,16)} ; ${F(10,16)} ; ${F(7,16)} ; ${F(16,16)}.</p><p>Ordre croissant : <b>${F(7,16)} &lt; ${F(1,2)} &lt; ${F(5,8)} &lt; ${F(3,4)} &lt; 1</b></p><p>2) Avec le dénominateur 12 : ${F(8,12)} ; ${F(10,12)} ; ${F(6,12)} ; ${F(9,12)} ; ${F(7,12)}.</p><p>Ordre décroissant : <b>${F(5,6)} &gt; ${F(3,4)} &gt; ${F(2,3)} &gt; ${F(7,12)} &gt; ${F(1,2)}</b></p>`},
  {n:"Exercice 16", t:"Château ou vaisseau ?", w:"Sur ton cahier", h:`<p>Léo a construit les ${F(7,12)} de son château en briques.</p><p>Mia a construit les ${F(5,8)} de son vaisseau.</p><p>Les deux constructions demandent le même nombre de briques.</p><p>Qui a le plus avancé ? Justifie.</p>`,
   c:`<p>24 est un multiple de 12 et de 8.</p><p class="calc">${F(7,12)} = ${F(14,24)} &nbsp; et &nbsp; ${F(5,8)} = ${F(15,24)}</p><p>Comme 14 &lt; 15, ${F(7,12)} &lt; ${F(5,8)} : c'est <b>Mia</b> qui a le plus avancé.</p>`}
 ]},
{t:"Additionner et soustraire des fractions", e:[
  {n:"Activité 3", t:"Partager un pain d'épices", w:"Sur ta feuille", h:`<p>Alice et Benoît se partagent un pain d'épices.</p><p>Alice en mange la moitié. Benoît en mange ${F(1,6)}.</p>
   ${bars([{n:6,lab:"Le pain d'épices"}], {lw:150, w:420, alt:"Un pain d'épices partagé en 6 parts égales"})}
   <p>1) Colorie la part d'Alice puis celle de Benoît (avec deux couleurs).</p><p>2) Écris la part d'Alice avec des sixièmes : ${F(1,2)} = ${F("…",6)}.</p><p>3) Quelle fraction du pain d'épices ont-ils mangée à eux deux ? Quelle fraction reste-t-il ?</p>`,
   c:`<p>1) Alice : 3 parts (en orange). Benoît : 1 part (en bleu).</p>${bars([{n:6,k:3,k2:1,lab:"Le pain d'épices"}], {lw:150, w:420, alt:"3 parts sur 6 en orange pour Alice, 1 part en bleu pour Benoît"})}
   <p>2) ${F(1,2)} = ${F(3,6)}.</p><p>3) ${F(1,2)} + ${F(1,6)} = ${F(3,6)} + ${F(1,6)} = ${F(4,6)} = ${F(2,3)} : ils ont mangé les <b>${F(2,3)}</b> du pain d'épices.</p><p>Il reste 1 − ${F(2,3)} = ${F(3,3)} − ${F(2,3)} = <b>${F(1,3)}</b>.</p>`},
  {n:"Exercice 17", t:"Même dénominateur", w:"Sur ton cahier", h:`<p>Calcule, puis simplifie le résultat si c'est possible.</p>${cols([`A = ${F(1,7)} + ${F(2,7)}`,`B = ${F(9,6)} − ${F(4,6)}`,`C = ${F(3,10)} + ${F(5,10)}`,`D = ${F(3,9)} + ${F(6,9)}`,`E = ${F(10,12)} + ${F(8,12)}`,`F = ${F(47,30)} − ${F(2,30)}`,`G = ${F(20,24)} + ${F(10,24)}`,`H = ${F(40,42)} − ${F(5,42)}`,`I = ${F(59,32)} − ${F(31,32)}`])}`,
   c:[["A",1,7,"+",2,7],["B",9,6,"−",4,6],["C",3,10,"+",5,10],["D",3,9,"+",6,9],["E",10,12,"+",8,12],["F",47,30,"−",2,30],["G",20,24,"+",10,24],["H",40,42,"−",5,42],["I",59,32,"−",31,32]].map(([n,a,b,o,c,d])=>`<div>${NL(n,steps2(a,b,o,c,d))}</div>`).join("").replace(/^/,'<p>Même dénominateur : on additionne (ou on soustrait) les numérateurs et on garde le dénominateur. Puis on simplifie.</p><div class="calcs">')+"</div>"},
  {n:"Exercice 18", t:"Dénominateurs différents", w:"Sur ton cahier", h:`<p>Calcule, puis simplifie le résultat si c'est possible.</p>${cols([`A = ${F(3,20)} + ${F(2,5)}`,`B = ${F(3,4)} + ${F(11,12)}`,`C = ${F(25,36)} − ${F(6,9)}`,`D = ${F(1,4)} + ${F(2,32)}`,`E = ${F(10,8)} − ${F(2,40)}`,`F = ${F(7,21)} + ${F(4,3)}`,`G = ${F(5,6)} − ${F(3,10)}`,`H = ${F(4,5)} + 2`,`I = 4 − ${F(2,3)}`])}`,
   c:[["A",3,20,"+",2,5],["B",3,4,"+",11,12],["C",25,36,"−",6,9],["D",1,4,"+",2,32],["E",10,8,"−",2,40],["F",7,21,"+",4,3],["G",5,6,"−",3,10],["H",4,5,"+",2,1],["I",4,1,"−",2,3]].map(([n,a,b,o,c,d])=>`<div>${NL(n,steps2(a,b,o,c,d))}</div>`).join("").replace(/^/,'<p>On écrit les deux fractions avec le même dénominateur (un multiple commun), puis on calcule et on simplifie.</p><div class="calcs">')+"</div>"},
  {n:"Exercice 19", t:"Trouver l'erreur", w:"Sur ton cahier", h:`<p>Deux élèves se sont trompés. Explique chaque erreur, puis donne le bon résultat.</p><p>1) Juliette a écrit : ${F(2,3)} + ${F(1,4)} = ${F(3,7)}.</p><p>2) Hugo a écrit : ${F(5,6)} − ${F(1,3)} = ${F(4,3)}.</p>`,
   c:`<p>1) Juliette a additionné les numérateurs <b>et</b> les dénominateurs. Il faut d'abord mettre les fractions sur le même dénominateur :</p>${NL("A",`${F(2,3)} + ${F(1,4)} = ${F(8,12)} + ${F(3,12)} = <b>${F(11,12)}</b>`)}
   <p>2) Hugo a soustrait les numérateurs et les dénominateurs. Le bon calcul est :</p>${NL("B",`${F(5,6)} − ${F(1,3)} = ${F(5,6)} − ${F(2,6)} = ${F(3,6)} = <b>${F(1,2)}</b>`)}<p>Le résultat de Hugo est d'ailleurs supérieur à ${F(5,6)} : impossible pour une soustraction.</p>`},
  {n:"Exercice 20", t:"Enchaîner les calculs", w:"Sur ton cahier", h:`<p>Calcule en détaillant (de gauche à droite, avec un dénominateur commun).</p>${cols([`A = ${F(1,2)} + ${F(1,3)} + ${F(1,6)}`,`B = ${F(3,4)} − ${F(1,2)} + ${F(1,8)}`,`C = ${F(5,6)} − ${F(1,3)} + ${F(1,12)}`,`D = 2 − ${F(1,4)} − ${F(3,8)}`])}`,
   c:`<div class="calcs"><div>${NL("A",`${F(1,2)} + ${F(1,3)} + ${F(1,6)} = ${F(3,6)} + ${F(2,6)} + ${F(1,6)} = ${F(6,6)} = <b>1</b>`)}</div><div>${NL("B",`${F(3,4)} − ${F(1,2)} + ${F(1,8)} = ${F(6,8)} − ${F(4,8)} + ${F(1,8)} = <b>${F(3,8)}</b>`)}</div><div>${NL("C",`${F(5,6)} − ${F(1,3)} + ${F(1,12)} = ${F(10,12)} − ${F(4,12)} + ${F(1,12)} = <b>${F(7,12)}</b>`)}</div><div>${NL("D",`2 − ${F(1,4)} − ${F(3,8)} = ${F(16,8)} − ${F(2,8)} − ${F(3,8)} = <b>${F(11,8)}</b>`)}</div></div>`},
  {n:"Exercice 21", t:"Murs de briques", w:"Sur ta feuille", h:`<p>Dans un mur de briques, chaque brique est égale à la <b>somme</b> des deux briques placées juste en dessous.</p><p>Complète.</p><div class="figs">${wall(W1,[1,1,1,0,0,0])}${wall(W2,[1,0,1,1,0,1])}</div>`,
   c:`<div class="figs">${wall(W1,[1,1,1,0,0,0],true)}${wall(W2,[1,0,1,1,0,1],true)}</div>
   <p>Mur de gauche :</p><p class="calc">${F(1,2)} + ${F(1,4)} = ${F(2,4)} + ${F(1,4)} = ${F(3,4)} &nbsp;·&nbsp; ${F(1,4)} + ${F(3,4)} = ${F(4,4)} = 1 &nbsp;·&nbsp; ${F(3,4)} + 1 = ${F(3,4)} + ${F(4,4)} = ${F(7,4)}</p>
   <p>Mur de droite :</p><p class="calc">${F(5,12)} − ${F(1,4)} = ${F(5,12)} − ${F(3,12)} = ${F(2,12)} = ${F(1,6)}</p><p class="calc">${F(1,6)} + ${F(1,3)} = ${F(1,6)} + ${F(2,6)} = ${F(3,6)} = ${F(1,2)}</p><p>On vérifie :</p><p class="calc">${F(5,12)} + ${F(1,2)} = ${F(5,12)} + ${F(6,12)} = ${F(11,12)}</p>`}
 ]},
{t:"Problèmes", e:[
  {n:"Exercice 22", t:"La boîte de briques", w:"Sur ton cahier", h:`<p>Une boîte contient 120 briques Lego.</p><p>${F(1,4)} des briques sont rouges, ${F(1,3)} sont bleues, ${F(1,6)} sont jaunes et les autres sont vertes.</p><p>1) Quelle fraction de la boîte représentent les briques rouges ou bleues ?</p><p>2) Quelle fraction de la boîte représentent les briques vertes ?</p><p>3) Combien y a-t-il de briques de chaque couleur ?</p>`,
   c:`<p>1) ${F(1,4)} + ${F(1,3)} = ${F(3,12)} + ${F(4,12)} = <b>${F(7,12)}</b></p><p>2) Rouges, bleues et jaunes : ${F(3,12)} + ${F(4,12)} + ${F(2,12)} = ${F(9,12)} = ${F(3,4)}.</p><p>Vertes : 1 − ${F(3,4)} = <b>${F(1,4)}</b>.</p><p>3) Rouges : 120 ÷ 4 = <b>30</b> ; bleues : 120 ÷ 3 = <b>40</b> ; jaunes : 120 ÷ 6 = <b>20</b> ; vertes : 120 ÷ 4 = <b>30</b>.</p><p>Vérification : 30 + 40 + 20 + 30 = 120.</p>`},
  {n:"Exercice 23", t:"Une tour en briques", w:"Sur ton cahier", h:`<p>Max avait 96 briques pour construire une tour.</p><p>Le samedi, il en utilise les ${F(3,8)}. Le dimanche, il en utilise ${F(1,4)}.</p><p>1) Quelle fraction de ses briques a-t-il utilisée en tout ?</p><p>2) Combien de briques lui reste-t-il à la fin du dimanche ?</p>`,
   c:`<p>1) ${F(3,8)} + ${F(1,4)} = ${F(3,8)} + ${F(2,8)} = <b>${F(5,8)}</b></p><p>2) Il reste 1 − ${F(5,8)} = ${F(3,8)} des briques : 96 ÷ 8 × 3 = <b>36 briques</b>.</p>`},
  {n:"Exercice 24", t:"Le budget de Zoé", w:"Sur ton cahier", h:`<p>Zoé a un budget de 60 € pour ses cadeaux Lego.</p><p>Elle dépense les ${F(2,5)} du budget pour un vaisseau et le ${F(1,3)} du budget pour une voiture.</p><p>1) Quelle fraction du budget a-t-elle dépensée ?</p><p>2) Quelle somme lui reste-t-il ?</p>`,
   c:`<p>1) ${F(2,5)} + ${F(1,3)} = ${F(6,15)} + ${F(5,15)} = <b>${F(11,15)}</b></p><p>2) Il reste 1 − ${F(11,15)} = ${F(15,15)} − ${F(11,15)} = ${F(4,15)} du budget : 60 ÷ 15 × 4 = <b>16 €</b>.</p>`},
  {n:"Exercice 25", t:"Pour aller plus loin : fractions égyptiennes", w:"Sur ton cahier", h:`<p>Les Égyptiens de l'Antiquité n'écrivaient que des fractions de numérateur 1.</p><p>Écris chaque fraction comme la somme de <b>deux fractions de numérateur 1 différentes</b>.</p><p>Aide : les dénominateurs sont des diviseurs du dénominateur de départ.</p><p>a) ${F(3,4)} · b) ${F(5,6)} · c) ${F(7,12)} · d) ${F(2,3)}</p>`,
   c:`<p>a) ${F(3,4)} = <b>${F(1,2)} + ${F(1,4)}</b> &nbsp; car ${F(2,4)} + ${F(1,4)} = ${F(3,4)}</p><p>b) ${F(5,6)} = <b>${F(1,2)} + ${F(1,3)}</b> &nbsp; car ${F(3,6)} + ${F(2,6)} = ${F(5,6)}</p><p>c) ${F(7,12)} = <b>${F(1,3)} + ${F(1,4)}</b> &nbsp; car ${F(4,12)} + ${F(3,12)} = ${F(7,12)}</p><p>d) ${F(2,3)} = <b>${F(1,2)} + ${F(1,6)}</b> &nbsp; car ${F(3,6)} + ${F(1,6)} = ${F(4,6)} = ${F(2,3)}</p>`}
 ]}
],

/* ÉVAL-5b début */
/* ===================== ÉVALUATION D'ENTRAÎNEMENT (+ version aménagée « bep ») ===================== */
eval:(()=>{
const pn = v => String(v).replace(".",",");
const pts = v => `${pn(v)} point${v>=2?"s":""}`;
const pt = v => ` <i>(${pts(v)})</i>`;
const exl = (X, ids) => { const s=ids.reduce((a,i)=>a+X[i-1].p,0); return (ids.length===1?`Ex. ${ids[0]}`:`Ex. ${ids.slice(0,-1).join(", ")} et ${ids[ids.length-1]}`)+` (${pts(s)})`; };
const COMP = [
  ["REPRÉSENTER","Je lis et je place une fraction sur une droite graduée ; j'écris une fraction comme la somme d'un entier et d'une fraction inférieure à 1.",[1]],
  ["CALCULER","Je simplifie, je compare, j'additionne et je soustrais des fractions.",[2,3,4]],
  ["CHERCHER","Je résous un problème avec des fractions (parts d'un tout, fraction d'une quantité).",[5]]
];
const DG = fl({units:3, sub:3, pts:[["K",4],["L",8]], alt:"Droite graduée de 0 à 3, chaque unité est partagée en 3 ; les points K et L sont placés"});
const DGc = fl({units:3, sub:3, pts:[["P",2],["K",4],["Q",7],["L",8]], show:true, alt:"Correction : les points P, K, Q et L avec leurs abscisses"});
const BARc = bars([{n:9,k:4,k2:3}], {lw:4, w:450, alt:"Le sentier partagé en 9 parts : 4 parts en orange (1er jour), 3 parts en bleu (2e jour), 2 parts blanches (3e jour)"});
const L = (b, list) => list.filter(q=>!(b && q.rm));
const lab = i => "abcdefgh"[i]+")";
const num = i => (i+1)+".";
const mk = b => {
  /* ---------- Exercice 1 ---------- */
  const q1 = L(b, [
    {h:`Lis l'abscisse des points K et L.`, p:1, pb:1,
     c:`<p>Chaque unité est partagée en 3 : une graduation vaut ${F(1,3)}.</p><p>K est à 4 graduations de 0 et L à 8 graduations : <b>K(${F(4,3)})</b> et <b>L(${F(8,3)})</b>.`},
    {h:`Place sur la droite le point P d'abscisse ${F(2,3)} et le point Q d'abscisse ${F(7,3)}.`, p:1, pb:1.5,
     c:`<p>Je compte 2 graduations à partir de 0 pour P, et 7 graduations pour Q.</p>${DGc}<p>Voir la figure.`},
    {h:`Écris ${F(8,3)} comme la somme d'un entier et d'une fraction inférieure à 1.`, p:1, pb:1,
     c:`<p>8 = 3 × 2 + 2, donc :</p><p class="calc">${F(8,3)} = ${F(6,3)} + ${F(2,3)} = 2 + ${F(2,3)}</p><p>On le voit sur la droite : L est entre 2 et 3.`},
    {h:`Quel point de la droite a pour abscisse ${F(14,6)} ? Justifie.`, p:1, rm:true,
     c:`<p class="calc">${F(14,6)} = ${F("14 ÷ 2","6 ÷ 2")} = ${F(7,3)}</p><p>C'est le point <b>Q</b>.`}
  ]);
  /* ---------- Exercice 2 ---------- */
  const SIMP = [[20,35,5,"4/7"],[48,18,6,"8/3"],[63,81,9,"7/9"],[120,150,30,"4/5"]];
  const q2 = L(b, [
    ...SIMP.map(([a,d,k,r],i)=>({h:`${F(a,d)}`, p:0.5, pb:0.5, rm:i===3,
      c:`<p class="calc">${F(a,d)} = ${F(`${a} ÷ ${k}`,`${d} ÷ ${k}`)} = <b>{${r}}</b>${i===3?` &nbsp; <i>(ou en deux étapes : ÷ 10, puis ÷ 3)</i>`:""}</p>`})),
    {h:`La fraction ${F(35,49)} est-elle irréductible ? Justifie.`, p:1, pb:1.5,
     c:`<p><b>Non.</b> 35 = 5 × 7 et 49 = 7 × 7 : 7 est un diviseur commun de 35 et de 49.</p><p class="calc">${F(35,49)} = ${F("35 ÷ 7","49 ÷ 7")} = ${F(5,7)}</p><p>${F(35,49)} n'est donc pas irréductible.`}
  ]);
  const n2 = b ? 3 : 4;
  /* ---------- Exercice 3 ---------- */
  const q3 = [
    {h:`${F(7,12)} …… ${F(2,3)}`, p:0.5, pb:0.5,
     c:`<p class="calc">${F(2,3)} = ${F("2 × 4","3 × 4")} = ${F(8,12)} &nbsp; et &nbsp; 7 &lt; 8, &nbsp; donc &nbsp; <b>${F(7,12)} &lt; ${F(2,3)}</b></p>`},
    {h:`${F(11,8)} …… 1`, p:0.5, pb:0.5,
     c:`<p>Le numérateur 11 est plus grand que le dénominateur 8, donc <b>${F(11,8)} &gt; 1</b>.</p>`},
    {h:`${F(4,9)} …… ${F(5,12)}`, p:0.5, pb:0.5,
     c:`<p>36 est un multiple de 9 et de 12.</p><p class="calc">${F(4,9)} = ${F("4 × 4","9 × 4")} = ${F(16,36)} &nbsp; et &nbsp; ${F(5,12)} = ${F("5 × 3","12 × 3")} = ${F(15,36)}</p><p>16 &gt; 15, donc <b>${F(4,9)} &gt; ${F(5,12)}</b>.</p>`},
    {h:`Range ces fractions dans l'ordre <b>décroissant</b> (de la plus grande à la plus petite) : ${F(3,5)} ; ${F(7,10)} ; ${F(1,2)} ; ${F(13,20)}.`, p:1.5, pb:1.5,
     c:`<p>J'écris toutes les fractions avec le dénominateur 20 :</p><p class="calc">${F(3,5)} = ${F(12,20)} &nbsp;·&nbsp; ${F(7,10)} = ${F(14,20)} &nbsp;·&nbsp; ${F(1,2)} = ${F(10,20)} &nbsp;·&nbsp; ${F(13,20)}</p><p>14 &gt; 13 &gt; 12 &gt; 10, donc :</p><p class="calc"><b>${F(7,10)} &gt; ${F(13,20)} &gt; ${F(3,5)} &gt; ${F(1,2)}</b></p>`}
  ];
  /* ---------- Exercice 4 ---------- */
  const C4 = L(b, [
    {n:"A", a:[13,10,"−",3,10], p:1, pb:1, r:`1`},
    {n:"B", a:[2,3,"+",5,12], p:1, pb:1.5},
    {n:"C", a:[9,14,"−",2,7], p:1, pb:1.5},
    {n:"D", a:[3,1,"−",7,4], p:1, pb:1},
    {n:"E", a:[3,4,"+",1,6], p:1, rm:true}
  ]);
  const w4 = ([a,c]) => c===1 ? String(a) : F(a,c);
  /* ---------- Exercice 5 ---------- */
  const q5 = L(b, [
    {h:`Le premier jour, Yanis parcourt les ${F(4,9)} du sentier. Combien de kilomètres parcourt-il ce jour-là ?`, p:1, pb:1.5,
     c:`<p>Je prends les ${F(4,9)} de 18 km : je divise par 9, puis je multiplie par 4.</p>${NL("A",`18 ÷ 9 × 4 = 2 × 4 = 8`)}<p>Le premier jour, Yanis parcourt <b>8 km</b>.`},
    {h:`Le deuxième jour, il parcourt ${F(1,3)} du sentier. Quelle fraction du sentier a-t-il parcourue pendant ces deux jours ?`, p:1.5, pb:2,
     c:`<p>J'additionne les deux parts du même sentier. 9 est un multiple de 3.</p><p class="calc">${F(4,9)} + ${F(1,3)} = ${F(4,9)} + ${F("1 × 3","3 × 3")} = ${F(4,9)} + ${F(3,9)} = ${F(7,9)}</p><p>En deux jours, il a parcouru les <b>${F(7,9)}</b> du sentier.`},
    {h:`Quelle fraction du sentier lui reste-t-il à parcourir le troisième jour ? Combien de kilomètres cela fait-il ?`, p:1.5, pb:2,
     c:`<p>Le sentier entier vaut 1.</p><p class="calc">1 − ${F(7,9)} = ${F(9,9)} − ${F(7,9)} = ${F(2,9)}</p><p>Il lui reste les <b>${F(2,9)}</b> du sentier, soit :</p>${NL("B",`18 ÷ 9 × 2 = 2 × 2 = 4`)}${BARc}<p><i>Orange : le 1<sup>er</sup> jour (${F(4,9)}) · bleu : le 2<sup>e</sup> jour (${F(3,9)}) · blanc : le 3<sup>e</sup> jour (${F(2,9)}).</i></p><p>Il lui reste <b>4 km</b> à parcourir.`},
    {h:`A-t-il parcouru plus de kilomètres le premier jour ou le deuxième jour ? Justifie.`, p:1, rm:true,
     c:`<p class="calc">${F(1,3)} = ${F(3,9)} &nbsp; et &nbsp; ${F(3,9)} &lt; ${F(4,9)}</p><p>Il a parcouru plus de kilomètres le <b>premier jour</b> (8 km, contre 18 ÷ 3 = 6 km le deuxième jour).`}
  ]);
  const sum = q => q.reduce((a,x)=>a+(b?x.pb:x.p),0);
  const wr = (q,i,f) => { const c=q.c.startsWith("<p>") ? `<p>${f(i)} `+q.c.slice(3) : `<p>${f(i)}</p>`+q.c; return (c.endsWith("</p>") ? c.slice(0,-4) : c)+pt(b?q.pb:q.p)+"</p>"; };
  const X = [
    {t:"Fractions sur une droite graduée", p:sum(q1),
     h:`<p>Sur la droite graduée ci-dessous, chaque unité est partagée en 3 parts égales.</p>${DG}${q1.map((q,i)=>`<p>${lab(i)} ${q.h}</p>`).join("")}`,
     c:q1.map((q,i)=>wr(q,i,lab)).join("")},
    {t:"Simplifier une fraction", p:sum(q2),
     h:`<p>Simplifie au maximum chaque fraction : écris une fraction irréductible.</p>${cols(q2.slice(0,n2).map((q,i)=>`${lab(i)} ${q.h} = ………`))}<p>${lab(n2)} ${q2[n2].h}</p>`,
     c:q2.map((q,i)=>wr(q,i,lab)).join("")},
    {t:"Comparer et ranger", p:sum(q3),
     h:`<p>Compare avec le signe &lt;, &gt; ou =. Écris ton calcul.</p>${cols(q3.slice(0,3).map((q,i)=>`${lab(i)} ${q.h}`))}<p>${lab(3)} ${q3[3].h}</p>`,
     c:q3.map((q,i)=>wr(q,i,lab)).join("")},
    {t:"Additionner et soustraire", p:sum(C4),
     h:`<p>Calcule. Écris toutes les étapes et donne le résultat sous la forme d'une fraction irréductible (ou d'un entier).</p>${cols(C4.map(q=>`${q.n} = ${w4([q.a[0],q.a[1]])} ${q.a[2]} ${w4([q.a[3],q.a[4]])}`))}`,
     c:`<p>Je mets les fractions au même dénominateur, j'additionne (ou je soustrais) les numérateurs et je garde le dénominateur. Puis je simplifie si c'est possible.</p>`
       + C4.map(q=>NL(q.n, steps2(...q.a)).replace(/<\/p>$/, pt(b?q.pb:q.p)+"</p>")).join("")
       + (C4.some(q=>q.n==="D") ? `<p>Pour D, j'écris l'entier avec le dénominateur 4 : 3 = ${F(12,4)}.</p>` : "")},
    {t:"Problème : le sentier côtier", p:sum(q5),
     h:`<p>Yanis parcourt un sentier côtier de <b>18 km</b> en trois jours.</p>${q5.map((q,i)=>`<p>${num(i)} ${q.h}</p>`).join("")}`,
     c:q5.map((q,i)=>wr(q,i,num)).join("")}
  ];
  return {X, comp:COMP.map(([k,t,ids])=>[k,t,exl(X,ids)])};
};
const N = mk(false), B = mk(true);
return {
titre:"Évaluation d'entraînement — Chapitre 7", duree:45, info:"Durée : 45 min · Calculatrice non autorisée · Règle et crayon",
comp:N.comp, exos:N.X,
bep:{
titre:"Évaluation d'entraînement — Chapitre 7 · version aménagée", duree:45, info:"Version aménagée · Durée : 45 min · Calculatrice non autorisée · Règle et crayon",
note:"Les mêmes exercices avec quatre questions en moins, dans le même temps (45 min). Le barème est recalculé pour rester sur 20. Les justifications sont toujours demandées.",
comp:B.comp, exos:B.X }
};
})(),
/* ÉVAL-5b fin */
/* ===================== QCM ===================== */
quiz:[
{nom:"Fraction, quotient et droite graduée", schema:S_Q, q:{
 1:[ {g:()=>{ const b=ri(3,9); let a; do{ a=ri(1,2*b); }while(a%b===0); return {q:`Complète : ${b} × …… = ${a}`, rep:uniq(`${a}/${b}`,[RS(a,b)]), ex:`Le nombre cherché est le quotient ${a} ÷ ${b} = ${F(a,b)}, car ${b} × ${F(a,b)} = ${a}.`, sx:S_Q}; }},
     {g:()=>{ const b=ri(3,19); let a; do{ a=ri(1,20); }while(a===b); return {q:`Calcule : ${F(a,b)} × ${b}`, rep:String(a), ex:`Multiplier ${F(a,b)} par son dénominateur ${b} donne le numérateur : ${a}.`, sx:S_Q}; }} ],
 2:[ {g:()=>{ const sub=pick([2,3,4,5,6,8,10]), units=sub>=8?2:3; let k; do{ k=ri(1,units*sub-1); }while(k%sub===0); return {q:"Quelle est l'abscisse du point A ? Écris-la sous forme de fraction.", fig:fl({units, sub, pts:[["A",k]], w:440}), rep:uniq(`${k}/${sub}`,[RS(k,sub)]), ex:`Chaque unité est partagée en ${sub} et A est à ${k} graduations de 0 : A(${F(k,sub)}).`, sx:fl({units, sub, pts:[["A",k]], show:true, w:420})}; }},
     {g:()=>{ const d=ri(3,9), e=ri(1,5), r=ri(1,d-1), n=d*e+r; const good=`${e} + ${F(r,d)}`; return {q:`Écris ${F(n,d)} sous la forme « entier + fraction inférieure à 1 ».`, c:uniq(good,[`${r} + ${F(e,d)}`,`${e+1} + ${F(r,d)}`,`${e} + ${F(r,n)}`]).slice(0,3), rep:good, ex:`${n} = ${d} × ${e} + ${r}, donc ${F(n,d)} = ${F(d*e,d)} + ${F(r,d)} = ${good}.`, sx:S_ENT}; }} ],
 3:[ {g:()=>{ const b=ri(3,10), a=ri(1,b-1), Q=b*ri(2,12); return {q:`Calcule ${a===1?"le":"les"} ${F(a,b)} de ${Q}.`, rep:String(Q/b*a), ex:`Je divise par ${b}, puis je multiplie par ${a}.`, sx:NL("A",`${Q} ÷ ${b} × ${a} = ${Q/b} × ${a} = ${Q/b*a}`)+S_PART}; }},
     {g:()=>{ const b=pick([3,6,7,9,4,5,8]); let a; do{ a=ri(1,3*b); }while(a%b===0); const s=simp(a,b), dec=[2,5].reduce((x,p)=>{ while(x%p===0) x/=p; return x; }, s[1])===1; return {q:`La fraction ${F(a,b)} a-t-elle une écriture décimale exacte ?`, c:["Oui","Non"], rep:dec?"Oui":"Non", ex: dec ? `${a} ÷ ${b} = ${String(+(a/b).toFixed(6)).replace(".",",")} : la division s'arrête.` : `${a} ÷ ${b} = ${String(Math.floor(a/b*10000)/10000).replace(".",",")}… : la division ne s'arrête pas. On garde la fraction.`, sx:S_Q}; }} ]
}},
{nom:"Fractions égales et simplification", schema:S_EG, q:{
 1:[ {g:()=>{ let a,b; do{ b=ri(2,9); a=ri(1,9); }while(gcd(a,b)!==1||a===b); const k=ri(2,9); return {q:`Complète : ${F(a,b)} = ${F("…",b*k)}`, rep:String(a*k), ex:`${b} × ${k} = ${b*k} : on multiplie aussi le numérateur par ${k}. ${F(a,b)} = ${F(`${a} × ${k}`,`${b} × ${k}`)} = ${F(a*k,b*k)}.`, sx:S_EG}; }},
     {g:()=>{ let a,b; do{ b=ri(2,9); a=ri(1,9); }while(gcd(a,b)!==1||a===b); const k=ri(2,9); return {q:`Complète : ${F(a*k,b*k)} = ${F("…",b)}`, rep:String(a), ex:`${b*k} ÷ ${k} = ${b} : on divise aussi le numérateur par ${k}. ${F(a*k,b*k)} = ${F(a,b)}.`, sx:S_EG}; }} ],
 2:[ {g:()=>{ let p,q; do{ p=ri(1,9); q=ri(2,9); }while(gcd(p,q)!==1); const k=ri(2,12); return {q:`Simplifie ${F(p*k,q*k)} au maximum (fraction irréductible).`, rep:`${p}/${q}`, ex:`${F(p*k,q*k)} = ${F(`${p*k} ÷ ${k}`,`${q*k} ÷ ${k}`)} = ${F(p,q)}.`, sx:S_SIMP}; }} ],
 3:[ {g:()=>{ let p,q; do{ p=ri(1,9); q=ri(2,11); }while(gcd(p,q)!==1||p===q); const ks=shuf([2,3,4,5,6,7,8,9,10]).slice(0,3); const goods=ks.slice(0,2).map(k=>F(p*k,q*k)); const bad=F(p*ks[2]+1,q*ks[2]);
       return {q:`Laquelle de ces fractions n'est <b>pas</b> égale à ${F(p,q)} ?`, c:[bad,...goods], rep:bad, ex:`${goods.join(" et ")} se simplifient en ${F(p,q)}. ${bad} n'est pas égale à ${F(p,q)} : ${F(p,q)} = ${F(p*ks[2],q*ks[2])}.`, sx:S_SIMP}; }},
     {g:()=>{ let p,q; do{ p=ri(1,12); q=ri(2,13); }while(gcd(p,q)!==1||p===q); const k1=pick([2,3,5,7]), k2=pick([2,3,5]); let a,b; do{ a=ri(2,11); b=ri(2,11); }while(gcd(a,b)!==1||a===b);
       const irr=F(p,q), r1=F(a*k1,b*k1), r2=F(a*k2*2,b*k2*2); return {q:"Laquelle de ces fractions est irréductible ?", c:uniq(irr,[r1,r2]), rep:irr, ex:`${irr} ne se simplifie pas. ${r1} se simplifie par ${k1}, ${r2} par ${2*k2}.`, sx:S_SIMP}; }} ]
}},
{nom:"Comparer des fractions", schema:S_CMP, q:{
 1:[ {g:()=>{ const d=ri(3,15); let a,b; do{ a=ri(1,2*d); b=ri(1,2*d); }while(a===b); return {q:`Compare : ${F(a,d)} …… ${F(b,d)}`, c:[LT,GT,"="], rep:cmp(a,d,b,d), ex:`Même dénominateur : on compare les numérateurs, ${a} ${cmp(a,1,b,1)} ${b}.`, sx:S_CMP}; }},
     {g:()=>{ const b=ri(3,12), a=pick([ri(1,b-1),b,ri(b+1,2*b)]); return {q:`Compare : ${F(a,b)} …… 1`, c:[LT,GT,"="], rep:cmp(a,b,1,1), ex:a<b?`Le numérateur est plus petit que le dénominateur : la fraction est inférieure à 1.`:a===b?`Numérateur et dénominateur égaux : la fraction vaut 1.`:`Le numérateur est plus grand que le dénominateur : la fraction est supérieure à 1.`, sx:S_CMP}; }} ],
 2:[ {g:()=>{ const d1=ri(2,9), m=ri(2,5), d2=d1*m; let a,c; do{ a=ri(1,2*d1); c=ri(1,2*d2); }while(a*m===c||gcd(a,d1)!==1||gcd(c,d2)!==1); const [x,y]=Math.random()<0.5?[[a,d1],[c,d2]]:[[c,d2],[a,d1]];
       return {q:`Compare : ${F(x[0],x[1])} …… ${F(y[0],y[1])}`, c:[LT,GT,"="], rep:cmp(x[0],x[1],y[0],y[1]), ex:`${F(a,d1)} = ${F(`${a} × ${m}`,`${d1} × ${m}`)} = ${F(a*m,d2)} ; on compare ${a*m} et ${c}.`, sx:S_CMP}; }} ],
 3:[ {g:()=>{ const [d1,d2]=shuf(pick(PAIRS)), L=lcm(d1,d2); let a,c; do{ a=ri(1,d1*2-1); c=ri(1,d2*2-1); }while(a*L/d1===c*L/d2||gcd(a,d1)!==1||gcd(c,d2)!==1);
       return {q:`Compare : ${F(a,d1)} …… ${F(c,d2)}`, c:[LT,GT,"="], rep:cmp(a,d1,c,d2), ex:`${L} est un multiple de ${d1} et de ${d2} : ${F(a,d1)} = ${F(a*L/d1,L)} et ${F(c,d2)} = ${F(c*L/d2,L)}.`, sx:S_CMP}; }},
     {g:()=>{ const D=pick([12,16,18,20,24]), ds=[2,3,4,5,6,8,9,10,12].filter(x=>D%x===0); let L; do{ L=[0,1,2].map(()=>{ let q=pick(ds),p; do{ p=ri(1,q-1); }while(gcd(p,q)!==1); return [p,q]; }); }while(new Set(L.map(([p,q])=>p*D/q)).size<3);
       const up=[...L].sort((u,v)=>u[0]/u[1]-v[0]/v[1]); const big=up[2]; return {q:`Quelle est la plus grande de ces fractions : ${L.map(([p,q])=>F(p,q)).join(" ; ")} ?`, c:L.map(([p,q])=>F(p,q)), rep:F(big[0],big[1]), ex:`Avec le dénominateur ${D} : ${L.map(([p,q])=>F(p*D/q,D)).join(" ; ")}.`, sx:S_CMP}; }} ]
}},
{nom:"Additionner et soustraire", schema:S_ADD, q:{
 1:[ {g:()=>{ const d=ri(3,12), a=ri(1,d-1), b=ri(1,d-1); return {q:`Calcule A = ${F(a,d)} + ${F(b,d)}`, rep:uniq(`${a+b}/${d}`,[RS(a+b,d)]), ex:`On additionne les numérateurs et on garde le dénominateur.`, sx:NL("A",steps2(a,d,"+",b,d))+S_ADD}; }},
     {g:()=>{ const d=ri(3,12), b=ri(1,d), a=b+ri(1,d); return {q:`Calcule A = ${F(a,d)} − ${F(b,d)}`, rep:uniq(`${a-b}/${d}`,[RS(a-b,d)]), ex:`On soustrait les numérateurs et on garde le dénominateur.`, sx:NL("A",steps2(a,d,"−",b,d))+S_ADD}; }} ],
 2:[ {g:()=>{ const d1=ri(2,6), m=ri(2,4), d2=d1*m, op=pick(["+","−"]); let a,c; do{ a=ri(1,2*d1); c=ri(1,d2); }while((op==="−"&&a*m<=c)||gcd(a,d1)!==1||gcd(c,d2)!==1||a===d1); const [p,q]=val2(a,d1,op,c,d2);
       return {q:`Calcule A = ${F(a,d1)} ${op} ${F(c,d2)} (résultat sous forme irréductible)`, rep:q===1?String(p):`${p}/${q}`, ex:"On écrit les deux fractions avec le même dénominateur.", sx:NL("A",steps2(a,d1,op,c,d2))+S_ADD}; }} ],
 3:[ {g:()=>{ const [d1,d2]=shuf(pick(PAIRS)), op=pick(["+","−"]); let a,c; do{ a=ri(1,2*d1); c=ri(1,d2); }while((op==="−"&&a*d2<=c*d1)||gcd(a,d1)!==1||gcd(c,d2)!==1||a===d1||c===d2); const [p,q]=val2(a,d1,op,c,d2);
       return {q:`Calcule A = ${F(a,d1)} ${op} ${F(c,d2)} (résultat sous forme irréductible)`, rep:q===1?String(p):`${p}/${q}`, ex:"On écrit les deux fractions avec le même dénominateur.", sx:NL("A",steps2(a,d1,op,c,d2))+S_ADD}; }},
     {g:()=>{ const n=ri(1,5), b=ri(2,9), a=ri(1,b-1); const [p,q]=val2(n,1,"−",a,b); return {q:`Calcule A = ${n} − ${F(a,b)} (résultat sous forme irréductible)`, rep:`${p}/${q}`, ex:`On écrit l'entier avec le même dénominateur : ${n} = ${F(n*b,b)}.`, sx:NL("A",steps2(n,1,"−",a,b))+S_ADD}; }},
     {g:()=>{ const [b,d]=shuf(pick(PAIRS)); let a,c; do{ a=ri(1,b-1); c=ri(1,d-1); }while(gcd(a,b)!==1||gcd(c,d)!==1); const [p,q]=val2(a,b,"+",c,d), good=fr(p,q);
       return {q:`A = ${F(a,b)} + ${F(c,d)}. Combien vaut A ?`, c:uniq(good,[F(a+c,b+d),F(a+c,b*d),fr(...simp(a*c,b*d))]).slice(0,3), rep:good, ex:`On n'additionne jamais les dénominateurs.`, sx:NL("A",steps2(a,b,"+",c,d))+S_ADD}; }} ]
}},
{nom:"Problèmes avec des fractions", schema:S_PB, q:{
 1:[ {g:()=>{ const [a,b]=shuf(pick([[2,6],[4,3],[3,6],[2,4],[4,8],[2,3],[2,5],[3,4],[5,10],[2,8]])); const L=lcm(a,b), [p,q]=val2(1,a,"+",1,b);
       return {q:`Alice mange ${F(1,a)} d'un gâteau et Benoît en mange ${F(1,b)}. Quelle fraction du gâteau ont-ils mangée à eux deux ?`, rep:uniq(fr(p,q).replace(/[{}]/g,""),[`${L/a+L/b}/${L}`]), ex:steps2(1,a,"+",1,b)+".", sx:S_PB}; }} ],
 2:[ {g:()=>{ const [a,b]=shuf(pick([[4,3],[2,6],[3,6],[2,4],[4,8],[2,3],[2,5],[3,4],[5,10],[2,8],[3,5],[4,6]])); const [p,q]=val2(1,a,"+",1,b), [r,s]=val2(1,1,"−",p,q);
       return {q:`Dans une boîte, ${F(1,a)} des briques sont rouges et ${F(1,b)} sont bleues. Les autres sont vertes. Quelle fraction de la boîte représentent les briques vertes ?`, rep:uniq(`${r}/${s}`,[`${r*lcm(a,b)/s}/${lcm(a,b)}`]), ex:`Rouges ou bleues : ${steps2(1,a,"+",1,b)}. Vertes : 1 − ${fr(p,q)} = ${F(q,q)} − ${fr(p,q)} = ${F(r,s)}.`, sx:S_PB}; }} ],
 3:[ {g:()=>{ const [d1,d2]=shuf(pick([[5,3],[4,3],[8,4],[6,4],[5,2],[3,6],[10,5],[4,6]])); let a1,a2; do{ a1=ri(1,d1-1); a2=ri(1,d2-1); }while(gcd(a1,d1)!==1||gcd(a2,d2)!==1||a1*lcm(d1,d2)/d1+a2*lcm(d1,d2)/d2>=lcm(d1,d2));
       const L=lcm(d1,d2), N=L*ri(2,10), [p,q]=val2(a1,d1,"+",a2,d2), [r,s]=val2(1,1,"−",p,q);
       return {q:`Zoé a ${N} €. Elle dépense ${a1===1?"le":"les"} ${F(a1,d1)} de cette somme pour un vaisseau et ${a2===1?"le":"les"} ${F(a2,d2)} pour une voiture. Combien d'euros lui reste-t-il ?`, rep:[String(N/s*r), `${N/s*r} €`], ex:`Dépensé : ${steps2(a1,d1,"+",a2,d2)}. Il reste ${F(r,s)} : ${N} ÷ ${s} × ${r} = ${N/s*r} €.`, sx:S_PB}; }} ]
}}
]
};
})();
