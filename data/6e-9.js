/* 6e — Chapitre 9 : Angles (1) (cours, fiche d'exercices et feuille de constructions de M. Staal)
   Mesures des figures relevées sur ses fiches ; corrections de la feuille de constructions tracées en vraie grandeur. */
(function(){
const VF = ["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const A = n => `<span class="ang">${n}</span>`;
const co = (p,alt,w) => img("c69co/"+p+".png", alt, w);
const ex = (p,alt,w) => img("c69ex/"+p+".png", alt, w);
const kk = (p,alt,w) => img("c69k/"+p+".png", alt, w);
const sch = (t, body) => `<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const ORANGE="#e08a00", BLUE="#1e5aa8", RED="#d0342c";

/* angle en SVG : sommet, deux côtés (en degrés), noms */
function angSVG(a1, a2, o={}){
  const W=o.w||220, H=o.h||150, cx=o.cx||W/2, cy=o.cy||H-30, L=o.L||95, r=o.r||26;
  const d=a=>[cx+L*Math.cos(a*Math.PI/180), cy-L*Math.sin(a*Math.PI/180)];
  const [x1,y1]=d(a1), [x2,y2]=d(a2), lo=Math.min(a1,a2), hi=Math.max(a1,a2);
  const arc=(r)=>{ const p=a=>[cx+r*Math.cos(a*Math.PI/180), cy-r*Math.sin(a*Math.PI/180)]; const [ax,ay]=p(lo),[bx,by]=p(hi); return `M${cx} ${cy} L${ax.toFixed(1)} ${ay.toFixed(1)} A${r} ${r} 0 ${hi-lo>180?1:0} 0 ${bx.toFixed(1)} ${by.toFixed(1)} Z`; };
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${o.alt||"Un angle"}">`;
  if(o.code!==false) s+= hi-lo===90 ? `<path d="M${cx+12*Math.cos(lo*Math.PI/180)} ${cy-12*Math.sin(lo*Math.PI/180)} l${(12*Math.cos(hi*Math.PI/180)).toFixed(1)} ${(-12*Math.sin(hi*Math.PI/180)).toFixed(1)} L${cx+12*Math.cos(hi*Math.PI/180)} ${cy-12*Math.sin(hi*Math.PI/180)}" style="fill:none;stroke:${ORANGE};stroke-width:2"/>` : `<path d="${arc(r)}" style="fill:${ORANGE};fill-opacity:.22;stroke:${ORANGE};stroke-width:2"/>`;
  s+=`<line x1="${cx}" y1="${cy}" x2="${x1.toFixed(1)}" y2="${y1.toFixed(1)}" class="ln"/><line x1="${cx}" y1="${cy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="ln"/>`;
  if(o.names){ const [n1,n0,n2]=o.names; const t=(x,y,n)=>`<text x="${x}" y="${y}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:var(--ink)">${n}</text>`;
    s+=t(cx-4,cy+20,n0)+t((x1+(x1-cx)*0.12).toFixed(1),(y1+(y1-cy)*0.12+5).toFixed(1),n1)+t((x2+(x2-cx)*0.12).toFixed(1),(y2+(y2-cy)*0.12+5).toFixed(1),n2); }
  if(o.label){ const md=(lo+hi)/2*Math.PI/180, rl=hi-lo<35?L+16:r+20; s+=`<text x="${(cx+rl*Math.cos(md)).toFixed(1)}" y="${(cy-rl*Math.sin(md)+5).toFixed(1)}" text-anchor="middle" style="font-size:14px;font-weight:700;fill:${ORANGE}">${o.label}</text>`; }
  return s+"</svg>";
}
window.FIG9 = {angSVG};

/* ===================== schémas ===================== */
const S_NOM = sch("Nommer un angle", angSVG(10,70,{names:["A","O","B"],alt:"L'angle AOB"})+`<p class="schN">Trois lettres et un chapeau. La lettre du <b>milieu</b> est toujours le <b>sommet</b> : ${A("AOB")} ou ${A("BOA")}.</p>`);
const S_NAT = sch("La nature d'un angle", co("natures","Angles nul, aigu, droit, obtus, plat",440)+`<p class="schN">aigu : entre 0° et 90° · droit : 90° · obtus : entre 90° et 180° · plat : 180°.</p>`);
const S_RAPP = sch("Lire le rapporteur", ex("act1","Le rapporteur posé sur l'angle ABC",240)+`<p class="schN">Je pars du 0 qui est <b>sur un côté</b> de l'angle, et je suis cette graduation. Si je trouve 152° pour un angle aigu, je me suis trompé de graduation : c'est 180 − 152 = 28°.</p>`);
const S_TAILLE = sch("La taille d'un angle", ex("e2","Deux champs de vision de même angle",320)+`<p class="schN">La taille d'un angle dépend de son <b>ouverture</b>, pas de la longueur de ses côtés.</p>`);
const S_LUTIN = sch("L'angle dont tourne le lutin", co("lutin","Le lutin tourne de 60°, l'angle entre les segments mesure 120°",180)+`<p class="schN">Le lutin tourne de 60° par rapport à sa direction : l'angle de la figure est 180° − 60° = 120°.</p>`);

CH["6e-9"] = {
intro:"Le vocabulaire de l'angle, nommer et coder un angle, sa nature, le mesurer et le construire au rapporteur, et programmer un déplacement avec des angles.",
savoir:[
  "connaître le vocabulaire de l'angle, nommer et coder un angle ;",
  "reconnaître un angle nul, aigu, droit, obtus ou plat ;",
  "estimer, puis mesurer un angle avec un rapporteur ;",
  "construire un angle de mesure donnée ;",
  "programmer un déplacement en utilisant des angles."
],

/* ===================== COURS ===================== */
cours:[
{k:"I", t:"La notion d'angle", h:`
  <h4>1. Définition</h4>
  <div class="retenir" data-l="Définition"><p>Un <b>angle</b> est une partie du plan délimitée par deux demi-droites de même origine. Cette origine est le <b>sommet</b> de l'angle ; les deux demi-droites sont ses <b>côtés</b>.</p></div>
  ${co("def","L'angle xOy : sommet O, côtés [Ox) et [Oy)",280)}
  <h4>2. Nommer et coder un angle</h4>
  <div class="retenir" data-l="Notation"><p>On nomme un angle avec <b>trois lettres</b>, surmontées d'un <b>chapeau</b>. La lettre du <b>milieu</b> est toujours le <b>sommet</b>.</p></div>
  <p><b>Exemples :</b> l'angle ci-dessus se note ${A("xOy")} ou ${A("yOx")}. Si A est sur [Ox) et B sur [Oy), on peut aussi l'écrire ${A("AOB")}, ${A("BOA")}, ${A("xOB")} ou ${A("AOy")}.</p>
  <p><b>Remarque :</b> pour coder un angle sur une figure, on trace un petit arc de cercle entre ses deux côtés, près du sommet.</p>
  <h4>3. La taille d'un angle</h4>
  <p class="attention"><b>ATTENTION :</b> la taille d'un angle ne dépend pas de la longueur de ses côtés : elle dépend seulement de son <b>ouverture</b>. Des côtés plus longs ne font pas un angle plus grand.</p>`},
{k:"II", t:"Nature et mesure d'un angle", h:`
  <h4>1. L'unité : le degré</h4>
  <p>Mesurer un angle, c'est mesurer son ouverture. L'unité est le <b>degré</b>, noté °. Un angle droit mesure 90°. On écrit par exemple : ${A("xOy")} = 40°.</p>
  <h4>2. La nature d'un angle</h4>
  <div class="retenir" data-l="À retenir"><div class="scroll"><table class="std"><thead><tr><th>Nature</th><th>Nul</th><th>Aigu</th><th>Droit</th><th>Obtus</th><th>Plat</th></tr></thead><tbody><tr><th>Mesure</th><td>0°</td><td>entre 0° et 90°</td><td>90°</td><td>entre 90° et 180°</td><td>180°</td></tr></tbody></table></div></div>
  ${co("natures","Angles nul, aigu, droit, obtus, plat",470)}
  <p><b>Remarque :</b> un angle plat est formé de deux demi-droites qui forment une droite : il vaut deux angles droits.</p>`},
{k:"III", t:"Mesurer un angle avec un rapporteur", h:`
  <div class="retenir" data-l="Méthode"><ol><li>J'estime d'abord la nature de l'angle : aigu ou obtus ? Je sais ainsi si la mesure est entre 0° et 90° ou entre 90° et 180°.</li><li>Je place le centre du rapporteur sur le sommet de l'angle.</li><li>Je fais tourner le rapporteur pour placer le 0 sur l'un des côtés.</li><li>Je suis la graduation qui part de ce 0, jusqu'à l'autre côté, et je lis la mesure.</li></ol></div>
  <div class="anim" data-anim="6e9-mesurer-rapporteur"></div>
  ${co("rapp","Le rapporteur posé sur l'angle ABC",470)}
  <p>On lit : ${A("ABC")} = 40°. C'est cohérent : l'angle est aigu.</p>
  <p class="attention"><b>ATTENTION :</b> un rapporteur a deux graduations. Si le 0 utilisé est celui de la graduation extérieure, je lis sur la graduation extérieure, et inversement. Si la mesure lue ne correspond pas à la nature de l'angle (par exemple 140° pour un angle aigu), je me suis trompé de graduation.</p>
  <p><i>Pour t'entraîner, le site a un rapporteur à manipuler : onglet Informatique de la page Sixième.</i></p>`},
{k:"IV", t:"Construire un angle de mesure donnée", h:`
  <p><b>Exemple :</b> construire l'angle ${A("AOB")} tel que ${A("AOB")} = 30°. C'est un angle aigu.</p>
  <div class="retenir" data-l="Méthode"><ol><li>Je trace un premier côté, la demi-droite [OA).</li><li>Je place le centre du rapporteur en O et le 0 sur [OA).</li><li>En suivant la graduation qui part de ce 0, je marque un petit point en face de 30.</li><li>Je retire le rapporteur, je trace la demi-droite [OB) qui passe par ce point, et je code l'angle.</li></ol></div>
  <div class="anim" data-anim="6e9-construire-angle"></div>
  ${co("constr","Les étapes de la construction de l'angle AOB = 30°",470)}`},
{k:"V", t:"Programmer un déplacement", h:`
  <p>Dans un logiciel de programmation comme Scratch, un lutin se déplace grâce à des instructions :</p>
  <ul><li>« avancer de … pas » : le lutin avance tout droit ;</li><li>« tourner ↻ de … degrés » ou « tourner ↺ de … degrés » : le lutin tourne sur lui-même, vers la droite ou vers la gauche ;</li><li>« s'orienter à … » : le lutin prend une direction précise (90 = vers la droite, 0 = vers le haut).</li></ul>
  <p><b>Exemple :</b> ce programme trace un carré de côté 100 pas.</p>
  ${co("carre","Programme : répéter 4 fois avancer de 100 pas, tourner de 90 degrés",260)}
  <p class="attention"><b>ATTENTION :</b> l'angle dont tourne le lutin n'est pas forcément l'angle de la figure tracée. Ci-dessous, le lutin tourne de 60°, mais l'angle entre les deux segments mesure 120°.</p>
  ${co("lutin","Le lutin tourne de 60°, l'angle entre les segments mesure 120°",170)}`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"La notion d'angle", e:[
  {n:"Exercice 1", t:"Le vocabulaire", w:"Sur ta feuille", h:`<p>Voici quatre angles.</p>${ex("e1","Quatre angles : ABC, FED, LKJ, TSR",490)}<p>1) Complète le tableau : sommet, côtés et nom de chaque angle.</p><p>2) Donne deux autres noms possibles pour l'angle n°2.</p>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th></th><th>Angle n°1</th><th>Angle n°2</th><th>Angle n°3</th><th>Angle n°4</th></tr></thead><tbody><tr><th>Sommet</th><td>B</td><td>E</td><td>K</td><td>S</td></tr><tr><th>Côtés</th><td>[BA) et [BC)</td><td>[EF) et [ED)</td><td>[KL) et [KJ)</td><td>[ST) et [SR)</td></tr><tr><th>Nom</th><td>${A("ABC")}</td><td>${A("FED")}</td><td>${A("LKJ")}</td><td>${A("TSR")}</td></tr></tbody></table></div>
   <p>Chaque angle peut aussi se lire dans l'autre sens : ${A("CBA")}, ${A("DEF")}, ${A("JKL")}, ${A("RST")}.</p><p>2) L'angle n°2 se nomme ${A("FED")} ou ${A("DEF")}. Le sommet E doit toujours rester <b>au milieu</b> : ${A("EFD")} ou ${A("FDE")} sont faux.</p>`},
  {n:"Exercice 2", t:"Quel angle est le plus grand ?", w:"Sur ta feuille", h:`<p>Les deux personnages regardent devant eux. L'angle orange représente leur champ de vision.</p>${ex("e2","Personnage 1 et personnage 2 avec leur champ de vision",360)}<p>Lequel a le plus grand champ de vision ? Justifie.</p>`,
   c:`<p><b>Aucun : ils ont le même champ de vision.</b> Les deux angles ont la même ouverture (environ 45°).</p><p>Les côtés de l'angle du personnage 2 sont plus longs, mais la taille d'un angle ne dépend pas de la longueur de ses côtés : elle dépend seulement de son ouverture.</p>`}
 ]},
{t:"Nature et mesure d'un angle", e:[
  {n:"Exercice 3", t:"La nature d'un angle", w:"Sur ta feuille", h:`<p>À l'aide de ton équerre, indique la nature de chaque angle : aigu, droit ou obtus.</p>${ex("e3","Six angles a à f",400)}`,
   c:`a) <b>aigu</b> · b) <b>droit</b> · c) <b>obtus</b> · d) <b>aigu</b> · e) <b>obtus</b> · f) <b>droit</b><p><i>On place l'angle droit de l'équerre sur le sommet et sur un côté : si l'autre côté est « dans » l'équerre, l'angle est aigu ; s'il est en dehors, il est obtus.</i></p>`},
  {n:"Exercice 4", t:"Un QCM", w:"Sur ta feuille", h:`<p>Sans rapporteur, entoure la bonne mesure de chaque angle. Les angles sont numérotés de 1 à 4.</p>${ex("e4","Quatre angles numérotés de 1 à 4",490)}<p>1) 30° · 80° · 100° &nbsp; 2) 80° · 100° · 150° &nbsp; 3) 80° · 100° · 140° &nbsp; 4) 75° · 85° · 95°</p>`,
   c:`1) <b>30°</b> (angle très aigu) · 2) <b>100°</b> (un peu plus qu'un angle droit) · 3) <b>140°</b> (obtus, très ouvert) · 4) <b>85°</b> (un peu moins qu'un angle droit)`},
  {n:"Exercice 5", t:"Estimer la mesure d'un angle", w:"Sur ta feuille", h:`<p>Sans rapporteur, estime la mesure de chaque angle. Tu as droit à une erreur de 10°. Vérifie ensuite au rapporteur.</p>${ex("e5","Quatre angles numérotés de 1 à 4",490)}`,
   c:`<p>Mesures au rapporteur (sur la fiche) : 1) <b>25°</b> · 2) <b>65°</b> · 3) <b>120°</b> · 4) <b>160°</b></p><p>Ton estimation est réussie si elle est à 10° près : par exemple, pour l'angle 2, une estimation entre 55° et 75°.</p>`}
 ]},
{t:"Mesurer un angle avec un rapporteur", e:[
  {n:"Activité 1", t:"Qui a raison ?", w:"Sur ta feuille", h:`${ex("act1","Le rapporteur posé sur l'angle ABC",260)}<p>Arthur dit que l'angle ${A("ABC")} mesure 28°. Clara dit qu'il mesure 152°.</p><p>1) Qui a raison ? Justifie sans mesurer.</p><p>2) Quelle erreur a faite l'autre ?</p>`,
   c:`<p>1) <b>Arthur a raison.</b> L'angle ${A("ABC")} est aigu (il est plus petit qu'un angle droit) : sa mesure est entre 0° et 90°. 152° est la mesure d'un angle obtus : c'est impossible.</p><p>2) Clara a lu la <b>mauvaise graduation</b> : celle dont le 0 n'est pas sur le côté [BA). On remarque que 28 + 152 = 180.</p>`},
  {n:"Exercice 6", t:"Mesurer des angles", w:"Sur ta feuille", h:`<p>Mesure chaque angle avec ton rapporteur et complète. Pense à estimer d'abord !</p>${ex("e6","Six angles : xOy, ABC, FED, GHI, KLM, RST",490)}`,
   c:`<div class="scroll"><table class="std"><tbody><tr><td>${A("xOy")} = <b>50°</b> (aigu)</td><td>${A("ABC")} = <b>125°</b> (obtus)</td><td>${A("FED")} = <b>38°</b> (aigu)</td></tr><tr><td>${A("GHI")} = <b>15°</b> (aigu)</td><td>${A("KLM")} = <b>160°</b> (obtus)</td><td>${A("RST")} = <b>95°</b> (obtus)</td></tr></tbody></table></div><p><i>Mesures faites sur la fiche imprimée. Une différence de 1° est acceptée.</i></p>`},
  {n:"Exercice 7", t:"Les angles d'une pendule", w:"Sur ta feuille", h:`<p>La première pendule indique 1 h 30, la seconde indique 2 h. Mesure l'angle codé entre les deux aiguilles.</p>${ex("e7","Deux pendules : 1 h 30 et 2 h",300)}<p>À 1 h 30 : …… ° · À 2 h : …… °</p><p>Sans mesurer, quelle est la mesure de l'angle à 3 h ? Et à 6 h ?</p>`,
   c:`<p>Le cadran est partagé en 12 parts égales : entre deux nombres, il y a 360° ÷ 12 = 30°.</p><p>À 1 h 30 : la petite aiguille est au milieu entre 1 et 2, la grande sur 6 : 4,5 × 30 = <b>135°</b>.</p><p>À 2 h : 2 × 30 = <b>60°</b>.</p><p>À 3 h : 3 × 30 = <b>90°</b> (un angle droit). À 6 h : 6 × 30 = <b>180°</b> (un angle plat).</p>`}
 ]},
{t:"Construire un angle", e:[
  {n:"Activité 2", t:"Terminer une construction", w:"Sur ta feuille", h:`${ex("act2","Le rapporteur centré en C, avec des points numérotés",260)}<p>Mahé veut tracer l'angle ${A("BCF")}. Elle a tracé le côté [CB) et placé son rapporteur.</p><p>1) Pour que ${A("BCF")} = 40°, par quel point numéroté doit passer [CF) ?</p><p>2) Et pour que ${A("BCF")} = 130° ?</p><p>3) Le point 4 donne un angle de combien de degrés ?</p>`,
   c:`<p>Le côté [CB) part vers la droite, sur le 0 de la graduation <b>extérieure</b> (en bleu) : c'est elle qu'il faut lire.</p><p>1) 40° : le <b>point 2</b>.</p><p>2) 130° : le <b>point 3</b>.</p><p>3) Le point 4 donne <b>140°</b>.</p><p><i>Les autres points : le point 1 donne 30°, le point 5 donne 50°.</i></p>`},
  {n:"Exercice 8", t:"Construire des angles", w:"Sur la feuille de constructions", h:`<p>Les constructions se font sur la <b>feuille de constructions</b> du chapitre (dans la partie suivante).</p>`,
   c:`<p>Voir les corrections de la feuille de constructions ci-dessous.</p>`}
 ]},
{t:"Feuille de constructions", note:"<b>Matériel :</b> règle graduée, rapporteur, crayon bien taillé, gomme. Les figures sont en vraie grandeur sur la feuille imprimée : construis directement dessus, sans effacer tes traits de construction.", e:[
  {n:"Exercice 1", t:"Construire des angles", w:"Sur la feuille de constructions", h:`<p>Pour chaque angle, un côté est déjà tracé. Construis le second côté, puis code l'angle.</p><p>a) [Oy) tel que ${A("xOy")} = 35° · b) [BC) tel que ${A("ABC")} = 110° · c) [EF) tel que ${A("FED")} = 90° · d) [ST) tel que ${A("RST")} = 72° · e) [NP) tel que ${A("MNP")} = 145° · f) [VW) tel que ${A("UVW")} = 18°</p>${kk("k1","Les six côtés déjà tracés",470)}`,
   c:`<p>Pour chaque angle : centre du rapporteur sur le sommet, 0 sur le côté déjà tracé, petit point en face de la mesure (sur la graduation qui part de ce 0), puis on trace le second côté et on code l'angle.</p>${kk("k1c","Les six angles construits et codés",470)}<p><i>Ici, le second côté est tracé au-dessus du côté donné ; il pourrait aussi être tracé en dessous.</i></p>`},
  {n:"Exercice 2", t:"Une ligne brisée", w:"Sur la feuille de constructions", h:`<p>Le segment [AB] de 5 cm est déjà tracé. Construis :</p><p>1) le point C tel que ${A("ABC")} = 120° et BC = 4 cm, au-dessus de la droite (AB) ;</p><p>2) le point D tel que ${A("BCD")} = 75° et CD = 3 cm, comme sur le schéma ;</p><p>3) trace la ligne brisée ABCD.</p>${kk("k2s","Schéma à main levée de la ligne brisée",200)}${kk("k2","Le segment [AB]",440)}`,
   c:`<p>1) Rapporteur centré en B, 0 sur [BA) : je marque 120°, je trace la demi-droite et je place C à 4 cm de B.</p><p>2) Rapporteur centré en C, 0 sur [CB) : je marque 75° du côté du schéma, puis je place D à 3 cm de C.</p>${kk("k2c","La ligne brisée ABCD construite",440)}`},
  {n:"Exercice 3", t:"Un éventail", w:"Sur la feuille de constructions", h:`<p>1) Construis la demi-droite [Oy) telle que ${A("xOy")} = 50°.</p><p>2) Construis la demi-droite [Oz) telle que ${A("yOz")} = 70°. La demi-droite [Oz) ne doit pas être à l'intérieur de l'angle ${A("xOy")}.</p><p>3) Sans mesurer, quelle doit être la mesure de l'angle ${A("xOz")} ? Vérifie avec ton rapporteur.</p>${kk("k3","La demi-droite [Ox)",440)}`,
   c:`${kk("k3c","Les demi-droites [Oy) et [Oz)",440)}<p>3) [Oz) est à l'extérieur de l'angle ${A("xOy")} : les deux angles s'ajoutent. ${A("xOz")} = 50° + 70° = <b>120°</b>.</p>`},
  {n:"Exercice 4", t:"L'étoile à cinq branches", w:"Sur la feuille de constructions", h:`${kk("k4s","L'étoile ABCDE : pointes de 36°",160)}<p>On veut construire l'étoile ABCDE : ses cinq segments mesurent <b>8 cm</b> et chacune de ses cinq pointes forme un angle de <b>36°</b>. Le segment [AB] est déjà tracé.</p><p>1) Construis le point C tel que ${A("ABC")} = 36° et BC = 8 cm.</p><p>2) Continue de la même façon : ${A("BCD")} = 36° et CD = 8 cm, puis ${A("CDE")} = 36° et DE = 8 cm. Tourne toujours du même côté.</p><p>3) Trace le segment [EA]. Vérifie : si ta construction est précise, EA = 8 cm et ${A("DEA")} = 36°.</p><p>4) Colorie ton étoile.</p>${kk("k4","Le segment [AB]",400)}`,
   c:`<p>On répète quatre fois la même construction : rapporteur centré sur le dernier point, 0 sur le segment précédent, petit point en face de 36°, puis on reporte 8 cm.</p>${kk("k4c","L'étoile ABCDE construite : ses cinq angles de 36° sont codés",340)}<p>3) Le segment [EA] (en bleu) mesure bien 8 cm, et ${A("DEA")} = 36° : l'étoile se referme.</p>`}
 ]},
{t:"Programmer un déplacement", e:[
  {n:"Exercice 9", t:"Quel tracé ?", w:"Sur ta feuille", h:`<p>Voici deux programmes Scratch.</p>${ex("e9","Programme A : répéter 3 fois avancer de 80 pas, tourner de 120 degrés. Programme B : répéter 6 fois avancer de 80 pas, tourner de 60 degrés.",490)}<p>1) Dessine, à main levée, la figure tracée par chaque programme.</p><p>2) Le programme A trace un triangle dont les trois angles mesurent 60°. Pourtant, le lutin tourne de 120°. Explique pourquoi à l'aide d'un schéma.</p>`,
   c:`<div class="cgrid"><figure><figcaption>Programme A : un <b>triangle équilatéral</b> de côté 80 pas.</figcaption><svg class="fig" viewBox="0 0 170 150" width="170" role="img" aria-label="Triangle équilatéral"><polygon points="20,130 150,130 85,17.4" style="fill:none;stroke:${BLUE};stroke-width:2.5"/></svg></figure><figure><figcaption>Programme B : un <b>hexagone régulier</b> (6 côtés de 80 pas).</figcaption><svg class="fig" viewBox="0 0 170 150" width="170" role="img" aria-label="Hexagone régulier"><polygon points="50,135 120,135 155,74.4 120,13.8 50,13.8 15,74.4" style="fill:none;stroke:${BLUE};stroke-width:2.5"/></svg></figure></div>
   <p>2) Le lutin tourne par rapport à la direction dans laquelle il avançait (le prolongement du côté). L'angle du triangle est entre les deux côtés : 180° − 120° = <b>60°</b>.</p>
   <svg class="fig" viewBox="0 0 300 150" width="300" role="img" aria-label="Le lutin tourne de 120 degrés, l'angle du triangle mesure 60 degrés"><line x1="20" y1="120" x2="160" y2="120" class="ln"/><line x1="160" y1="120" x2="270" y2="120" style="stroke:#888;stroke-width:2;stroke-dasharray:6 5"/><line x1="160" y1="120" x2="100" y2="16" style="stroke:${BLUE};stroke-width:2.5"/><path d="M190 120 A30 30 0 0 0 145 94" style="fill:none;stroke:${RED};stroke-width:2"/><text x="196" y="96" style="font-size:14px;font-weight:700;fill:${RED}">120°</text><path d="M135 120 A25 25 0 0 1 147.5 98.4" style="fill:${ORANGE};fill-opacity:.25;stroke:${ORANGE};stroke-width:2"/><text x="104" y="112" style="font-size:14px;font-weight:700;fill:${ORANGE}">60°</text></svg>`},
  {n:"Exercice 10", t:"Écrire un programme", w:"Sur ta feuille", h:`<p>Complète ce programme pour que le lutin trace un rectangle de 120 pas sur 60 pas.</p><p class="calc">quand le drapeau est cliqué<br>stylo en position d'écriture<br>répéter …… fois<br>&nbsp;&nbsp;&nbsp;avancer de …… pas<br>&nbsp;&nbsp;&nbsp;tourner ↻ de …… degrés<br>&nbsp;&nbsp;&nbsp;avancer de …… pas<br>&nbsp;&nbsp;&nbsp;tourner ↻ de …… degrés</p>`,
   c:`<p class="calc">quand le drapeau est cliqué<br>stylo en position d'écriture<br>répéter <b>2</b> fois<br>&nbsp;&nbsp;&nbsp;avancer de <b>120</b> pas<br>&nbsp;&nbsp;&nbsp;tourner ↻ de <b>90</b> degrés<br>&nbsp;&nbsp;&nbsp;avancer de <b>60</b> pas<br>&nbsp;&nbsp;&nbsp;tourner ↻ de <b>90</b> degrés</p><p>Le motif « une longueur, un angle droit, une largeur, un angle droit » trace la moitié du rectangle : on le répète 2 fois.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Nommer un angle", schema:S_NOM, q:{
 1:[ {q:`Dans l'angle ${A("AOB")}, quel est le sommet ?`, c:["O","A","B"], rep:"O", ex:"La lettre du milieu est le sommet.", sx:S_NOM},
     {q:"Quel est le nom de cet angle ?", fig:angSVG(15,75,{names:["A","O","B"]}), c:[A("AOB"),A("OAB"),A("ABO")], rep:A("AOB"), sx:S_NOM} ],
 2:[ {q:`Quels sont les côtés de l'angle ${A("RST")} ?`, c:["[SR) et [ST)","[RS) et [RT)","[SR] et [ST]"], rep:"[SR) et [ST)", ex:"Les côtés sont des demi-droites qui partent du sommet S.", sx:S_NOM},
     {q:`Quel autre nom possède l'angle ${A("FED")} ?`, c:[A("DEF"),A("EFD"),A("FDE")], rep:A("DEF"), ex:"On peut lire dans l'autre sens, mais E reste au milieu.", sx:S_NOM} ],
 3:[ {q:"Vrai ou faux : si on allonge les côtés d'un angle, l'angle devient plus grand.", c:VF, rep:"Faux", ex:"La taille d'un angle dépend seulement de son ouverture.", sx:S_TAILLE},
     {q:"Comment code-t-on un angle sur une figure ?", c:["avec un petit arc de cercle près du sommet","avec un petit trait sur un côté","avec une croix"], rep:"avec un petit arc de cercle près du sommet", sx:S_NOM} ]
}},
{nom:"Nature d'un angle", schema:S_NAT, q:{
 1:[ {g:()=>{ const m=ri(5,85); return {q:`Un angle mesure ${m}°. Quelle est sa nature ?`, c:["aigu","obtus","droit"], rep:"aigu", sx:S_NAT}; }},
     {g:()=>{ const m=ri(95,175); return {q:`Un angle mesure ${m}°. Quelle est sa nature ?`, c:["obtus","aigu","plat"], rep:"obtus", sx:S_NAT}; }} ],
 2:[ {q:"Un angle de 180° est…", c:["plat","droit","obtus"], rep:"plat", ex:"Ses deux côtés forment une droite.", sx:S_NAT},
     {g:()=>{ const a=ri(10,80), b=pick([90,ri(100,170)]); const m=b; return {q:"Quelle est la nature de cet angle ?", fig:angSVG(a,a+m,{w:240,h:160,alt:"Un angle"}), c:["aigu","droit","obtus"], rep:m===90?"droit":"obtus", sx:S_NAT}; }} ],
 3:[ {q:"Un angle plat vaut…", c:["deux angles droits","un angle droit","trois angles droits"], rep:"deux angles droits", sx:S_NAT},
     {g:()=>{ const a=ri(0,40), m=ri(20,80); return {q:"Quelle est la nature de cet angle ?", fig:angSVG(a,a+m,{w:240,h:160}), c:["aigu","droit","obtus"], rep:"aigu", sx:S_NAT}; }} ]
}},
{nom:"Estimer un angle", schema:S_NAT, q:{
 1:[ {g:()=>{ const m=pick([30,45,60]), a=ri(0,20); const c=shuf(uniq(`${m}°`,[`${m+60}°`,`${m+100}°`])); return {q:"Sans rapporteur, quelle est la bonne mesure ?", fig:angSVG(a,a+m,{w:240,h:160}), c, rep:`${m}°`, sx:S_NAT}; }} ],
 2:[ {g:()=>{ const m=pick([100,120,135,150]), a=ri(0,20); return {q:"Sans rapporteur, quelle est la bonne mesure ?", fig:angSVG(a,a+m,{w:260,h:170,cx:150}), c:shuf(uniq(`${m}°`,[`${m-60}°`,`${180-m}°`,`${m-40}°`])), rep:`${m}°`, ex:"L'angle est obtus : sa mesure est entre 90° et 180°.", sx:S_NAT}; }} ],
 3:[ {g:()=>{ const m=pick([80,85,95,100]), a=ri(0,30); return {q:"Sans rapporteur, quelle est la bonne mesure ?", fig:angSVG(a,a+m,{w:240,h:170}), c:shuf(uniq(`${m}°`,[`${m<90?m+20:m-20}°`,`${180-m+40}°`])), rep:`${m}°`, ex:`Compare avec un angle droit : il est ${m<90?"un peu plus petit":"un peu plus grand"}.`, sx:S_NAT}; }} ]
}},
{nom:"Lire le rapporteur", schema:S_RAPP, q:{
 1:[ {q:"Où place-t-on le centre du rapporteur pour mesurer un angle ?", c:["sur le sommet","sur un côté","n'importe où"], rep:"sur le sommet", sx:S_RAPP},
     {q:"Que faut-il faire avant de mesurer ?", c:["estimer la nature de l'angle","tracer un cercle","mesurer les côtés"], rep:"estimer la nature de l'angle", sx:S_RAPP} ],
 2:[ {g:()=>{ const m=ri(15,75); return {q:`Un angle aigu a été mesuré, et on hésite entre ${m}° et ${180-m}°. Quelle est la bonne mesure ?`, c:[`${m}°`,`${180-m}°`], rep:`${m}°`, ex:"Un angle aigu mesure moins de 90°.", sx:S_RAPP}; }},
     {g:()=>{ const m=ri(100,165); return {q:`Un angle obtus a été mesuré, et on hésite entre ${180-m}° et ${m}°. Quelle est la bonne mesure ?`, c:[`${m}°`,`${180-m}°`], rep:`${m}°`, ex:"Un angle obtus mesure plus de 90°.", sx:S_RAPP}; }} ],
 3:[ {g:()=>{ const m=ri(15,75); return {q:`Clara lit ${180-m}° pour un angle aigu. Quelle est la vraie mesure ?`, rep:String(m), ex:`Elle a lu la mauvaise graduation : 180 − ${180-m} = ${m}°.`, sx:S_RAPP}; }},
     {q:"Un rapporteur a combien de graduations ?", c:["deux","une","quatre"], rep:"deux", ex:"Une qui part du 0 de droite, une qui part du 0 de gauche.", sx:S_RAPP} ]
}},
{nom:"Construire et calculer", schema:S_NAT, q:{
 1:[ {q:"Pour construire un angle, quel côté trace-t-on en premier ?", c:["un des deux côtés","l'arc de cercle","le sommet seulement"], rep:"un des deux côtés"} ],
 2:[ {g:()=>{ const a=ri(20,70), b=ri(20,70); return {q:`[Oy) est entre [Ox) et [Oz). ${A("xOy")} = ${a}° et ${A("yOz")} = ${b}°. Combien mesure ${A("xOz")} (en °) ?`, rep:String(a+b), ex:`Les angles s'ajoutent : ${a} + ${b} = ${a+b}°.`}; }} ],
 3:[ {g:()=>{ const t=ri(100,150), a=ri(20,t-30); return {q:`[Oy) est entre [Ox) et [Oz). ${A("xOz")} = ${t}° et ${A("xOy")} = ${a}°. Combien mesure ${A("yOz")} (en °) ?`, rep:String(t-a), ex:`${t} − ${a} = ${t-a}°.`}; }},
     {g:()=>{ const h=pick([1,2,3,4,5,6]); return {q:`Quel angle forment les aiguilles d'une pendule à ${h} h (en °) ?`, rep:String(30*h), ex:`Entre deux nombres du cadran : 360 ÷ 12 = 30°. ${h} × 30 = ${30*h}°.`}; }} ]
}},
{nom:"Programmer un déplacement", schema:S_LUTIN, q:{
 1:[ {q:"Pour tracer un carré, de combien de degrés le lutin tourne-t-il à chaque coin ?", c:["90","60","120"], rep:"90", sx:S_LUTIN},
     {q:"Dans Scratch, « s'orienter à 90 » fait regarder le lutin…", c:["vers la droite","vers le haut","vers la gauche"], rep:"vers la droite"} ],
 2:[ {q:"Le lutin tourne de 60° entre deux segments. Quel angle forment les deux segments ?", c:["120°","60°","90°"], rep:"120°", ex:"180° − 60° = 120°.", sx:S_LUTIN},
     {q:"Répéter 3 fois : avancer de 80 pas, tourner de 120 degrés. Quelle figure obtient-on ?", c:["un triangle équilatéral","un carré","un hexagone"], rep:"un triangle équilatéral", sx:S_LUTIN} ],
 3:[ {q:"Répéter 6 fois : avancer de 80 pas, tourner de 60 degrés. Quelle figure obtient-on ?", c:["un hexagone régulier","un triangle","un carré"], rep:"un hexagone régulier", sx:S_LUTIN},
     {q:"Pour tracer un rectangle avec un motif « avancer, tourner, avancer, tourner », combien de fois faut-il le répéter ?", c:["2","4","1"], rep:"2", sx:S_LUTIN} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:(()=>{
const MEM = t => `<div class="retenir" data-l="Je me souviens">${t}</div>`;
const AIDE = t => `<p><i><b>Aide :</b> ${t}</i></p>`;
const T = (x,y,t,st="") => `<text x="${x}" y="${y}" text-anchor="middle" style="font-size:15px;font-weight:600;fill:var(--ink)${st}">${t}</text>`;
const X = (x,y) => `<path d="M${x-4} ${y-4} L${x+4} ${y+4} M${x-4} ${y+4} L${x+4} ${y-4}" style="stroke:var(--ink);stroke-width:1.8"/>`;
/* angle codé de sommet S (55°) : P sur un côté, K et R sur l'autre */
const FIG1 = `<svg class="fig" viewBox="0 0 290 170" width="290" role="img" aria-label="Un angle codé de sommet S ; le point P est sur un côté ; les points K et R sont sur l'autre côté">
  <path d="M60 140 L87.7 136.1 A28 28 0 0 0 72.7 115.1 Z" style="fill:${ORANGE};fill-opacity:.22;stroke:${ORANGE};stroke-width:2"/>
  <line x1="60" y1="140" x2="273" y2="110.1" class="ln"/><line x1="60" y1="140" x2="125.8" y2="10.8" class="ln"/>
  ${X(149.1,127.5)}${X(248.1,113.6)}${X(116.8,28.6)}${T(48,158,"S")}${T(152,149,"K")}${T(250,135,"R")}${T(101,28,"P")}</svg>`;
/* demi-droites déjà tracées pour l'exercice 3 */
const HL = (cx, dir, nV, nS, w) => { const x2 = dir>0 ? w-12 : 12; return `<svg class="fig" viewBox="0 0 ${w} 150" width="${w}" role="img" aria-label="La demi-droite [${nV}${nS}) déjà tracée">
  <line x1="${cx}" y1="125" x2="${x2}" y2="125" class="ln"/>${X(cx,125)}${T(cx,146,nV)}${T(x2-dir*8,116,nS)}</svg>`; };
/* angles agrandis pour pouvoir poser le rapporteur sur la feuille imprimée */
const BIG = g => g.replace(/width="(\d+)"/, (m,w)=>`width="${Math.round(w*1.45)}"`);
const COMP = [
  ["COMMUNIQUER","Je reconnais le sommet et les côtés d'un angle, et j'écris correctement son nom.","Ex. 1 (3 points)"],
  ["REPRÉSENTER","J'estime la nature d'un angle, puis je le mesure avec le rapporteur.","Ex. 2 (4 points)"],
  ["REPRÉSENTER","Je construis un angle de mesure donnée avec le rapporteur.","Ex. 3 (3 points)"]
];
return {
titre:"Évaluation d'entraînement — Chapitre 9", duree:30, info:"Durée : 30 min · Règle et rapporteur · Calculatrice non autorisée",
comp:COMP,
exos:[
{t:"Le bon vocabulaire", p:3, h:`${FIG1}<p>Sur la figure, les points K et R sont sur le même côté de l'angle codé.</p>
  <p>a) Quel est le sommet de l'angle codé ?</p><p>b) Quels sont ses deux côtés ?</p>
  <p>c) Recopie toutes les écritures qui désignent l'angle codé : ${A("PSR")} · ${A("SPR")} · ${A("KSP")} · ${A("PKS")} · ${A("RSP")}</p>
  <p>d) Sans le mesurer, dis si cet angle est aigu, droit ou obtus.</p>`,
 c:`<p>a) Le sommet est le point <b>S</b>. <i>(0,5 point)</i></p>
  <p>b) Ses côtés sont les demi-droites <b>[SP)</b> et <b>[SR)</b>. Comme K est sur [SR), on peut aussi écrire [SK). <i>(0,5 point)</i></p>
  <p>c) ${A("PSR")}, ${A("KSP")} et ${A("RSP")} : la lettre du milieu est bien le sommet S. <i>(0,5 point par bonne écriture)</i></p>
  <p>${A("SPR")} et ${A("PKS")} sont faux : leur lettre du milieu n'est pas S.</p>
  <p>d) L'angle est plus petit qu'un angle droit : il est <b>aigu</b>. <i>(0,5 point)</i></p>`},
{t:"Estimer puis mesurer", p:4, h:`<div class="figs">${BIG(angSVG(15,53,{names:["D","E","F"],w:200,h:150,cx:40,cy:120,L:115,alt:"L'angle DEF"}))}${BIG(angSVG(30,155,{names:["M","N","P"],w:230,h:130,cx:120,cy:100,L:95,alt:"L'angle MNP"}))}${BIG(angSVG(-20,51,{names:["X","Y","Z"],w:200,h:172,cx:45,cy:112,L:110,alt:"L'angle XYZ"}))}${BIG(angSVG(62,166,{names:["G","H","I"],w:230,h:150,cx:150,cy:115,L:105,alt:"L'angle GHI"}))}</div>
  <p>1) Sans rapporteur, indique si chaque angle est aigu ou obtus.</p><p>2) Mesure ensuite chaque angle avec ton rapporteur.</p>
  <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>${A("DEF")}</th><th>${A("MNP")}</th><th>${A("XYZ")}</th><th>${A("GHI")}</th></tr></thead><tbody><tr><th>Aigu ou obtus ?</th><td>……</td><td>……</td><td>……</td><td>……</td></tr><tr><th>Mesure</th><td>……</td><td>……</td><td>……</td><td>……</td></tr></tbody></table></div>`,
 c:`<div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>${A("DEF")}</th><th>${A("MNP")}</th><th>${A("XYZ")}</th><th>${A("GHI")}</th></tr></thead><tbody><tr><th>Aigu ou obtus ?</th><td><b>aigu</b></td><td><b>obtus</b></td><td><b>aigu</b></td><td><b>obtus</b></td></tr><tr><th>Mesure</th><td><b>38°</b></td><td><b>125°</b></td><td><b>71°</b></td><td><b>104°</b></td></tr></tbody></table></div>
  <p>Pour mesurer : le centre du rapporteur sur le sommet, le 0 sur un côté, puis je lis sur la graduation qui part de ce 0. La mesure doit être d'accord avec la nature : par exemple ${A("GHI")} est obtus, donc c'est 104° et non 76°.</p>
  <p><i>Par angle : 0,5 point pour la nature, 0,5 point pour la mesure (une erreur de 2° est acceptée).</i></p>`},
{t:"Construire des angles", p:3, h:`<p>Les demi-droites [Ax) et [Bu) sont déjà tracées. Sur ta feuille, reproduis-les, puis :</p>
  <div class="figs">${HL(130,1,"A","x",300)}${HL(220,-1,"B","u",260)}</div>
  <p>a) construis la demi-droite [Ay) telle que ${A("xAy")} = 140°, et code l'angle ;</p>
  <p>b) construis la demi-droite [Bv) telle que ${A("uBv")} = 35°, au-dessus de [Bu), et code l'angle ;</p>
  <p>c) donne la nature de chacun de ces deux angles.</p>`,
 c:`<p>a) Je place le centre du rapporteur en A et le 0 sur [Ax). Je suis la graduation qui part de ce 0 et je marque un point en face de 140. Je trace [Ay) et je code l'angle.</p>
  <div class="figs">${angSVG(0,140,{names:["x","A","y"],label:"140°",w:300,h:160,cx:150,cy:130,L:120,alt:"L'angle xAy de 140° construit"})}${angSVG(145,180,{names:["v","B","u"],label:"35°",w:280,h:130,cx:230,cy:110,L:170,alt:"L'angle uBv de 35° construit"})}</div>
  <p>b) Cette fois, [Bu) part vers la gauche : le 0 à utiliser est celui qui est sur [Bu). Je lis sur la graduation qui part de ce 0 et je marque 35.</p>
  <p><i>Figures réduites. 1,25 point par angle construit et codé (une erreur de 2° est acceptée).</i></p>
  <p>c) ${A("xAy")} = 140° : il est <b>obtus</b> (entre 90° et 180°). ${A("uBv")} = 35° : il est <b>aigu</b> (entre 0° et 90°). <i>(0,5 point)</i></p>`}
],
bep:{
titre:"Évaluation d'entraînement — Chapitre 9 · version aménagée", duree:30, info:"Version aménagée (tiers-temps) · Durée : 30 min · Règle et rapporteur · Calculatrice non autorisée",
note:"Le même sujet avec 3 questions en moins, à faire dans le même temps. Le total reste sur 10 points.",
comp:[
  ["COMMUNIQUER","Je reconnais le sommet et les côtés d'un angle, et j'écris correctement son nom.","Ex. 1 (2,5 points)"],
  ["REPRÉSENTER","J'estime la nature d'un angle, puis je le mesure avec le rapporteur.","Ex. 2 (4,5 points)"],
  ["REPRÉSENTER","Je construis un angle de mesure donnée avec le rapporteur.","Ex. 3 (3 points)"]
],
exos:[
{t:"Le bon vocabulaire", p:2.5, h:`${FIG1}<p>Sur la figure, les points K et R sont sur le même côté de l'angle codé.</p>
  <p>a) Quel est le sommet de l'angle codé ?</p><p>b) Quels sont ses deux côtés ?</p>
  <p>c) Recopie toutes les écritures qui désignent l'angle codé : ${A("PSR")} · ${A("SPR")} · ${A("KSP")} · ${A("PKS")} · ${A("RSP")}</p>`,
 c:`<p>a) Le sommet est le point <b>S</b>. <i>(0,5 point)</i></p>
  <p>b) Ses côtés sont les demi-droites <b>[SP)</b> et <b>[SR)</b>. Comme K est sur [SR), on peut aussi écrire [SK). <i>(0,5 point)</i></p>
  <p>c) ${A("PSR")}, ${A("KSP")} et ${A("RSP")} : la lettre du milieu est bien le sommet S. <i>(0,5 point par bonne écriture)</i></p>
  <p>${A("SPR")} et ${A("PKS")} sont faux : leur lettre du milieu n'est pas S.</p>`},
{t:"Estimer puis mesurer", p:4.5, h:`<div class="figs">${BIG(angSVG(15,53,{names:["D","E","F"],w:200,h:150,cx:40,cy:120,L:115,alt:"L'angle DEF"}))}${BIG(angSVG(30,155,{names:["M","N","P"],w:230,h:130,cx:120,cy:100,L:95,alt:"L'angle MNP"}))}${BIG(angSVG(62,166,{names:["G","H","I"],w:230,h:150,cx:150,cy:115,L:105,alt:"L'angle GHI"}))}</div>
  <p>1) Sans rapporteur, indique si chaque angle est aigu ou obtus.</p><p>2) Mesure ensuite chaque angle avec ton rapporteur.</p>
  <div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>${A("DEF")}</th><th>${A("MNP")}</th><th>${A("GHI")}</th></tr></thead><tbody><tr><th>Aigu ou obtus ?</th><td>……</td><td>……</td><td>……</td></tr><tr><th>Mesure</th><td>……</td><td>……</td><td>……</td></tr></tbody></table></div>`,
 c:`<div class="scroll"><table class="std"><thead><tr><th>Angle</th><th>${A("DEF")}</th><th>${A("MNP")}</th><th>${A("GHI")}</th></tr></thead><tbody><tr><th>Aigu ou obtus ?</th><td><b>aigu</b></td><td><b>obtus</b></td><td><b>obtus</b></td></tr><tr><th>Mesure</th><td><b>38°</b></td><td><b>125°</b></td><td><b>104°</b></td></tr></tbody></table></div>
  <p>Pour mesurer : le centre du rapporteur sur le sommet, le 0 sur un côté, puis je lis sur la graduation qui part de ce 0. La mesure doit être d'accord avec la nature : par exemple ${A("GHI")} est obtus, donc c'est 104° et non 76°.</p>
  <p><i>Par angle : 0,5 point pour la nature, 1 point pour la mesure (une erreur de 2° est acceptée).</i></p>`},
{t:"Construire des angles", p:3, h:`<p>Les demi-droites [Ax) et [Bu) sont déjà tracées. Sur ta feuille, reproduis-les, puis :</p>
  <div class="figs">${HL(130,1,"A","x",300)}${HL(220,-1,"B","u",260)}</div>
  <p>a) construis la demi-droite [Ay) telle que ${A("xAy")} = 140°, et code l'angle ;</p>
  <p>b) construis la demi-droite [Bv) telle que ${A("uBv")} = 35°, au-dessus de [Bu), et code l'angle.</p>`,
 c:`<p>a) Je place le centre du rapporteur en A et le 0 sur [Ax). Je suis la graduation qui part de ce 0 et je marque un point en face de 140. Je trace [Ay) et je code l'angle.</p>
  <div class="figs">${angSVG(0,140,{names:["x","A","y"],label:"140°",w:300,h:160,cx:150,cy:130,L:120,alt:"L'angle xAy de 140° construit"})}${angSVG(145,180,{names:["v","B","u"],label:"35°",w:280,h:130,cx:230,cy:110,L:170,alt:"L'angle uBv de 35° construit"})}</div>
  <p>b) Cette fois, [Bu) part vers la gauche : le 0 à utiliser est celui qui est sur [Bu). Je lis sur la graduation qui part de ce 0 et je marque 35.</p>
  <p><i>Figures réduites. 1,5 point par angle construit et codé (une erreur de 2° est acceptée).</i></p>`}
]}
};
})()
};
})();
