/* Séances de programmation façon Scratch (blocs Blockly, rendu « zelos », couleurs et noms de Scratch) :
   - 4e : « Le lutin dessinateur » (stylo, boucles, angles des polygones, motif et frise par translation, variables, conditions) ;
   - 3e : « Programmer avec Scratch » (attendus de fin de 3e : constructions, variables, demander, conditions, événements et scripts en parallèle, blocs personnalisés, hasard).
   Le programme est interprété pas à pas (générateur) : les dessins et les réponses attendues sont calculés par le code. */
window.SCRATCH = (function(){
const COL = {move:"#4C97FF", look:"#9966FF", pen:"#0FBD8C", event:"#FFBF00", ctrl:"#FFAB19", sens:"#5CB1D6", op:"#59C059", vars:"#FF8C1A", my:"#FF6680"};
const r9 = x => Math.round(x*1e9)/1e9;
const fmtV = v => typeof v==="number" ? String(r9(v)).replace(".",",").replace("-","−") : String(v);

/* ================= petit langage pour écrire les programmes des niveaux ================= */
const S = {
  av:n=>({k:"avancer",a:[n]}), dr:n=>({k:"droite",a:[n]}), ga:n=>({k:"gauche",a:[n]}), or:n=>({k:"orienter",a:[n]}),
  aller:(x,y)=>({k:"aller",a:[x,y]}), poser:()=>({k:"poser",a:[]}), lever:()=>({k:"lever",a:[]}),
  rep:(n,b)=>({k:"repeter",a:[n],b}), jusq:(c,b)=>({k:"jusqua",a:[c],b}), si:(c,b)=>({k:"si",a:[c],b}), sisinon:(c,b,b2)=>({k:"sisinon",a:[c],b,b2}),
  dem:t=>({k:"demander",a:[t]}), dire:e=>({k:"dire",a:[e]}), set:(v,e)=>({k:"set",v,a:[e]}), chg:(v,e)=>({k:"change",v,a:[e]}), call:()=>({k:"call",a:[]}), call2:e=>({k:"call2",a:[e]})
};
const V = n => ({var:n}), REP = {rep:1}, O = (o,a,b) => ({o,a,b}), PAR = {param:1}, RAND = (a,b) => ({o:"rand",a,b});
const OPS = {"+":"s_add","-":"s_sub","*":"s_mul","/":"s_div","mod":"s_mod","=":"s_eq","<":"s_lt",">":"s_gt","rand":"s_rand"};
const OPSYM = {"+":"+","-":"−","*":"×","/":"÷","mod":"modulo","=":"=","<":"<",">":">"};
/* entrées de chaque bloc (dans l'ordre des arguments) */
const IN = {avancer:["N"], droite:["N"], gauche:["N"], orienter:["N"], aller:["X","Y"], repeter:["N"], jusqua:["C"], si:["C"], sisinon:["C"], demander:["T"], dire:["V"], set:["V"], change:["V"], call2:["N"]};

/* ================= les niveaux ================= */
const sq40=S.rep(4,[S.av(40),S.ga(90)]), tri40=S.rep(3,[S.av(40),S.ga(120)]);
const MOTIF=[S.or(0), S.rep(3,[S.av(60),S.dr(90)]), S.rep(4,[S.av(30),S.dr(90)]), S.or(90)];
const MV=["s_avancer","s_gauche","s_droite"];
const L4 = [
 {titre:"Le carré", debut:{x:-50,y:-50,dir:90}, blocs:MV, max:8,
  ref:[S.av(100),S.ga(90),S.av(100),S.ga(90),S.av(100),S.ga(90),S.av(100),S.ga(90)],
  consigne:"Programme le lutin pour qu'il trace le carré dessiné en pointillés gris : ses côtés mesurent 100 pas.",
  aide:"Le lutin regarde vers la droite. Avance de 100, puis tourne d'un quart de tour (90°) : vers la gauche ou vers la droite ? Regarde où est le carré.",
  sol:[S.av(100),S.ga(90),S.av(100),S.ga(90),S.av(100),S.ga(90),S.av(100),S.ga(90)]},
 {titre:"Avec une boucle", debut:{x:-50,y:-50,dir:90}, blocs:[...MV,"s_repeter"], max:3, strict:true, must:["repeter"],
  ref:[S.rep(4,[S.av(100),S.ga(90)])],
  consigne:"Le même carré, avec <b>3 blocs au maximum</b> (sans compter le drapeau vert).",
  aide:"Le motif « avancer de 100, tourner de 90° » se répète 4 fois : mets-le dans le bloc « répéter ».",
  sol:[S.rep(4,[S.av(100),S.ga(90)])]},
 {titre:"Le triangle équilatéral", debut:{x:-60,y:-52,dir:90}, blocs:[...MV,"s_repeter"], max:3, strict:true, must:["repeter"],
  ref:[S.rep(3,[S.av(120),S.ga(120)])],
  consigne:"Dessine le triangle équilatéral de côté 120, avec 3 blocs au maximum.",
  aide:"Les angles d'un triangle équilatéral mesurent 60°. Mais le lutin ne tourne pas de l'angle du triangle : il tourne de ce qui manque pour faire demi-tour, 180° − 60° = …",
  sol:[S.rep(3,[S.av(120),S.ga(120)])]},
 {titre:"L'hexagone régulier", debut:{x:-40,y:-70,dir:90}, blocs:[...MV,"s_repeter"], max:3, strict:true, must:["repeter"],
  ref:[S.rep(6,[S.av(80),S.ga(60)])],
  consigne:"Dessine l'hexagone régulier (6 côtés de 80 pas), avec 3 blocs au maximum.",
  aide:"Quand le lutin a fait le tour complet de la figure, il a tourné de 360° en tout. Il tourne 6 fois de la même façon : 360° ÷ 6 = …",
  sol:[S.rep(6,[S.av(80),S.ga(60)])]},
 {titre:"Prévois le dessin", type:"prevois", debut:{x:-50,y:60,dir:90},
  prog:[S.rep(5,[S.av(100),S.dr(72)])],
  choix:[[S.rep(5,[S.av(100),S.dr(144)])],[S.rep(5,[S.av(100),S.dr(72)])],[S.rep(6,[S.av(100),S.dr(60)])]],
  consigne:"Sans lancer le programme, prévois le dessin que le lutin va faire.",
  aide:"Combien de fois le lutin avance-t-il ? Cela donne le nombre de côtés. Il tourne de 72° à chaque fois : 5 × 72° = 360°, il fait donc exactement un tour."},
 {titre:"Le motif de la frise", debut:{x:-30,y:-30,dir:0}, blocs:[...MV,"s_repeter","s_orienter"], max:6,
  ref:[S.rep(3,[S.av(60),S.dr(90)]),S.rep(4,[S.av(30),S.dr(90)])],
  consigne:"Dessine le motif de la frise du TP. Le lutin regarde vers le haut. Grand carré : côtés de 60 pas ; petit carré : côtés de 30 pas.",
  aide:"Le lutin trace 3 côtés du grand carré (avancer de 60, tourner ↻ de 90°), puis tout le petit carré (avancer de 30, tourner ↻ de 90°, 4 fois).",
  sol:[S.rep(3,[S.av(60),S.dr(90)]),S.rep(4,[S.av(30),S.dr(90)])]},
 {titre:"La frise par translation", debut:{x:-220,y:0,dir:90}, blocs:["s_avancer","s_repeter","s_poser","s_lever","s_call"], def:MOTIF, max:5, strict:true, must:["repeter","call"],
  ref:[S.rep(5,[S.lever(),S.av(30),S.poser(),S.call()])],
  consigne:"Le bloc « motif » est déjà défini (en rose). Dessine la frise : 5 motifs, avec 30 pas d'écart entre deux motifs. 5 blocs au maximum.",
  aide:"Chaque motif est l'image du précédent par une translation. Avant chaque motif : relève le stylo, avance de 30, repose le stylo, puis utilise le bloc « motif ». Le tout, 5 fois.",
  sol:[S.rep(5,[S.lever(),S.av(30),S.poser(),S.call()])]},
 {titre:"Une variable : la spirale", debut:{x:0,y:0,dir:90}, blocs:["s_avancer","s_gauche","s_droite","s_repeter","s_set","s_change","s_var"], vars:["côté"], max:5, strict:true, must:["set","change"],
  ref:[S.set("côté",10),S.rep(12,[S.av(V("côté")),S.ga(90),S.chg("côté",10)])],
  consigne:"Dessine la spirale : le 1<sup>er</sup> trait mesure 10 pas, et chaque trait mesure 10 pas de plus que le précédent (12 traits). Utilise la variable <b>côté</b>, avec 5 blocs au maximum.",
  aide:"Mets côté à 10 au début. Dans la boucle : avance de « côté » (glisse le bloc orange « côté » dans le trou de « avancer »), tourne, puis ajoute 10 à côté.",
  sol:[S.set("côté",10),S.rep(12,[S.av(V("côté")),S.ga(90),S.chg("côté",10)])]},
 {titre:"Trouve l'erreur !", type:"bug", debut:{x:-40,y:-95,dir:90}, blocs:[...MV,"s_repeter"], max:3,
  ref:[S.rep(8,[S.av(80),S.ga(45)])], depart:[S.rep(8,[S.av(80),S.ga(40)])],
  consigne:"Ce programme devait dessiner l'octogone régulier (8 côtés), mais il y a une erreur. Corrige-la.",
  aide:"Lance le programme : la figure ne se referme pas. Le lutin doit tourner de 360° en tout, en 8 fois.",
  sol:[S.rep(8,[S.av(80),S.ga(45)])]},
 {titre:"Défi : carrés et triangles", defi:true, voir:true, debut:{x:-190,y:-20,dir:90}, blocs:["s_avancer","s_gauche","s_repeter","s_poser","s_lever","s_sisinon","s_eq","s_mod","s_set","s_change","s_var"], vars:["n"], must:["sisinon"],
  ref:[S.set("n",1),S.rep(6,[S.sisinon(O("=",O("mod",V("n"),2),1),[sq40],[tri40]),S.lever(),S.av(60),S.poser(),S.chg("n",1)])],
  consigne:"Dessine la frise : un carré, un triangle équilatéral, un carré… (côtés de 40 pas, 60 pas entre deux débuts de figure). Utilise la variable <b>n</b> (le numéro de la figure) et le bloc « si … alors … sinon ».",
  aide:"n vaut 1, puis 2, puis 3… Si n est impair (le reste de n ÷ 2 vaut 1), le lutin dessine un carré, sinon un triangle. Le bloc « modulo » donne le reste de la division.",
  sol:[S.set("n",1),S.rep(6,[S.sisinon(O("=",O("mod",V("n"),2),1),[sq40],[tri40]),S.lever(),S.av(60),S.poser(),S.chg("n",1)])]},
 {titre:"Défi : la rosace", defi:true, voir:true, debut:{x:0,y:0,dir:90}, blocs:[...MV,"s_repeter"], max:5, strict:true,
  ref:[S.rep(8,[S.rep(4,[S.av(70),S.ga(90)]),S.ga(45)])],
  consigne:"Dessine la rosace de 8 carrés (côtés de 70 pas), avec 5 blocs au maximum.",
  aide:"Un carré, c'est « répéter 4 fois : avancer, tourner de 90° ». Après chaque carré, le lutin tourne un peu : 8 carrés pour faire un tour complet, 360° ÷ 8 = …",
  sol:[S.rep(8,[S.rep(4,[S.av(70),S.ga(90)]),S.ga(45)])]},
 /* ---- niveaux ajoutés pour les séances (11, 12, 13 : séance 1 ; 14, 15 : séance 2) ---- */
 {titre:"Le rectangle", debut:{x:-75,y:-40,dir:90}, blocs:[...MV,"s_repeter"], max:5, strict:true, must:["repeter"],
  ref:[S.rep(2,[S.av(150),S.ga(90),S.av(80),S.ga(90)])],
  consigne:"Dessine le rectangle en pointillés gris : longueur 150 pas, largeur 80 pas. Utilise une boucle, avec <b>5 blocs au maximum</b>.",
  aide:"Ce qui se répète, ce n'est pas un seul côté : c'est « une longueur, un quart de tour, une largeur, un quart de tour ». Le lutin fait cela 2 fois.",
  sol:[S.rep(2,[S.av(150),S.ga(90),S.av(80),S.ga(90)])]},
 {titre:"Le polygone à 12 côtés", debut:{x:-20,y:-75,dir:90}, blocs:[...MV,"s_repeter"], max:3, strict:true, must:["repeter"],
  ref:[S.rep(12,[S.av(40),S.ga(30)])],
  consigne:"Dessine le dodécagone régulier : un polygone qui a 12 côtés de 40 pas. Utilise <b>3 blocs au maximum</b>.",
  aide:"Quand le lutin a fait le tour de la figure, il a tourné de 360° en tout. Il tourne 12 fois de la même façon : 360° ÷ 12 = …",
  sol:[S.rep(12,[S.av(40),S.ga(30)])]},
 {titre:"La maison", debut:{x:-50,y:-90,dir:90}, blocs:[...MV,"s_repeter"], max:9, must:["repeter"],
  ref:[S.rep(4,[S.av(100),S.ga(90)]),S.ga(90),S.av(100),S.dr(90),S.rep(3,[S.av(100),S.ga(120)])],
  consigne:"Dessine la maison : un carré de côté 100 pas, avec un toit en forme de triangle équilatéral de côté 100 pas. Le lutin part du coin en bas à gauche.",
  aide:"Trace d'abord le carré avec une boucle : le lutin revient à son point de départ. Fais-le ensuite monter jusqu'au coin en haut à gauche, tourné vers la droite (tourner, avancer de 100, tourner). Le toit est un triangle équilatéral : à chaque coin, le lutin tourne de 120°.",
  sol:[S.rep(4,[S.av(100),S.ga(90)]),S.ga(90),S.av(100),S.dr(90),S.rep(3,[S.av(100),S.ga(120)])]},
 {titre:"Une frise de triangles", debut:{x:-150,y:-20,dir:90}, blocs:["s_avancer","s_repeter","s_poser","s_lever","s_call"], def:[S.rep(3,[S.av(40),S.ga(120)])], max:5, strict:true, must:["repeter","call"],
  ref:[S.rep(5,[S.call(),S.lever(),S.av(60),S.poser()])],
  consigne:"Cette fois, le bloc « motif » trace un triangle équilatéral de côté 40 pas, puis ramène le lutin à son point de départ. Dessine la frise de 5 triangles : <b>60 pas</b> entre le début de deux triangles. 5 blocs au maximum.",
  aide:"Chaque triangle est l'image du précédent par une translation de 60 pas vers la droite. Dans la boucle : le motif, puis relever le stylo, avancer de 60, reposer le stylo. Le tout, 5 fois.",
  sol:[S.rep(5,[S.call(),S.lever(),S.av(60),S.poser()])]},
 {titre:"Des carrés emboîtés", debut:{x:-50,y:-50,dir:90}, blocs:[...MV,"s_repeter","s_set","s_change","s_var"], vars:["côté"], max:6, strict:true, must:["set","change"],
  ref:[S.set("côté",20),S.rep(5,[S.rep(4,[S.av(V("côté")),S.ga(90)]),S.chg("côté",20)])],
  consigne:"Dessine les 5 carrés en pointillés gris, qui partent du même coin : côtés de 20, 40, 60, 80 et 100 pas. Utilise la variable <b>côté</b>, avec 6 blocs au maximum.",
  aide:"Un carré, c'est « répéter 4 fois : avancer de côté, tourner de 90° ». Mets côté à 20 au début. Après chaque carré, ajoute 20 à côté. Le tout dans une boucle « répéter 5 fois » : une boucle dans une boucle !",
  sol:[S.set("côté",20),S.rep(5,[S.rep(4,[S.av(V("côté")),S.ga(90)]),S.chg("côté",20)])]},
 /* ---- niveaux bonus « En autonomie » (16 à 19) ---- */
 {titre:"L'étoile à cinq branches", debut:{x:-75,y:30,dir:90}, blocs:[...MV,"s_repeter"], max:3, strict:true, must:["repeter"],
  ref:[S.rep(5,[S.av(150),S.dr(144)])],
  consigne:"Dessine l'étoile à cinq branches : 5 traits de 150 pas. Utilise <b>3 blocs au maximum</b>.",
  aide:"Souviens-toi du niveau « Prévois le dessin » : l'étoile était l'un des dessins proposés ! Pour l'étoile, le lutin fait DEUX tours complets en 5 virages : 2 × 360° = 720°, et 720° ÷ 5 = …",
  sol:[S.rep(5,[S.av(150),S.dr(144)])]},
 {titre:"La rosace de triangles", debut:{x:0,y:0,dir:90}, blocs:[...MV,"s_repeter"], max:5, strict:true,
  ref:[S.rep(6,[S.rep(3,[S.av(80),S.ga(120)]),S.ga(60)])],
  consigne:"Dessine la rosace de 6 triangles équilatéraux (côtés de 80 pas), qui ont tous un sommet au centre. Utilise <b>5 blocs au maximum</b>.",
  aide:"Un triangle équilatéral : répéter 3 fois (avancer de 80, tourner de 120°). Après chaque triangle, le lutin tourne un peu : 6 triangles pour faire un tour complet, 360° ÷ 6 = …",
  sol:[S.rep(6,[S.rep(3,[S.av(80),S.ga(120)]),S.ga(60)])]},
 {titre:"La spirale triangulaire", debut:{x:-20,y:-40,dir:90}, blocs:["s_avancer","s_gauche","s_droite","s_repeter","s_set","s_change","s_var"], vars:["côté"], max:5, strict:true, must:["set","change"],
  ref:[S.set("côté",15),S.rep(15,[S.av(V("côté")),S.ga(120),S.chg("côté",15)])],
  consigne:"Dessine la spirale triangulaire : le 1<sup>er</sup> trait mesure 15 pas, et chaque trait mesure 15 pas de plus que le précédent (15 traits). Utilise la variable <b>côté</b>, avec 5 blocs au maximum.",
  aide:"C'est comme la spirale carrée, mais le lutin tourne comme pour un triangle équilatéral : de 120°. Mets côté à 15 ; puis répéter 15 fois : avancer de côté, tourner de 120°, ajouter 15 à côté.",
  sol:[S.set("côté",15),S.rep(15,[S.av(V("côté")),S.ga(120),S.chg("côté",15)])]},
 {titre:"Les créneaux du château", debut:{x:-160,y:-40,dir:90}, blocs:[...MV,"s_repeter"], max:9, strict:true, must:["repeter"],
  ref:[S.rep(4,[S.ga(90),S.av(40),S.dr(90),S.av(40),S.dr(90),S.av(40),S.ga(90),S.av(40)])],
  consigne:"Dessine le haut du mur du château : 4 créneaux de 40 pas de large et 40 pas de haut. Utilise <b>9 blocs au maximum</b>.",
  aide:"Un créneau : monter de 40, aller à droite de 40, descendre de 40, aller à droite de 40. Le lutin regarde vers la droite au départ : il tourne à gauche pour monter, à droite pour aller à droite… Écris un créneau, puis mets-le dans « répéter 4 fois ».",
  sol:[S.rep(4,[S.ga(90),S.av(40),S.dr(90),S.av(40),S.dr(90),S.av(40),S.ga(90),S.av(40)])]}
];
const B3 = ["s_demander","s_reponse","s_dire","s_add","s_sub","s_mul","s_div","s_set","s_var"];
const PROG_STAAL=[S.dem("Choisis un nombre"),S.set("a",O("-",REP,4)),S.set("b",O("*",V("a"),V("a"))),S.set("Résultat",O("-",V("b"),10)),S.dire(V("Résultat"))];
const premier = n => { if(n<2) return false; for(let d=2;d*d<=n;d++) if(n%d===0) return false; return true; };
const RECT=[S.rep(2,[S.av(140),S.ga(90),S.av(70),S.ga(90)])];
const CARRE_P=[S.rep(4,[S.av(PAR),S.ga(90)])];
const ARROW={droite:"→",gauche:"←",haut:"↑",bas:"↓"};
const MVD=["s_avancer","s_gauche","s_droite","s_repeter"];
const L3 = [
 /* ----- niveau 1 du programme : lire et écrire des scripts de construction géométrique ----- */
 {titre:"Prévois le dessin", type:"prevois", d:true, debut:{x:-70,y:-35,dir:90}, prog:RECT,
  choix:[[S.rep(4,[S.av(140),S.ga(90)])],RECT,[S.rep(2,[S.av(70),S.ga(90),S.av(140),S.ga(90)])]],
  bravo:"Le lutin avance de 140, tourne d'un quart de tour, avance de 70, tourne… deux fois : c'est un rectangle de longueur 140 et de largeur 70.",
  consigne:"Sans lancer le programme, prévois le dessin que le lutin va faire. Au départ, il regarde vers la droite.",
  aide:"Suis le lutin bloc par bloc : il avance de 140 (vers la droite), tourne de 90° vers la gauche (il regarde alors vers le haut), avance de 70… Et tout cela 2 fois."},
 {titre:"Le triangle équilatéral", d:true, debut:{x:-60,y:-52,dir:90}, blocs:MVD, max:3, strict:true, must:["repeter"],
  ref:[S.rep(3,[S.av(120),S.ga(120)])],
  consigne:"Programme le lutin pour qu'il trace le triangle équilatéral en pointillés gris (côtés de 120 pas), avec <b>3 blocs au maximum</b>.",
  aide:"Les angles d'un triangle équilatéral mesurent 60°. Mais le lutin ne tourne pas de l'angle du triangle : il tourne de ce qui manque pour faire demi-tour, 180° − 60° = …",
  sol:[S.rep(3,[S.av(120),S.ga(120)])]},
 {titre:"Le rectangle", d:true, debut:{x:-70,y:-35,dir:90}, blocs:MVD, max:5, strict:true, must:["repeter"],
  ref:RECT,
  consigne:"Trace le rectangle en pointillés gris : longueur 140 pas, largeur 70 pas. Utilise une boucle, avec <b>5 blocs au maximum</b>.",
  aide:"Ce qui se répète, ce n'est pas un seul côté : c'est « une longueur puis une largeur ». Le lutin fait cela 2 fois, en tournant de 90° après chaque côté.",
  sol:RECT},
 {titre:"Prévois le résultat", type:"prevois", entree:-2, vars:["a","b","Résultat"], prog:PROG_STAAL,
  consigne:"Voici le programme de M. Staal. On répond <b>−2</b> quand le lutin demande un nombre. Sans lancer le programme, prévois ce que le lutin va dire.",
  aide:"Fais le calcul bloc par bloc : a = −2 − 4 = … ; puis b = a × a (attention au signe !) ; puis Résultat = b − 10."},
 /* ----- niveau 2 : variables, saisie, conditions, événements ----- */
 {titre:"Écris le programme", blocs:B3, vars:["résultat"], tests:[2,-4,0.5,7], f:x=>[3*x+5],
  consigne:"Écris ce programme de calcul : « Choisis un nombre. Multiplie-le par 3. Ajoute 5. Dis le résultat. »",
  aide:"Commence par « demander … et attendre ». Le nombre choisi est dans le bloc bleu « réponse ». Ensuite : mettre résultat à (réponse × 3) + 5, puis dire résultat. On peut aussi tout mettre directement dans le bloc « dire ».",
  sol:[S.dem("Choisis un nombre"),S.set("résultat",O("+",O("*",REP,3),5)),S.dire(V("résultat"))]},
 {titre:"Garder le nombre de départ", blocs:B3, vars:["nombre","résultat"], tests:[3,-5,0.5,10], f:x=>[(x+2)*x],
  consigne:"« Choisis un nombre. Ajoute 2. Multiplie le résultat par le nombre de départ. Dis le résultat. »",
  aide:"Range le nombre choisi dans la variable « nombre » (mettre nombre à réponse). Puis : mettre résultat à (nombre + 2), mettre résultat à (résultat × nombre), dire résultat.",
  sol:[S.dem("Choisis un nombre"),S.set("nombre",REP),S.set("résultat",O("+",V("nombre"),2)),S.set("résultat",O("*",V("résultat"),V("nombre"))),S.dire(V("résultat"))]},
 {titre:"Le carré de côté choisi", d:true, debut:{x:-60,y:-60,dir:90}, blocs:["s_demander","s_reponse",...MVD], must:["repeter"], tests:[100,60,140],
  ref:[S.dem("Quelle longueur ?"),S.rep(4,[S.av(REP),S.ga(90)])],
  consigne:"Le lutin demande une longueur, puis trace un carré dont le côté mesure cette longueur. En pointillés gris : le carré pour la réponse <b>100</b>. Ton programme sera testé avec plusieurs longueurs.",
  aide:"Commence par « demander … et attendre ». La longueur choisie est dans le bloc bleu « réponse » : glisse-le dans le trou du bloc « avancer de ». Le reste, c'est le carré avec une boucle.",
  sol:[S.dem("Quelle longueur ?"),S.rep(4,[S.av(REP),S.ga(90)])]},
 {titre:"Pair ou impair ?", blocs:[...B3,"s_sisinon","s_eq","s_mod"], vars:["nombre"], tests:[14,7,0,31,-6], f:x=>[x%2===0?"pair":"impair"],
  consigne:"Le lutin demande un nombre entier, puis dit « pair » ou « impair ».",
  aide:"Un nombre est pair quand le reste de sa division par 2 vaut 0. Le bloc vert « modulo » donne ce reste : si (réponse modulo 2) = 0 alors dire pair, sinon dire impair.",
  sol:[S.dem("Choisis un nombre"),S.sisinon(O("=",O("mod",REP,2),0),[S.dire("pair")],[S.dire("impair")])]},
 {titre:"Plusieurs scripts : pilote le lutin", d:true, debut:{x:0,y:0,dir:90}, blocs:["s_key","s_aller","s_orienter","s_avancer","s_lever","s_poser"],
  keys:true, touches:["droite","haut"], seq:["droite","haut","droite","haut","droite","haut","droite","haut"],
  ref:[S.lever(),S.aller(-160,-100),S.or(90),S.poser()], refkeys:{droite:[[S.or(90),S.av(40)]], haut:[[S.or(0),S.av(40)]]},
  consigne:"Écris <b>trois scripts</b> :<br>① <b>drapeau vert</b> : relever le stylo, aller à x : −160 et y : −100, s'orienter à 90, poser le stylo ;<br>② <b>flèche droite →</b> : s'orienter à 90, avancer de 40 ;<br>③ <b>flèche haut ↑</b> : s'orienter à 0, avancer de 40.<br>En appuyant sur → ↑ → ↑ → ↑ → ↑, le lutin trace l'escalier gris.",
  aide:"Les blocs jaunes « quand la touche … est pressée » sont dans la catégorie Événements : chacun commence un nouveau script. Choisis la touche dans la petite liste. Utilise « s'orienter à » plutôt que « tourner » : ainsi le lutin part toujours dans la bonne direction.",
  sol:[S.lever(),S.aller(-160,-100),S.or(90),S.poser()], solkeys:{droite:[[S.or(90),S.av(40)]], haut:[[S.or(0),S.av(40)]]}},
 /* ----- niveau 3 : blocs personnalisés, hasard, problèmes plus longs ----- */
 {titre:"Crée ton bloc : la frise", d:true, debut:{x:-200,y:-20,dir:90}, bloc:{nom:"carré", param:"côté"}, blocs:["s_avancer","s_gauche","s_repeter","s_lever","s_poser","s_call2","s_param"], must:["call2","repeter"],
  ref:[S.rep(5,[S.call2(40),S.lever(),S.av(80),S.poser()])], refdef2:CARRE_P, def2pre:[],
  consigne:"Crée ton propre bloc. Sous le bloc rose « définir carré côté », écris les blocs qui tracent un carré dont le côté mesure <b>côté</b>. Ensuite, sous le drapeau vert, utilise ton bloc pour tracer la frise : 5 carrés de côté 40, avec 80 pas entre le début de deux carrés.",
  aide:"Dans « définir carré » : répéter 4 fois « avancer de côté » (glisse le petit bloc rose « côté » dans le trou) et « tourner de 90° ». Sous le drapeau : répéter 5 fois : carré 40, relever le stylo, avancer de 80, poser le stylo.",
  sol:[S.rep(5,[S.call2(40),S.lever(),S.av(80),S.poser()])], soldef2:CARRE_P},
 {titre:"Des carrés de plus en plus grands", d:true, debut:{x:-60,y:-60,dir:90}, bloc:{nom:"carré", param:"côté"}, vars:["taille"], blocs:["s_avancer","s_gauche","s_repeter","s_call2","s_param","s_set","s_change","s_var"], must:["call2","set","change"],
  ref:[S.set("taille",20),S.rep(5,[S.call2(V("taille")),S.chg("taille",20)])], refdef2:CARRE_P, def2pre:CARRE_P,
  consigne:"Ton bloc « carré » est déjà prêt. Trace les 5 carrés en pointillés gris, qui partent du même coin : côtés de 20, 40, 60, 80 et 100 pas. Utilise la variable <b>taille</b> et ton bloc « carré ».",
  aide:"Mettre taille à 20. Puis répéter 5 fois : carré (glisse la variable « taille » dans le trou du bloc rose), puis ajouter 20 à taille.",
  sol:[S.set("taille",20),S.rep(5,[S.call2(V("taille")),S.chg("taille",20)])], soldef2:CARRE_P},
 {titre:"Pile ou face, 100 fois", vars:["zéros","uns"], noask:true, blocs:["s_dire","s_repeter","s_si","s_sisinon","s_eq","s_rand","s_set","s_change","s_var"], must:["repeter"],
  check:X=>{ const z=X.draws.filter(v=>v===0).length, u=X.draws.filter(v=>v===1).length;
    if(X.asked) return "Dans ce niveau, le lutin ne demande rien : il fait les tirages tout seul.";
    if(X.draws.some(v=>v!==0&&v!==1)) return "Chaque tirage doit donner 0 ou 1 : utilise « nombre aléatoire entre 0 et 1 ».";
    if(X.draws.length!==100) return `Le programme doit faire exactement 100 tirages (ici, il en a fait ${X.draws.length}). Attention : chaque bloc « nombre aléatoire » utilisé fait un nouveau tirage.`;
    if(X.said.length!==2 || num(X.said[0])!==z || num(X.said[1])!==u) return `Lors de ce test, il y a eu ${z} fois 0 et ${u} fois 1 : le lutin devait dire ${z}, puis ${u}. Il a dit : ${X.said.length?X.said.map(fmtV).join(" ; "):"(rien)"}.`;
    return ""; },
  consigne:"On simule 100 lancers d'une pièce : 0 pour pile, 1 pour face. Le lutin tire 100 fois un nombre au hasard entre 0 et 1, compte les 0 dans la variable <b>zéros</b> et les 1 dans la variable <b>uns</b>, puis dit le nombre de 0, puis le nombre de 1.",
  aide:"Mettre zéros à 0 et uns à 0. Répéter 100 fois : si (nombre aléatoire entre 0 et 1) = 0 alors ajouter 1 à zéros, sinon ajouter 1 à uns. Enfin : dire zéros, puis dire uns. Lance plusieurs fois : les résultats changent, mais restent proches de 50.",
  sol:[S.set("zéros",0),S.set("uns",0),S.rep(100,[S.sisinon(O("=",RAND(0,1),0),[S.chg("zéros",1)],[S.chg("uns",1)])]),S.dire(V("zéros")),S.dire(V("uns"))]},
 {titre:"Défi : tous les diviseurs", defi:true, voir:true, blocs:[...B3,"s_si","s_jusqua","s_eq","s_mod","s_gt","s_change"], vars:["d"], must:["jusqua"], tests:[12,7,30,1], f:x=>{ const l=[]; for(let d=1;d<=x;d++) if(x%d===0) l.push(d); return l; },
  consigne:"Le lutin demande un nombre entier, puis dit, dans l'ordre, tous ses diviseurs. Utilise une variable <b>d</b> qui prend les valeurs 1, 2, 3… et le bloc « répéter jusqu'à ».",
  aide:"Mettre d à 1. Répéter jusqu'à ce que d > réponse : si (réponse modulo d) = 0 alors dire d ; puis ajouter 1 à d (en dehors du « si »).",
  sol:[S.dem("Choisis un nombre"),S.set("d",1),S.jusq(O(">",V("d"),REP),[S.si(O("=",O("mod",REP,V("d")),0),[S.dire(V("d"))]),S.chg("d",1)])]},
 {titre:"Défi : nombre premier ?", defi:true, voir:true, blocs:[...B3,"s_si","s_sisinon","s_jusqua","s_eq","s_mod","s_gt","s_change"], vars:["d","compteur"], tests:[7,12,1,29,2,15,49], f:x=>[premier(x)?"premier":"pas premier"],
  consigne:"Le lutin demande un nombre entier positif, puis dit « premier » ou « pas premier ». Un nombre premier a exactement deux diviseurs : 1 et lui-même.",
  aide:"Compte les diviseurs du nombre dans la variable « compteur » (comme au niveau précédent, mais au lieu de dire d, on ajoute 1 à compteur). À la fin : si compteur = 2, alors premier, sinon pas premier.",
  sol:[S.dem("Choisis un nombre"),S.set("compteur",0),S.set("d",1),S.jusq(O(">",V("d"),REP),[S.si(O("=",O("mod",REP,V("d")),0),[S.chg("compteur",1)]),S.chg("d",1)]),S.sisinon(O("=",V("compteur"),2),[S.dire("premier")],[S.dire("pas premier")])]},
 /* ---- niveaux bonus « En autonomie » (14 à 18) ---- */
 {titre:"Le polygone de ton choix", d:true, debut:{x:-40,y:-95,dir:90}, blocs:["s_demander","s_reponse","s_avancer","s_gauche","s_droite","s_repeter","s_div"], must:["repeter"], tests:[5,3,8],
  ref:[S.dem("Combien de côtés ?"),S.rep(REP,[S.av(80),S.ga(O("/",360,REP))])],
  consigne:"Le lutin demande un nombre de côtés, puis trace le polygone régulier qui a ce nombre de côtés (côtés de 80 pas). En pointillés gris : le polygone pour la réponse <b>5</b>. Ton programme sera testé avec plusieurs réponses.",
  aide:"Le nombre de côtés est dans le bloc bleu « réponse » : c'est le nombre de répétitions. À chaque sommet, le lutin tourne de 360 ÷ réponse : utilise le bloc vert de la division.",
  sol:[S.dem("Combien de côtés ?"),S.rep(REP,[S.av(80),S.ga(O("/",360,REP))])]},
 {titre:"Positif, négatif ou nul ?", blocs:[...B3,"s_sisinon","s_lt","s_gt","s_eq"], vars:["nombre"], tests:[7,-3,0,0.5,-12], f:x=>[x>0?"positif":x<0?"négatif":"nul"], must:["sisinon"],
  consigne:"Le lutin demande un nombre, puis dit <b>positif</b>, <b>négatif</b> ou <b>nul</b> (écris ces mots sans faute, avec l'accent).",
  aide:"Il y a trois cas, mais un « si … alors … sinon » n'en choisit que deux. Place un deuxième « si … alors … sinon » dans le « sinon » du premier : si réponse > 0, alors positif ; sinon, si réponse < 0, alors négatif, sinon nul.",
  sol:[S.dem("Choisis un nombre"),S.sisinon(O(">",REP,0),[S.dire("positif")],[S.sisinon(O("<",REP,0),[S.dire("négatif")],[S.dire("nul")])])]},
 {titre:"La somme des entiers", blocs:[...B3,"s_repeter","s_change"], vars:["somme","i"], tests:[4,10,1,100], f:x=>[x*(x+1)/2], must:["repeter","change"],
  consigne:"Le lutin demande un nombre entier n, puis dit la somme 1 + 2 + 3 + … + n. Par exemple, pour 4, il dit 10, car 1 + 2 + 3 + 4 = 10.",
  aide:"Deux variables : « somme » (au départ 0) et « i » (au départ 1). Répéter « réponse » fois : ajouter i à somme, puis ajouter 1 à i. À la fin, dire somme.",
  sol:[S.dem("Choisis un nombre"),S.set("somme",0),S.set("i",1),S.rep(REP,[S.chg("somme",V("i")),S.chg("i",1)]),S.dire(V("somme"))]},
 {titre:"La table de multiplication", blocs:[...B3,"s_repeter","s_change"], vars:["k"], tests:[7,3,12], f:x=>[1,2,3,4,5,6,7,8,9,10].map(k=>x*k), must:["repeter"],
  consigne:"Le lutin demande un nombre, puis dit sa table de multiplication, de × 1 jusqu'à × 10 : pour 7, il dit 7, puis 14, puis 21… jusqu'à 70.",
  aide:"Utilise une variable k qui vaut 1, puis 2, puis 3… jusqu'à 10. Mettre k à 1, puis répéter 10 fois : dire (réponse × k), puis ajouter 1 à k.",
  sol:[S.dem("Choisis un nombre"),S.set("k",1),S.rep(10,[S.dire(O("*",REP,V("k"))),S.chg("k",1)])]},
 {titre:"Le dé, 60 fois", vars:["six"], noask:true, blocs:["s_dire","s_repeter","s_si","s_eq","s_rand","s_set","s_change","s_var"], must:["repeter","si"],
  check:X=>{ const n6=X.draws.filter(v=>v===6).length;
    if(X.asked) return "Dans ce niveau, le lutin ne demande rien : il fait les tirages tout seul.";
    if(X.draws.some(v=>v<1||v>6)) return "Chaque tirage doit donner un nombre entier de 1 à 6 : utilise « nombre aléatoire entre 1 et 6 ».";
    if(X.draws.length!==60) return `Le programme doit faire exactement 60 tirages (ici, il en a fait ${X.draws.length}). Attention : chaque bloc « nombre aléatoire » utilisé fait un nouveau tirage.`;
    if(X.said.length!==1 || num(X.said[0])!==n6) return `Lors de ce test, le 6 est sorti ${n6} fois : le lutin devait dire seulement ${n6}. Il a dit : ${X.said.length?X.said.map(fmtV).join(" ; "):"(rien)"}.`;
    return ""; },
  okmsg:X=>`Ton programme a été testé avec 3 séries de 60 lancers : à chaque fois, le lutin a bien dit le nombre de 6 (par exemple ${X.said.map(fmtV).join(" et ")}). On s'attend à environ 10 fois le 6, car 60 ÷ 6 = 10.`,
  consigne:"On lance un dé 60 fois. Le lutin tire 60 fois un nombre au hasard entre 1 et 6, compte les 6 dans la variable <b>six</b>, puis dit le nombre de 6 obtenus.",
  aide:"Mettre six à 0. Répéter 60 fois : si (nombre aléatoire entre 1 et 6) = 6 alors ajouter 1 à six. Enfin : dire six. Lance plusieurs fois : le résultat change, mais reste proche de 10.",
  sol:[S.set("six",0),S.rep(60,[S.si(O("=",RAND(1,6),6),[S.chg("six",1)])]),S.dire(V("six"))]}
];
const PACKS = {
  "4e":{key:"staal-scratch4-", levels:L4, dessin:true},
  "3e":{key:"staal-scratch3b-", levels:L3, dessin:false}
};

/* ================= interpréteur ================= */
const LIMIT = 40000;
function num(v){ if(typeof v==="number") return v; const s=String(v==null?"":v).trim().replace(",",".").replace("−","-"); if(s==="") return 0; const n=Number(s); return isFinite(n)?n:0; }
const numeric = v => typeof v==="number" || (String(v).trim()!=="" && isFinite(Number(String(v).trim().replace(",",".").replace("−","-"))));
function val(e, X){
  if(e===undefined||e===null) return "";
  if(typeof e==="number"||typeof e==="string") return e;
  if(e.var!==undefined) return e.var in X.vars ? X.vars[e.var] : 0;
  if(e.rep) return X.answer;
  if(e.param) return X.params.length ? X.params[X.params.length-1] : 0;
  const a=val(e.a,X), b=val(e.b,X);
  switch(e.o){
    case "+": return r9(num(a)+num(b)); case "-": return r9(num(a)-num(b)); case "*": return r9(num(a)*num(b));
    case "/": if(num(b)===0) throw {err:"Division par zéro : on ne peut pas diviser par 0 !"}; return r9(num(a)/num(b));
    case "mod": { const B=num(b); if(B===0) throw {err:"Division par zéro dans « modulo » : on ne peut pas diviser par 0 !"}; const A=num(a); return r9(((A%B)+B)%B); }
    case "=": return numeric(a)&&numeric(b) ? Math.abs(num(a)-num(b))<1e-9 : String(a).trim().toLowerCase()===String(b).trim().toLowerCase();
    case "<": return numeric(a)&&numeric(b) ? num(a)<num(b)-1e-12 : String(a)<String(b);
    case ">": return numeric(a)&&numeric(b) ? num(a)>num(b)+1e-12 : String(a)>String(b);
    case "rand": { const lo=Math.ceil(Math.min(num(a),num(b))), hi=Math.floor(Math.max(num(a),num(b))); const v=lo+Math.floor(X.rng()*(hi-lo+1)); X.draws.push(v); return v; }
  }
  return 0;
}
const vrai = v => v===true || (typeof v!=="boolean" && String(v).toLowerCase()==="true");
function ctx0(L){ const d=L.debut||{x:0,y:0,dir:90}; return {x:d.x, y:d.y, dir:d.dir, pen:true, vars:{}, answer:"", said:[], lines:[], steps:0, def:null, def2:null, params:[], draws:[], rng:Math.random, asked:0}; }
/* hasard reproductible pour les vérifications */
const seeded = a => () => { a|=0; a=a+0x6D2B79F5|0; let t=Math.imul(a^a>>>15,1|a); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; };
function* exec(list, X){ for(const n of list) yield* stmt(n, X); }
function* go(X, nx, ny){ nx=r9(nx); ny=r9(ny); const l=[X.x,X.y,nx,ny]; if(X.pen && (nx!==X.x||ny!==X.y)) X.lines.push(l); X.x=nx; X.y=ny; yield {t:X.pen?"line":"move", l}; }
function* stmt(n, X){
  if(++X.steps>LIMIT) throw {err:"Le programme ne s'arrête pas (boucle infinie ?). Vérifie la condition de ta boucle."};
  yield {t:"hl", id:n.id};
  const A=i=>val(n.a[i],X);
  switch(n.k){
    case "avancer": { const d=num(A(0)), t=X.dir*Math.PI/180; yield* go(X, X.x+d*Math.sin(t), X.y+d*Math.cos(t)); break; }
    case "droite": X.dir=r9(X.dir+num(A(0))); yield {t:"turn"}; break;
    case "gauche": X.dir=r9(X.dir-num(A(0))); yield {t:"turn"}; break;
    case "orienter": X.dir=num(A(0)); yield {t:"turn"}; break;
    case "aller": yield* go(X, num(A(0)), num(A(1))); break;
    case "poser": X.pen=true; break;
    case "lever": X.pen=false; break;
    case "repeter": { const k=Math.round(num(A(0))); for(let i=0;i<k;i++){ yield {t:"hl", id:n.id}; yield* exec(n.b||[], X); } break; }
    case "jusqua": { let g=0; while(!vrai(val(n.a[0],X))){ if(++g>LIMIT || ++X.steps>LIMIT) throw {err:"Le programme ne s'arrête pas : la condition du « répéter jusqu'à » n'est jamais vraie."}; yield {t:"hl", id:n.id}; yield* exec(n.b||[], X); } break; }
    case "si": if(vrai(A(0))) yield* exec(n.b||[], X); break;
    case "sisinon": if(vrai(A(0))) yield* exec(n.b||[], X); else yield* exec(n.b2||[], X); break;
    case "demander": { X.asked++; const r=yield {t:"ask", q:String(A(0))}; X.answer = r===undefined?"":r; break; }
    case "dire": { const v=A(0); X.said.push(typeof v==="boolean"?(v?"vrai":"faux"):v); yield {t:"say", v}; break; }
    case "set": X.vars[n.v]=(v=>typeof v==="boolean"?(v?"vrai":"faux"):v)(A(0)); yield {t:"var"}; break;
    case "change": X.vars[n.v]=r9(num(X.vars[n.v]||0)+num(A(0))); yield {t:"var"}; break;
    case "call": if(X.def) yield* exec(X.def, X); break;
    case "call2": if(X.def2){ X.params.push(A(0)); try{ yield* exec(X.def2, X); } finally { X.params.pop(); } } break;
  }
}
/* exécution immédiate (vérifications) ; entree = réponse donnée à chaque « demander » */
/* o : {def2, seed, keys:{touche:[programmes]}, seq:[touches appuyées l'une après l'autre]} */
function runSync(L, prog, entree, def, o){
  o=o||{}; const X=ctx0(L); X.def=def||L.def||null; X.def2=o.def2||null; if(o.seed!==undefined) X.rng=seeded(o.seed);
  const progs=[prog]; (o.seq||[]).forEach(k=>((o.keys||{})[k]||[]).forEach(p=>progs.push(p)));
  try{ for(const pr of progs){ const g=exec(pr, X); let r, send; for(;;){ r=g.next(send); send=undefined; if(r.done) break; if(r.value.t==="ask") send = entree===null||entree===undefined ? "" : String(entree); } } }
  catch(e){ X.err = e && e.err ? e.err : "Erreur dans le programme."; }
  return X;
}
/* comparaison de deux dessins : on échantillonne les traits tous les 2 pas */
function pointsOf(lines){ const s=new Set(); lines.forEach(([x1,y1,x2,y2])=>{ const n=Math.max(1,Math.ceil(Math.hypot(x2-x1,y2-y1)/2)); for(let i=0;i<=n;i++) s.add(Math.round(x1+(x2-x1)*i/n)+","+Math.round(y1+(y2-y1)*i/n)); }); return s; }
const near = (set, k) => { const [x,y]=k.split(",").map(Number); for(let i=-1;i<=1;i++) for(let j=-1;j<=1;j++) if(set.has((x+i)+","+(y+j))) return true; return false; };
function compare(a, b){ const A=pointsOf(a), B=pointsOf(b); let trop=0, manque=0; A.forEach(k=>{ if(!near(B,k)) trop++; }); B.forEach(k=>{ if(!near(A,k)) manque++; }); return {ok:!trop&&!manque, trop, manque}; }
const kinds = (...progs) => { const s=new Set(); const w=l=>l.forEach(n=>{ s.add(n.k); w(n.b||[]); w(n.b2||[]); }); progs.forEach(p=>w(p||[])); return s; };
const count = prog => { let c=0; const w=l=>l.forEach(n=>{ c++; w(n.b||[]); w(n.b2||[]); }); w(prog||[]); return c; };

/* ================= blocs (Blockly) ================= */
let defined=false, VARS=["nombre"], BLOC={nom:"carré", param:"côté"};
const KEYS=[["flèche droite","droite"],["flèche gauche","gauche"],["flèche haut","haut"],["flèche bas","bas"]];
const varOpts = () => VARS.map(v=>[v,v]);
function defineBlocks(){
  if(defined) return; defined=true;
  const st = (type, msg, args, colour, extra) => Object.assign({type, message0:msg, args0:args||[], previousStatement:null, nextStatement:null, colour, inputsInline:true}, extra||{});
  const vin = n => ({type:"input_value", name:n});
  Blockly.defineBlocksWithJsonArray([
    {type:"s_key", message0:"quand la touche %1 est pressée", args0:[{type:"field_dropdown", name:"K", options:KEYS}], nextStatement:null, colour:COL.event, tooltip:"Ce script démarre quand on appuie sur cette touche."},
    {type:"s_rand", message0:"nombre aléatoire entre %1 et %2", args0:[vin("A"),vin("B")], output:null, inputsInline:true, colour:COL.op, tooltip:"Un nombre entier choisi au hasard."},
    {type:"s_start", message0:"quand le drapeau vert %1 est cliqué", args0:[{type:"field_label", text:"⚑"}], nextStatement:null, colour:COL.event, tooltip:"Le programme commence ici."},
    {type:"s_def", message0:"définir %1", args0:[{type:"field_label", text:"motif"}], nextStatement:null, colour:COL.my, tooltip:"Les blocs placés dessous sont exécutés à chaque bloc « motif »."},
    st("s_call","motif",[],COL.my,{tooltip:"Dessine le motif défini plus bas."}),
    st("s_avancer","avancer de %1",[vin("N")],COL.move,{tooltip:"Le lutin avance (en pas)."}),
    st("s_droite","tourner ↻ de %1 degrés",[vin("N")],COL.move,{tooltip:"Le lutin tourne dans le sens des aiguilles d'une montre."}),
    st("s_gauche","tourner ↺ de %1 degrés",[vin("N")],COL.move,{tooltip:"Le lutin tourne dans le sens inverse des aiguilles d'une montre."}),
    st("s_orienter","s'orienter à %1",[vin("N")],COL.move,{tooltip:"0 = vers le haut, 90 = vers la droite, 180 = vers le bas, −90 = vers la gauche."}),
    st("s_aller","aller à x: %1 y: %2",[vin("X"),vin("Y")],COL.move),
    st("s_poser","stylo en position d'écriture",[],COL.pen,{tooltip:"Le lutin trace quand il se déplace."}),
    st("s_lever","relever le stylo",[],COL.pen,{tooltip:"Le lutin se déplace sans tracer."}),
    st("s_repeter","répéter %1 fois %2 %3",[vin("N"),{type:"input_dummy"},{type:"input_statement", name:"DO"}],COL.ctrl),
    st("s_jusqua","répéter jusqu'à %1 %2 %3",[{type:"input_value", name:"C", check:"Boolean"},{type:"input_dummy"},{type:"input_statement", name:"DO"}],COL.ctrl),
    st("s_si","si %1 alors %2 %3",[{type:"input_value", name:"C", check:"Boolean"},{type:"input_dummy"},{type:"input_statement", name:"DO"}],COL.ctrl),
    st("s_sisinon","si %1 alors %2 %3 sinon %4 %5",[{type:"input_value", name:"C", check:"Boolean"},{type:"input_dummy"},{type:"input_statement", name:"DO"},{type:"input_dummy"},{type:"input_statement", name:"ELSE"}],COL.ctrl),
    st("s_demander","demander %1 et attendre",[vin("T")],COL.sens),
    {type:"s_reponse", message0:"réponse", output:null, colour:COL.sens, tooltip:"Le nombre que l'on a répondu au lutin."},
    st("s_dire","dire %1",[vin("V")],COL.look),
    ...[["s_add","%1 + %2"],["s_sub","%1 − %2"],["s_mul","%1 × %2"],["s_div","%1 ÷ %2"],["s_mod","%1 modulo %2"]].map(([t,m])=>({type:t, message0:m, args0:[vin("A"),vin("B")], output:null, inputsInline:true, colour:COL.op, tooltip:t==="s_mod"?"Le reste de la division euclidienne.":""})),
    ...[["s_eq","%1 = %2"],["s_lt","%1 < %2"],["s_gt","%1 > %2"]].map(([t,m])=>({type:t, message0:m, args0:[vin("A"),vin("B")], output:"Boolean", inputsInline:true, colour:COL.op})),
    {type:"s_val", message0:"%1", args0:[{type:"field_input", name:"T", text:""}], output:null, colour:"#FFFFFF"}
  ]);
  Blockly.Blocks.s_set = {init(){ this.appendValueInput("V").appendField("mettre").appendField(new Blockly.FieldDropdown(varOpts),"VAR").appendField("à"); this.setInputsInline(true); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(COL.vars); }};
  Blockly.Blocks.s_change = {init(){ this.appendValueInput("V").appendField("ajouter"); this.appendDummyInput().appendField("à").appendField(new Blockly.FieldDropdown(varOpts),"VAR"); this.setInputsInline(true); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(COL.vars); }};
  Blockly.Blocks.s_def2 = {init(){ this.appendDummyInput().appendField("définir").appendField(new Blockly.FieldLabel(BLOC.nom),"NOM").appendField(new Blockly.FieldLabel(BLOC.param),"PAR"); this.setNextStatement(true); this.setColour(COL.my); this.setTooltip("Les blocs placés dessous sont exécutés à chaque fois qu'on utilise ce bloc."); }};
  Blockly.Blocks.s_call2 = {init(){ this.appendValueInput("N").appendField(new Blockly.FieldLabel(BLOC.nom),"NOM"); this.setInputsInline(true); this.setPreviousStatement(true); this.setNextStatement(true); this.setColour(COL.my); }};
  Blockly.Blocks.s_param = {init(){ this.appendDummyInput().appendField(new Blockly.FieldLabel(BLOC.param),"PAR"); this.setOutput(true, null); this.setColour(COL.my); this.setTooltip("La valeur donnée au bloc."); }};
  Blockly.Blocks.s_var = {init(){ this.appendDummyInput().appendField(new Blockly.FieldDropdown(varOpts),"VAR"); this.setOutput(true, null); this.setColour(COL.vars); }};
}
const DEF = {s_avancer:{N:100}, s_droite:{N:90}, s_gauche:{N:90}, s_orienter:{N:90}, s_aller:{X:0,Y:0}, s_repeter:{N:4}, s_demander:{T:"Choisis un nombre"}, s_dire:{V:"Bonjour !"},
  s_add:{A:"",B:""}, s_sub:{A:"",B:""}, s_mul:{A:"",B:""}, s_div:{A:"",B:""}, s_mod:{A:"",B:""}, s_eq:{A:"",B:""}, s_lt:{A:"",B:""}, s_gt:{A:"",B:""}, s_set:{V:0}, s_change:{V:1}, s_rand:{A:0,B:1}, s_call2:{N:50}};
const CATS = [["Événements",COL.event,["s_key"]],["Mouvement",COL.move,["s_avancer","s_droite","s_gauche","s_orienter","s_aller"]],["Stylo",COL.pen,["s_poser","s_lever"]],["Apparence",COL.look,["s_dire"]],["Contrôle",COL.ctrl,["s_repeter","s_jusqua","s_si","s_sisinon"]],["Capteurs",COL.sens,["s_demander","s_reponse"]],["Opérateurs",COL.op,["s_add","s_sub","s_mul","s_div","s_mod","s_eq","s_lt","s_gt","s_rand"]],["Variables",COL.vars,["s_set","s_change","s_var"]],["Mes blocs",COL.my,["s_call","s_call2","s_param"]]];
function tbBlock(t){ const b={kind:"block", type:t}; const d=DEF[t]; if(d){ b.inputs={}; for(const k in d) b.inputs[k]={shadow:{type:"s_val", fields:{T:String(d[k]).replace(".",",")}}}; } if(["s_set","s_change","s_var"].includes(t)) b.fields={VAR:VARS[0]}; return b; }
/* palette toujours ouverte (comme dans Scratch) : les blocs sont rangés par catégorie, sous un titre de la couleur de la catégorie */
const CATCLS = {"Événements":"event", Mouvement:"move", Stylo:"pen", Apparence:"look", "Contrôle":"ctrl", Capteurs:"sens", "Opérateurs":"op", Variables:"vars", "Mes blocs":"my"};
function toolbox(blocs){
  const contents=[];
  CATS.forEach(([n,c,l])=>{ const bl=l.filter(t=>blocs.includes(t)); if(!bl.length) return; contents.push({kind:"label", text:n, "web-class":"scrcat scrcat-"+CATCLS[n]}); bl.forEach(t=>contents.push(tbBlock(t))); });
  return {kind:"flyoutToolbox", contents};
}
/* Blockly → programme */
function expr(b){
  if(!b || !b.isEnabled()) return "";
  if(b.type==="s_val"){ const t=b.getFieldValue("T"); return numeric(t) ? num(t) : t; }
  if(b.type==="s_var") return {var:b.getFieldValue("VAR")};
  if(b.type==="s_reponse") return REP;
  if(b.type==="s_param") return PAR;
  const o=Object.keys(OPS).find(k=>OPS[k]===b.type); if(o) return {o, a:expr(b.getInputTargetBlock("A")), b:expr(b.getInputTargetBlock("B"))};
  return "";
}
function tree(block){
  const out=[];
  for(let b=block; b; b=b.getNextBlock()){
    if(!b.isEnabled()) continue; const k=b.type.slice(2); const n={k:k==="call"?"call":k, a:[], id:b.id};
    if(!["avancer","droite","gauche","orienter","aller","poser","lever","repeter","jusqua","si","sisinon","demander","dire","set","change","call","call2"].includes(n.k)) continue;
    (IN[n.k]||[]).forEach(nm=>n.a.push(expr(b.getInputTargetBlock(nm))));
    if(["repeter","jusqua","si","sisinon"].includes(n.k)) n.b=tree(b.getInputTargetBlock("DO"));
    if(n.k==="sisinon") n.b2=tree(b.getInputTargetBlock("ELSE"));
    if(n.k==="set"||n.k==="change") n.v=b.getFieldValue("VAR");
    out.push(n);
  }
  return out;
}
/* programme → blocs */
function mkExpr(ws, e){
  let b;
  if(typeof e==="number"||typeof e==="string"){ b=ws.newBlock("s_val"); b.setFieldValue(String(e).replace(".",","),"T"); b.setShadow(true); }
  else if(e.var!==undefined){ b=ws.newBlock("s_var"); b.setFieldValue(e.var,"VAR"); }
  else if(e.rep){ b=ws.newBlock("s_reponse"); }
  else if(e.param){ b=ws.newBlock("s_param"); }
  else { b=ws.newBlock(OPS[e.o]); ["A","B"].forEach((nm,i)=>{ const c=mkExpr(ws, i?e.b:e.a); b.getInput(nm).connection.connect(c.outputConnection); }); }
  if(ws.rendered){ b.initSvg(); b.render(); } return b;
}
function mkStmt(ws, n){
  const b=ws.newBlock(n.k==="call"?"s_call":"s_"+n.k);
  if(n.v!==undefined) b.setFieldValue(n.v,"VAR");
  (IN[n.k]||[]).forEach((nm,i)=>{ const c=mkExpr(ws, n.a[i]); b.getInput(nm).connection.connect(c.outputConnection); });
  if(n.b) chain(ws, b.getInput("DO").connection, n.b);
  if(n.b2) chain(ws, b.getInput("ELSE").connection, n.b2);
  if(ws.rendered){ b.initSvg(); b.render(); } return b;
}
function chain(ws, conn, list){ let c=conn; list.forEach(n=>{ const b=mkStmt(ws,n); c.connect(b.previousConnection); c=b.nextConnection; }); }
/* programme affiché en HTML (programmes déjà écrits, solutions) */
function exprHTML(e, top){
  if(typeof e==="number"||typeof e==="string") return `<span class="sv">${e===""?"&nbsp;":fmtV(e)}</span>`;
  if(e.var!==undefined) return `<span class="sr var">${e.var}</span>`;
  if(e.rep) return `<span class="sr sens">réponse</span>`;
  if(e.param) return `<span class="sr my">${BLOC.param}</span>`;
  if(e.o==="rand") return `<span class="sr op">nombre aléatoire entre ${exprHTML(e.a)} et ${exprHTML(e.b)}</span>`;
  const bool=["=","<",">"].includes(e.o); return `<span class="sr op${bool?" bool":""}">${exprHTML(e.a)} ${OPSYM[e.o]} ${exprHTML(e.b)}</span>`;
}
function progHTML(prog, def, xo){
  const row=(cls,h)=>`<div class="sb ${cls}">${h}</div>`, E=exprHTML;
  const walk=l=>l.map(n=>{ const a=n.a||[];
    switch(n.k){
      case "avancer": return row("move",`avancer de ${E(a[0])}`); case "droite": return row("move",`tourner ↻ de ${E(a[0])} degrés`); case "gauche": return row("move",`tourner ↺ de ${E(a[0])} degrés`);
      case "orienter": return row("move",`s'orienter à ${E(a[0])}`); case "aller": return row("move",`aller à x: ${E(a[0])} y: ${E(a[1])}`);
      case "poser": return row("pen","stylo en position d'écriture"); case "lever": return row("pen","relever le stylo"); case "call": return row("my","motif"); case "call2": return row("my",`${BLOC.nom} ${E(a[0])}`);
      case "repeter": return `<div class="sbg">${row("ctrl",`répéter ${E(a[0])} fois`)}<div class="sbin">${walk(n.b)}</div></div>`;
      case "jusqua": return `<div class="sbg">${row("ctrl",`répéter jusqu'à ${E(a[0])}`)}<div class="sbin">${walk(n.b)}</div></div>`;
      case "si": return `<div class="sbg">${row("ctrl",`si ${E(a[0])} alors`)}<div class="sbin">${walk(n.b)}</div></div>`;
      case "sisinon": return `<div class="sbg">${row("ctrl",`si ${E(a[0])} alors`)}<div class="sbin">${walk(n.b)}</div>${row("ctrl","sinon")}<div class="sbin">${walk(n.b2)}</div></div>`;
      case "demander": return row("sens",`demander ${E(a[0])} et attendre`); case "dire": return row("look",`dire ${E(a[0])}`);
      case "set": return row("vars",`mettre <span class="sdd">${n.v}</span> à ${E(a[0])}`); case "change": return row("vars",`ajouter ${E(a[0])} à <span class="sdd">${n.v}</span>`);
    } return ""; }).join("");
  xo=xo||{}; const KN=Object.fromEntries(KEYS.map(([a,b])=>[b,a]));
  return `<div class="sbprog">${row("event","quand le drapeau vert ⚑ est cliqué")}${walk(prog)}</div>${def?`<div class="sbprog">${row("myhat","définir motif")}${walk(def)}</div>`:""}`
    + (xo.def2?`<div class="sbprog">${row("myhat",`définir ${BLOC.nom} <span class="sr my">${BLOC.param}</span>`)}${walk(xo.def2)}</div>`:"")
    + Object.entries(xo.keys||{}).map(([k,ps])=>ps.map(p=>`<div class="sbprog">${row("event",`quand la touche ${KN[k]} est pressée`)}${walk(p)}</div>`).join("")).join("");
}

/* ================= scène ================= */
const SX=v=>v, SY=v=>-v;
function stageSVG(L, petit){
  const h = petit ? 110 : 180;
  let g=`<svg class="sstage" id="sstage" viewBox="-240 ${-h} 480 ${2*h}" role="img" aria-label="Scène du lutin"><rect x="-240" y="${-h}" width="480" height="${2*h}" fill="#fff"/>`;
  for(let x=-200;x<=200;x+=40) g+=`<line x1="${x}" y1="${-h}" x2="${x}" y2="${h}" class="sgrid${x===0?" ax":""}"/>`;
  for(let y=-160;y<=160;y+=40) if(Math.abs(y)<h) g+=`<line x1="-240" y1="${y}" x2="240" y2="${y}" class="sgrid${y===0?" ax":""}"/>`;
  g+=`<g id="scible"></g><g id="strace"></g>`;
  g+=`<g id="slutin" class="slutin"><g transform="translate(-16 -16)"><path d="M6 26 L16 2 L26 26 L16 20 Z" fill="#FF8C1A" stroke="#a24d00" stroke-width="2" stroke-linejoin="round"/><circle cx="16" cy="13" r="3" fill="#fff"/></g></g>`;
  g+=`<g id="sbulle" hidden><rect id="sbr" x="-230" y="${-h+8}" width="200" height="44" rx="14" fill="#fff" stroke="#1b2a44" stroke-width="2"/><text id="sbt" x="-216" y="${-h+37}" class="sbt"></text></g>`;
  return g+"</svg>";
}
const lineEl = (l, cls) => `<line x1="${SX(l[0])}" y1="${SY(l[1])}" x2="${SX(l[2])}" y2="${SY(l[3])}" class="${cls}"/>`;
function thumb(lines){ let mnx=1e9,mny=1e9,mxx=-1e9,mxy=-1e9; lines.forEach(l=>{ mnx=Math.min(mnx,l[0],l[2]); mxx=Math.max(mxx,l[0],l[2]); mny=Math.min(mny,-l[1],-l[3]); mxy=Math.max(mxy,-l[1],-l[3]); });
  const p=14, w=Math.max(40,mxx-mnx)+2*p, h=Math.max(40,mxy-mny)+2*p, cx=(mnx+mxx)/2, cy=(mny+mxy)/2;
  return `<svg viewBox="${cx-w/2} ${cy-h/2} ${w} ${h}" class="sthumb" aria-hidden="true">${lines.map(l=>lineEl(l,"stc")).join("")}</svg>`; }

/* ================= page ================= */
let P=null, LV=null, WS=null, THEME=null, R0=null, cur=0, timer=null, RO=null, run=null, rapide=false, done=[], live=null;
/* séance : SUB = numéros (dans LV) des niveaux de la séance, dans l'ordre ; OPT = options données par la page (niv, onChange, onFin, fin) */
let SUB=[], OPT={};
const numero = i => SUB.indexOf(i)+1;
const D = L => L && L.d!==undefined ? L.d : !!(P && P.dessin);   /* niveau avec dessin ? */
const store = { get(k){ try{ return localStorage.getItem(P.key+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(P.key+k,v); }catch(e){} }, del(k){ try{ localStorage.removeItem(P.key+k); }catch(e){} } };
const $ = id => R0 && R0.querySelector("#"+id);
const loadJS = src => new Promise((ok,ko)=>{ const ex=document.querySelector(`script[src="${src}"]`); if(ex){ if(ex.dataset.mine!=="1" || ex.dataset.ok) return ok(); ex.addEventListener("load",ok); ex.addEventListener("error",ko); return; } const s=document.createElement("script"); s.src=src; s.dataset.mine="1"; s.onload=()=>{ s.dataset.ok=1; ok(); }; s.onerror=ko; document.head.appendChild(s); });
const statique = L => ["prevois","choix","mystere"].includes(L.type);

function style(){
  if(document.getElementById("scr-style")) return;
  const s=document.createElement("style"); s.id="scr-style"; s.textContent=`
.scr .llevels{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px}
.scr .lnum{width:44px;height:44px;border-radius:12px;border:2px solid var(--line);background:var(--surface);font:inherit;font-weight:700;font-size:16px;cursor:pointer;color:var(--ink)}
.scr .lnum.ok{background:var(--okbg);border-color:var(--ok);color:var(--ok)}
.scr .lnum.defi{border-color:#f0a43a}
.scr .lnum.on{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 35%,transparent)}
.scr .sgrid2{display:grid;grid-template-columns:minmax(280px,440px) minmax(0,1fr);gap:20px;align-items:start}
.scr h2{font-family:var(--f-display);font-size:1.15rem;margin:0 0 8px}
.scr .scons{margin:0 0 10px;line-height:1.55}
.scr .sstage{display:block;width:100%;height:auto;border:2px solid var(--line);border-radius:14px;background:#fff;color-scheme:light}
.scr .sgrid{stroke:#eef2f8;stroke-width:1} .scr .sgrid.ax{stroke:#d5deec}
.scr .scib{stroke:#9aa3b2;stroke-width:6;stroke-linecap:round;stroke-dasharray:2 12;opacity:.7}
.scr .str{stroke:#1a5fb4;stroke-width:4;stroke-linecap:round}
.scr .slutin{transform-box:view-box}
.scr .sbt{font:700 19px Arial,Helvetica,sans-serif;fill:#1b2a44}
.scr .sbtns{display:flex;flex-wrap:wrap;gap:10px;margin:12px 0 6px;align-items:center}
.scr .skeys{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap}.scr .skey{min-width:46px;font-size:20px;padding:6px 10px}
.scr .scount{color:var(--muted);font-size:15px;margin:6px 0}
.scr .lmsg{border-radius:12px;padding:12px 14px;margin:10px 0;line-height:1.6;background:color-mix(in srgb,var(--c) 10%,var(--surface));color:var(--ink)}
.scr .lmsg.ok{background:var(--okbg)} .scr .lmsg.ko{background:var(--kobg)}
.scr .lmsg .btn{margin-top:10px}
.scr .sws{height:560px;border:2px solid var(--line);border-radius:14px;overflow:hidden;background:#f9f9fb;color-scheme:light}
.scr details.lhelp{margin-top:12px}
.scr .swshint{margin:0 0 8px;font-size:15px;line-height:1.5;color:var(--ink)}
.scr .scrcat .blocklyFlyoutLabelText{font:700 16px Arial,Helvetica,sans-serif!important}
.scr .scrcat-move .blocklyFlyoutLabelText{fill:#2f6fd0} .scr .scrcat-pen .blocklyFlyoutLabelText{fill:#0b8f6a} .scr .scrcat-look .blocklyFlyoutLabelText{fill:#7a4fd6}
.scr .scrcat-ctrl .blocklyFlyoutLabelText{fill:#c27400} .scr .scrcat-sens .blocklyFlyoutLabelText{fill:#2f8fb8} .scr .scrcat-op .blocklyFlyoutLabelText{fill:#2f8f2f}
.scr .scrcat-event .blocklyFlyoutLabelText{fill:#a07000} .scr .scrcat-vars .blocklyFlyoutLabelText{fill:#c25e00} .scr .scrcat-my .blocklyFlyoutLabelText{fill:#d6336c}
.scr .sstatic{border:2px solid var(--line);border-radius:14px;padding:14px 16px;background:#f9f9fb;color:#1b2a44;overflow-x:auto;color-scheme:light}
.scr .sstatic-t{margin:0 0 6px;font-weight:700}
.scr .sbprog{display:inline-block;font:700 15px Arial,Helvetica,sans-serif;color:#fff;margin:6px 12px 6px 0;vertical-align:top}
.scr .sb{padding:7px 11px;border-radius:7px;margin:2px 0;width:max-content;max-width:100%;line-height:1.6}
.scr .sb.event{background:#FFBF00;color:#3b2a00;border-radius:16px 16px 7px 7px} .scr .sb.myhat{background:#FF6680;border-radius:16px 16px 7px 7px}
.scr .sb.move{background:#4C97FF} .scr .sb.ctrl{background:#FFAB19;color:#3b2a00} .scr .sb.pen{background:#0b8f6a} .scr .sb.my{background:#FF6680}
.scr .sb.sens{background:#2f8fb8} .scr .sb.look{background:#9966FF} .scr .sb.vars{background:#e07000}
.scr .sbin{margin-left:18px;padding-left:6px;border-left:6px solid #FFAB19;min-height:10px}
.scr .sv{display:inline-block;background:#fff;color:#1b2a44;padding:0 8px;border-radius:10px;min-width:22px;text-align:center}
.scr .sr{display:inline-block;padding:0 7px;border-radius:12px;border:1px solid rgba(0,0,0,.15)}
.scr .sr.my{background:#FF6680;color:#fff} .scr .sr.var{background:#e07000;color:#fff} .scr .sr.sens{background:#2f8fb8;color:#fff} .scr .sr.op{background:#3f9f3f;color:#fff} .scr .sr.bool{border-radius:4px}
.scr .sdd{background:rgba(0,0,0,.18);padding:0 6px;border-radius:6px}
.scr .sask{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0;padding:10px 12px;border:2px solid #5CB1D6;border-radius:12px;background:color-mix(in srgb,#5CB1D6 12%,var(--surface))}
.scr .sin{width:120px;font:700 20px Arial,Helvetica,sans-serif;padding:7px 10px;border:2px solid var(--line);border-radius:10px;background:#fff;color:#1b2a44;color-scheme:light}
.scr .slab{font-weight:700}
.scr .ssaid{margin:8px 0;font-size:16px}
.scr .ssaid b{font-family:Arial,Helvetica,sans-serif}
.scr .schoix{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:10px 0}
.scr .schoix.txt{grid-template-columns:repeat(2,minmax(0,1fr))}
.scr .sch{display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px;border:2px solid var(--line);border-radius:12px;background:var(--surface);color:var(--ink);font:inherit;font-weight:700;cursor:pointer}
.scr .sch.txt{font:700 20px Arial,Helvetica,sans-serif;padding:12px}
.scr .sch.sel{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 35%,transparent)}
.scr .sthumb{width:100%;height:96px;background:#fff;border-radius:8px}
.scr .stc{stroke:#1a5fb4;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}
.scr .stests{margin:6px 0 0;padding-left:20px}
.scr .lsolbox{margin-top:10px}
.scr .sspeed[aria-pressed="true"]{background:var(--ink);color:var(--paper)}
.scr.scalc .sgrid2{grid-template-columns:minmax(260px,360px) minmax(0,1fr)}
@media (max-width:820px){ .scr .sgrid2, .scr.scalc .sgrid2{grid-template-columns:minmax(0,1fr)} .scr .sws{height:470px} }
`; document.head.appendChild(s);
}
async function init(root, pack, opts){
  destroy(); style(); R0=root; P=PACKS[pack]||PACKS["4e"]; LV=P.levels; OPT=opts||{};
  SUB=(OPT.niv||LV.map((_,i)=>i)).filter(i=>i>=0 && i<LV.length);
  try{ done=JSON.parse(store.get("done")||"[]"); }catch(e){ done=[]; }
  try{ if(!window.Blockly) await loadJS("lib/blockly/blockly_compressed.js"); if(!(Blockly.Msg && Blockly.Msg.DELETE_BLOCK && /Supprimer/.test(Blockly.Msg.DELETE_BLOCK))) await loadJS("lib/blockly/fr.js"); }
  catch(e){ root.innerHTML=`<p class="where">Le jeu n'a pas pu se charger. Recharge la page.</p>`; return; }
  if(R0!==root || !root.isConnected) return;
  defineBlocks();
  root.innerHTML=`<div class="scr${P.dessin?"":" scalc"}">
    <div class="llevels" id="slevels"></div><p class="where" id="sleg"></p>
    <div class="sgrid2">
      <div class="sleft"><h2 id="stitre"></h2><p class="scons" id="scons"></p><div id="sscene"></div>
        <div id="sask"></div><div class="sbtns" id="sbtns"></div><p class="ssaid" id="ssaid" hidden></p>
        <p class="scount" id="scount"></p><div class="lmsg" id="smsg" hidden></div>
        <details class="lhelp"><summary>Besoin d'aide ?</summary><p id="saide"></p><div id="ssol"></div></details></div>
      <div class="sright"><p class="swshint" id="swshint">👉 <b>Fais glisser</b> les blocs de la colonne de gauche et accroche-les sous le bloc jaune « quand le drapeau vert est cliqué ». Pour enlever un bloc, fais-le glisser vers la gauche ou dans la poubelle.</p><div id="sws" class="sws"></div><div id="sstatic" class="sstatic" hidden></div></div>
    </div></div>`;
  const nd=SUB.filter(i=>LV[i].defi).length; $("sleg").innerHTML = !nd ? "" : OPT.niv ? `Les niveaux à bordure orange sont des <b>défis</b>.` : `Les ${nd} derniers niveaux (bordure orange) sont des <b>défis</b>.`;
  THEME = THEME || Blockly.Theme.defineTheme("staal-scr", {base:Blockly.Themes.Classic, fontStyle:{family:"Arial, Helvetica, sans-serif", size:12, weight:"600"}, startHats:true,
      componentStyles:{workspaceBackgroundColour:"#f9f9fb", flyoutBackgroundColour:"#eef0f5", flyoutOpacity:1, toolboxBackgroundColour:"#ffffff", toolboxForegroundColour:"#1b2a44"}});
  WS = Blockly.inject($("sws"), {renderer:"zelos", media:"lib/blockly/media/", sounds:false, trashcan:true, scrollbars:true,
    zoom:{controls:true, wheel:false, startScale:(window.innerWidth<600?0.62:0.78), maxScale:1.4, minScale:0.45}, move:{scrollbars:true, drag:true, wheel:true},
    theme:THEME, toolbox:{kind:"flyoutToolbox", contents:[{kind:"block", type:"s_poser"}]}});
  WS.addChangeListener(Blockly.Events.disableOrphans);
  WS.addChangeListener(e=>{ if(e.isUiEvent) return; compte(); if(!timer && e.type!==Blockly.Events.FINISHED_LOADING) save(); });
  RO=new ResizeObserver(()=>{ if(WS) Blockly.svgResize(WS); }); RO.observe($("sws"));
  let st=+(store.get("niveau")||0); if(!SUB.includes(st)){ st=SUB.find(i=>!done.includes(i)); if(st===undefined) st=SUB[0]; }
  load(st);
}
function levelsBar(){
  $("slevels").innerHTML=SUB.map((i,j)=>{ const L=LV[i]; return `<button class="lnum${i===cur?" on":""}${done.includes(i)?" ok":""}${L.defi?" defi":""}" data-i="${i}" aria-label="Niveau ${j+1}${L.defi?" (défi)":""}${done.includes(i)?" (réussi)":""}">${j+1}</button>`; }).join("");
  R0.querySelectorAll("#slevels .lnum").forEach(b=>b.onclick=()=>{ stop(); load(+b.dataset.i); });
}
function mainProg(){ const s=WS.getBlocksByType("s_start")[0]; return s ? tree(s.getNextBlock()) : []; }
function defProg(){ const L=LV[cur]; if(!L.def) return null; const d=WS.getBlocksByType("s_def")[0]; return d ? tree(d.getNextBlock()) : L.def; }
function defProg2(){ const d=WS && WS.getBlocksByType("s_def2")[0]; return d ? tree(d.getNextBlock()) : null; }
function keyProgs(){ const o={}; if(!WS) return o; WS.getBlocksByType("s_key").forEach(h=>{ const k=h.getFieldValue("K"); (o[k]=o[k]||[]).push(tree(h.getNextBlock())); }); return o; }
function pressKey(k){
  const L=LV[cur]; if(!L || !L.keys || !WS) return; const ps=keyProgs()[k];
  if(!ps || !ps.length){ msg(`Aucun script ne démarre quand on appuie sur la flèche ${ARROW[k]}.`, "ko"); return; }
  if(run && run.list){ ps.forEach(pr=>run.list.push(exec(pr, run.X))); return; }
  anim(null, null, undefined, X=>{ if(X.err) msg(`<b>Oups !</b> ${X.err}`, "ko"); }, {keep:true, start:ps});
}
function load(i){
  stop(); live=null; cur=i; store.set("niveau",i); const L=LV[i]; VARS = (L.vars && L.vars.length) ? L.vars : ["nombre"]; if(L.bloc) BLOC=L.bloc;
  const sc=R0.querySelector(".scr"); if(sc) sc.classList.toggle("scalc", !D(L));
  $("stitre").textContent=`Niveau ${numero(i)}${OPT.niv?" sur "+SUB.length:""}${L.defi?" · Défi":""} · ${L.titre.replace(/^Défi : /,"")}`;
  if(OPT.onChange) OPT.onChange(i, done.slice());
  $("scons").innerHTML=L.consigne; $("saide").textContent=L.aide;
  $("ssol").innerHTML = L.voir && L.sol ? `<details class="lsolbox"><summary>Toujours bloqué ? Voir une solution possible</summary><p class="where">Essaie d'abord avec l'aide ! Voici <b>une</b> solution :</p>${progHTML(L.sol, null, {def2:L.soldef2, keys:L.solkeys})}</details>` : "";
  const h=R0.querySelector("details.lhelp"); if(h) h.open=false;
  levelsBar(); msg(""); said(null); $("sask").innerHTML="";
  $("sscene").innerHTML = D(L) ? stageSVG(L) : stageSVG({}, true);
  if(D(L) && L.ref){ const X=runSync(L, L.ref, L.tests?L.tests[0]:null, L.def, {def2:L.refdef2, keys:L.refkeys, seq:L.seq}); $("scible").innerHTML=X.lines.map(l=>lineEl(l,"scib")).join(""); }
  boutons(L);
  const st=$("sstatic"), ws=$("sws");
  if(statique(L)){ ws.hidden=true; st.hidden=false; st.innerHTML=`<p class="sstatic-t">Le programme (déjà écrit) :</p>${progHTML(L.prog)}`; $("scount").textContent=""; place(); return; }
  ws.hidden=false; st.hidden=true;
  if(Blockly.common && Blockly.common.setMainWorkspace) Blockly.common.setMainWorkspace(WS);
  WS.updateToolbox(toolbox(L.blocs||[]));
  Blockly.Events.disable(); WS.clear();
  let ok=false; const saved=store.get("prog-"+i);
  if(saved){ try{ Blockly.serialization.workspaces.load(JSON.parse(saved), WS); ok = WS.getBlocksByType("s_start").length===1 && (!L.def || WS.getBlocksByType("s_def").length===1) && (!L.bloc || WS.getBlocksByType("s_def2").length===1); }catch(e){ ok=false; } }
  if(!ok){ WS.clear(); const s=WS.newBlock("s_start"); s.initSvg(); s.render(); s.moveBy(20,20); if(L.depart) chain(WS, s.nextConnection, L.depart);
    if(L.def){ const d=WS.newBlock("s_def"); d.initSvg(); d.render(); chain(WS, d.nextConnection, L.def); d.moveBy(window.innerWidth<600?20:290, window.innerWidth<600?260:20); }
    if(L.bloc){ const d=WS.newBlock("s_def2"); d.initSvg(); d.render(); if(L.def2pre && L.def2pre.length) chain(WS, d.nextConnection, L.def2pre); d.moveBy(window.innerWidth<600?20:300, window.innerWidth<600?280:20); } }
  WS.getBlocksByType("s_start")[0].setDeletable(false);
  { const d2=WS.getBlocksByType("s_def2")[0]; if(d2) d2.setDeletable(false); }
  const d=WS.getBlocksByType("s_def")[0]; if(d){ d.getDescendants(false).forEach(b=>{ b.setDeletable(false); b.setMovable(b===d); b.setEditable(false); }); }
  Blockly.Events.enable();
  Blockly.svgResize(WS);
  { const s0=WS.getBlocksByType("s_start")[0], vm=WS.getMetricsManager().getViewMetrics(true), p=s0.getRelativeToSurfaceXY(), dx=vm.left+20/WS.scale-p.x, dy=vm.top+20/WS.scale-p.y;
    Blockly.Events.disable(); WS.getTopBlocks(false).forEach(b=>b.moveBy(dx,dy)); Blockly.Events.enable(); }
  WS.getAllBlocks(false).forEach(b=>{ if(!["s_start","s_def","s_def2","s_key"].includes(b.type)){ const r=b.getRootBlock(); b.setEnabled(!!r && ["s_start","s_def","s_def2","s_key"].includes(r.type)); } });
  compte(); place();
}
function boutons(L){
  let h="";
  if(L.type==="prevois" && D(L)){
    $("sask").innerHTML=`<p class="slab">Quel dessin le lutin va-t-il faire ?</p><div class="schoix">${L.choix.map((c,j)=>`<button class="sch" data-j="${j}">${thumb(runSync(L,c).lines)}<span>Dessin ${"ABC"[j]}</span></button>`).join("")}</div>`;
    R0.querySelectorAll(".sch").forEach(b=>b.onclick=()=>{ R0.querySelectorAll(".sch").forEach(x=>x.classList.toggle("sel",x===b)); prevoisDessin(+b.dataset.j); });
  }
  else if(L.type==="prevois") h=`<label class="slab" for="sin">Le lutin dira :</label><input id="sin" class="sin" autocomplete="off"><button class="btn primary" id="sgo">Vérifier en lançant</button>`;
  else if(L.type==="choix"){
    $("sask").innerHTML=`<p class="slab">Le lutin dit le résultat de :</p><div class="schoix txt">${L.choix.map((c,j)=>`<button class="sch txt" data-j="${j}">${c.lab}</button>`).join("")}</div>`;
    R0.querySelectorAll(".sch").forEach(b=>b.onclick=()=>{ R0.querySelectorAll(".sch").forEach(x=>x.classList.toggle("sel",x===b)); choixExpr(+b.dataset.j); });
    h=`<label class="slab" for="sin">Tester avec le nombre :</label><input id="sin" class="sin" autocomplete="off" value="2"><button class="btn primary" id="stest">⚑ Lancer</button>`;
  }
  else if(L.type==="mystere") h=`<span class="slab">Les deux nombres :</span><input id="sin" class="sin" autocomplete="off" aria-label="Premier nombre"><input id="sin2" class="sin" autocomplete="off" aria-label="Deuxième nombre"><button class="btn primary" id="smys">Vérifier</button>`;
  else h=`<button class="btn primary" id="srun">⚑ Lancer le programme</button>${D(L) && !L.tests && !L.keys ? "" : `<button class="btn" id="scheck">✓ Vérifier mon programme</button>`}${L.type==="bug"?`<button class="btn" id="srestart">Reprendre le programme du début</button>`:""}`;
  if(D(L) && !(L.type==="prevois")) h+=`<button class="btn sspeed" id="sspeed" aria-pressed="${rapide}">Rapide</button>`;
  if(L.keys) h+=`<span class="skeys"><span class="slab">Touches :</span>${L.touches.map(k=>`<button class="btn skey" type="button" data-k="${k}" aria-label="Flèche ${k}">${ARROW[k]}</button>`).join("")}</span>`;
  $("sbtns").innerHTML=h;
  const on=(id,f)=>{ const e=$(id); if(e) e.onclick=f; };
  on("srun", lancer); on("scheck", verifier3); on("sgo", prevois3); on("stest", ()=>{ const v=($("sin").value||"").trim(); if(!numeric(v)){ msg("Écris un nombre.", "ko"); return; } anim(L.prog, null, v, ()=>{}); }); on("smys", mystere);
  on("srestart", ()=>{ store.del("prog-"+cur); load(cur); });
  on("sspeed", ()=>{ rapide=!rapide; $("sspeed").setAttribute("aria-pressed", rapide); });
  R0.querySelectorAll(".skey").forEach(b=>b.onclick=()=>pressKey(b.dataset.k));
  ["sin","sin2"].forEach(id=>{ const e=$(id); if(e) e.onkeydown=ev=>{ if(ev.key==="Enter"){ const b=$("sgo")||$("smys")||$("stest"); if(b) b.click(); } }; });
}
function save(){ if(!WS || statique(LV[cur])) return; try{ store.set("prog-"+cur, JSON.stringify(Blockly.serialization.workspaces.save(WS))); }catch(e){} }
function compte(){ if(!WS) return; const L=LV[cur], el=$("scount"); if(!el || statique(L)) return; const n=count(mainProg()); el.innerHTML = `Blocs utilisés : <b>${n}</b>${L.max?` · ${L.strict?"au maximum":"conseillé"} : ${L.max}`:""}`; }
function msg(h, kind){ const el=$("smsg"); if(!el) return; el.hidden=!h; el.className="lmsg "+(kind||""); el.innerHTML=h; }
function said(list){ const el=$("ssaid"); if(!el) return; if(!list){ el.hidden=true; el.innerHTML=""; return; } el.hidden=false; el.innerHTML=`Le lutin a dit : ${list.length?list.map(v=>`<b>${fmtV(v)}</b>`).join(" ; "):"(rien)"}`; }
function bulle(v){ const g=$("sbulle"); if(!g) return; if(v===null){ g.setAttribute("hidden",""); return; } g.removeAttribute("hidden"); const t=$("sbt"); t.textContent=fmtV(v); const w=Math.min(460, Math.max(70, t.getComputedTextLength()+30)); $("sbr").setAttribute("width", w); }
function place(X){ const L=LV[cur]; const d=X||ctx0(L); const g=$("slutin"); if(g) g.setAttribute("transform", `translate(${SX(d.x)} ${SY(d.y)}) rotate(${d.dir})`); if(!X){ const t=$("strace"); if(t) t.innerHTML=""; bulle(null); } }
function stop(){ if(timer){ clearTimeout(timer); timer=null; } run=null; if(WS) WS.highlightBlock(null); setBusy(false); const a=$("sask"); if(a && a.dataset.ask){ a.innerHTML=""; delete a.dataset.ask; } }
function setBusy(b){ if(!R0) return; R0.querySelectorAll("#sbtns button:not(#sspeed):not(.skey), #sbtns input, .sch").forEach(x=>x.disabled=b); }
/* exécution animée ; entree : réponse automatique à « demander » (sinon, on la demande à l'élève) */
function anim(prog, def, entree, fin, o){
  o=o||{}; const L=LV[cur]; let X;
  if(o.keep && live){ stop(); X=live; }
  else { stop(); place(); said(null); X=ctx0(L); X.def=def||L.def||null; X.def2=o.def2||null; }
  live=X;
  const list=[]; if(prog) list.push(exec(prog, X)); (o.start||[]).forEach(pr=>list.push(exec(pr, X)));
  run={list, X, i:0}; setBusy(true);
  let send; const DL = rapide ? {line:25, move:15, turn:8, say:350} : {line:170, move:120, turn:70, say:650};
  const finish=err=>{ timer=null; run=null; setBusy(false); if(WS) WS.highlightBlock(null); if(err) X.err=err; fin(X); };
  const step=()=>{
    if(!run || run.X!==X) return;
    if(!run.list.length){ finish(); return; }
    run.i%=run.list.length; const g=run.list[run.i]; let r;
    try{ r=g.next(send); send=undefined; }catch(e){ finish(e&&e.err?e.err:"Erreur dans le programme."); return; }
    if(r.done){ run.list.splice(run.i,1); step(); return; }
    const a=r.value, nxt=()=>{ run.i++; };
    if(a.t==="hl"){ if(WS && a.id && WS.getBlockById(a.id)) WS.highlightBlock(a.id); step(); return; }
    if(a.t==="line"){ $("strace").insertAdjacentHTML("beforeend", lineEl(a.l,"str")); place(X); nxt(); timer=setTimeout(step, DL.line); return; }
    if(a.t==="move"){ place(X); nxt(); timer=setTimeout(step, DL.move); return; }
    if(a.t==="turn"){ place(X); nxt(); timer=setTimeout(step, DL.turn); return; }
    if(a.t==="say"){ bulle(a.v); said(X.said); nxt(); timer=setTimeout(step, DL.say); return; }
    if(a.t==="ask"){
      if(entree!==undefined && entree!==null){ send=String(entree); bulle(`${a.q} → ${fmtV(entree)}`); timer=setTimeout(step, DL.say); return; }
      bulle(a.q); setBusy(false); const box=$("sask"); box.dataset.ask=1;
      box.innerHTML=`<form class="sask" id="sform"><label class="slab" for="srep">${a.q}</label><input id="srep" class="sin" autocomplete="off"><button class="btn primary" type="submit">✓</button></form>`;
      const f=$("srep"); f.focus({preventScroll:true});
      $("sform").onsubmit=e=>{ e.preventDefault(); const v=(f.value||"").trim(); if(!numeric(v)){ f.style.borderColor="var(--ko)"; return; } box.innerHTML=""; delete box.dataset.ask; setBusy(true); send=v; bulle(null); step(); };
      return; }
    nxt(); timer=setTimeout(step, a.t==="var"?(rapide?5:(D(L)?60:20)):0);
  };
  step();
}
function win(extra){
  const avant=SUB.every(i=>done.includes(i));
  if(!done.includes(cur)){ done.push(cur); store.set("done", JSON.stringify(done)); } levelsBar();
  const nxt=SUB[SUB.indexOf(cur)+1];
  msg(`<b>Bravo, niveau réussi !</b> ${extra||""}${nxt!==undefined?`<br><button class="btn primary" id="snext">Niveau suivant →</button>`:OPT.onFin?`<br><button class="btn primary" id="sfinb">${OPT.fin||"Terminer la séance"} →</button>`:"<br>Tu as terminé tous les niveaux : bravo !"}`, "ok");
  const n=$("snext"); if(n) n.onclick=()=>load(nxt);
  const fb=$("sfinb"); if(fb) fb.onclick=()=>OPT.onFin(done.slice());
  if(OPT.onChange) OPT.onChange(cur, done.slice());
  if(!avant && SUB.every(i=>done.includes(i)) && OPT.onFin) OPT.onFin(done.slice());
}
const blocName = {call2:"que tu as créé", demander:"« demander … et attendre »", repeter:"« répéter … fois »", call:"« motif »", set:"« mettre … à »", change:"« ajouter … à »", sisinon:"« si … alors … sinon »", jusqua:"« répéter jusqu'à »", si:"« si … alors »"};
function lancer(){
  const L=LV[cur], prog=mainProg();
  if(!prog.length){ msg("Ton programme est vide : accroche des blocs sous « quand le drapeau vert est cliqué ».", "ko"); return; }
  msg(""); anim(prog, defProg(), undefined, X=>{
    if(X.err){ msg(`<b>Oups !</b> ${X.err}`, "ko"); return; }
    if(L.keys){ msg(`Le drapeau vert a préparé le lutin. Maintenant, appuie sur les flèches (au clavier ou avec les boutons ${L.touches.map(k=>ARROW[k]).join(" ")}) pour le piloter. Pour tester l'escalier, clique sur « ✓ Vérifier mon programme ».`, ""); return; }
    if(D(L) && L.tests){ msg("Le lutin a tracé sa figure. Clique sur « ✓ Vérifier mon programme » pour le tester avec plusieurs longueurs.", ""); return; }
    if(!D(L)){ msg(X.said.length ? "Le programme est terminé. Clique sur « Vérifier mon programme » pour le tester avec plusieurs nombres." : "Le programme est terminé, mais le lutin n'a rien dit : utilise le bloc « dire ».", ""); return; }
    const ref=runSync(L, L.ref, null, L.def, {def2:L.refdef2}), c=compare(X.lines, ref.lines);
    if(!c.ok){ msg(`<b>Ce n'est pas encore le bon dessin.</b> ${c.manque&&c.trop?"Il manque des traits, et il y a des traits en trop.":c.manque?"Il manque des traits.":"Il y a des traits en trop."} Compare avec le dessin en pointillés gris.`, "ko"); return; }
    const k=kinds(prog, defProg2()), miss=(L.must||[]).filter(m=>!k.has(m)); const n=count(prog);
    if(miss.length){ msg(`<b>Le dessin est juste !</b> Mais dans ce niveau, il faut utiliser le bloc ${miss.map(m=>blocName[m]||m).join(" et ")}.`, "ko"); return; }
    if(L.strict && n>L.max){ msg(`<b>Le dessin est juste !</b> Mais tu as utilisé ${n} blocs : le défi, c'est d'en utiliser ${L.max} au maximum. Cherche ce qui se répète.`, "ko"); return; }
    win(`Tu as utilisé ${n} bloc${n>1?"s":""}.${!L.strict && L.max && n>L.max?` Défi : c'est possible avec ${L.max} blocs !`:""}`);
  }, {def2:defProg2()});
}
/* 3e : tests avec plusieurs nombres */
function verifier3(){
  stop(); live=null; place(); const L=LV[cur], prog=mainProg();
  if(!prog.length){ msg("Ton programme est vide : accroche des blocs sous « quand le drapeau vert est cliqué ».", "ko"); return; }
  const k=kinds(prog, defProg2()), miss=(L.must||[]).filter(m=>!k.has(m));
  const showLines = X => { $("strace").innerHTML=X.lines.map(l=>lineEl(l,"str")).join(""); place(X); };
  if(L.keys){
    const kp=keyProgs(), manq=L.touches.filter(t=>!kp[t]);
    if(manq.length){ msg(`Il manque le script « quand la touche flèche ${manq.map(t=>t+" "+ARROW[t]).join(" » et le script « quand la touche flèche ")} est pressée » (catégorie Événements).`, "ko"); return; }
    const X=runSync(L, prog, null, null, {keys:kp, seq:L.seq}), ref=runSync(L, L.ref, null, null, {keys:L.refkeys, seq:L.seq});
    if(X.err){ msg(`<b>Oups !</b> ${X.err}`, "ko"); return; }
    showLines(X); const c=compare(X.lines, ref.lines);
    if(!c.ok){ msg(`<b>Pas encore !</b> On a cliqué sur le drapeau vert, puis appuyé sur ${L.seq.map(t=>ARROW[t]).join(" ")} : ${c.manque&&c.trop?"il manque des traits, et il y a des traits en trop":c.manque?"il manque des traits":"il y a des traits en trop"}. Compare avec l'escalier en pointillés gris (le dessin du test est affiché).`, "ko"); return; }
    win(`Avec le drapeau vert puis ${L.seq.map(t=>ARROW[t]).join(" ")}, le lutin trace bien l'escalier. Tes ${1+Object.values(kp).reduce((a,l)=>a+l.length,0)} scripts fonctionnent ensemble.`); return;
  }
  if(L.check){
    let X;
    for(const seed of [11,23,47]){ X=runSync(L, prog, null, null, {seed}); if(X.err){ msg(`<b>Oups !</b> ${X.err}`, "ko"); return; } const e=L.check(X); if(e){ msg(`<b>Pas encore !</b> ${e}`, "ko"); return; } }
    if(miss.length){ msg(`<b>Les résultats sont justes !</b> Mais dans ce niveau, il faut utiliser le bloc ${miss.map(m=>blocName[m]||m).join(" et ")}.`, "ko"); return; }
    win(L.okmsg ? L.okmsg(X) : `Ton programme a été testé avec 3 séries de 100 tirages : à chaque fois, le lutin a bien dit le nombre de 0 puis le nombre de 1 (par exemple ${X.said.map(fmtV).join(" et ")}).`); return;
  }
  if(D(L) && L.tests){
    const li=[];
    for(const x of L.tests){
      const X=runSync(L, prog, x, null, {def2:defProg2()}), ref=runSync(L, L.ref, x, null, {def2:L.refdef2});
      if(X.err){ msg(`<b>Oups !</b> ${X.err}`, "ko"); return; }
      if(!X.asked){ msg("Ton programme doit d'abord <b>demander</b> la longueur (bloc bleu « demander … et attendre »).", "ko"); return; }
      const c=compare(X.lines, ref.lines);
      if(!c.ok){ showLines(X); msg(`<b>Pas encore !</b><ul class="stests">${li.join("")}<li>Avec <b>${fmtV(x)}</b> : ${c.manque&&c.trop?"il manque des traits, et il y a des traits en trop":c.manque?"il manque des traits":"il y a des traits en trop"} ✗ (le dessin de ce test est affiché)</li></ul>`, "ko"); return; }
      li.push(`<li>Avec <b>${fmtV(x)}</b> : la figure est juste ✓</li>`);
    }
    if(miss.length){ msg(`<b>Les figures sont justes !</b> Mais dans ce niveau, il faut utiliser le bloc ${miss.map(m=>blocName[m]||m).join(" et ")}.`, "ko"); return; }
    win(`<ul class="stests">${li.join("")}</ul>`); return;
  }
  const lines=[]; let ok=true;
  for(const x of L.tests){
    const X=runSync(L, prog, x), want=L.f(x);
    if(X.err){ msg(`<b>Oups !</b> ${X.err}`, "ko"); return; }
    if(!L.noask && !X.asked){ msg("Ton programme doit d'abord <b>demander</b> un nombre (bloc bleu « demander … et attendre »).", "ko"); return; }
    if(L.noask && X.asked){ msg("Dans ce niveau, le lutin ne doit pas demander de nombre : il doit trouver x tout seul.", "ko"); return; }
    const good = X.said.length===want.length && want.every((w,i)=>typeof w==="number" ? numeric(X.said[i]) && Math.abs(num(X.said[i])-w)<1e-9 : String(X.said[i]).trim().toLowerCase()===String(w).toLowerCase());
    if(!good) ok=false;
    lines.push(`<li>${x===null?"":`Avec <b>${fmtV(x)}</b> : `}le lutin a dit ${X.said.length?X.said.map(v=>`<b>${fmtV(v)}</b>`).join(" ; "):"(rien)"}${good?" ✓":` ✗ (il fallait ${want.map(v=>`<b>${fmtV(v)}</b>`).join(" ; ")})`}</li>`);
    if(!good) break;
  }
  if(!ok){ msg(`<b>Pas encore !</b><ul class="stests">${lines.join("")}</ul>`, "ko"); return; }
  if(miss.length){ msg(`<b>Les résultats sont justes !</b> Mais dans ce niveau, il faut utiliser le bloc ${miss.map(m=>blocName[m]||m).join(" et ")}.`, "ko"); return; }
  win(`<ul class="stests">${lines.join("")}</ul>`);
}
function prevois3(){
  const L=LV[cur], v=($("sin").value||"").trim(); if(!numeric(v)){ msg("Écris un nombre.", "ko"); return; }
  msg(""); anim(L.prog, null, L.entree, X=>{ const r=X.said[X.said.length-1];
    if(Math.abs(num(v)-num(r))<1e-9) win(`Le lutin a bien dit ${fmtV(r)}.`); else msg(`<b>Raté !</b> Tu avais prévu ${fmtV(num(v))}, mais le lutin a dit ${fmtV(r)}. Refais le calcul bloc par bloc.`, "ko"); });
}
function prevoisDessin(j){
  const L=LV[cur]; msg(""); anim(L.prog, null, null, X=>{ const c=compare(runSync(L,L.choix[j]).lines, X.lines);
    if(c.ok) win(L.bravo ? `C'est bien le dessin ${"ABC"[j]}. ${L.bravo}` : `C'est bien le dessin ${"ABC"[j]} : un pentagone régulier (5 côtés, 5 × 72° = 360°).`); else { msg(`<b>Raté !</b> Ce n'est pas le dessin ${"ABC"[j]}. Regarde le dessin du lutin, puis relis le programme.`, "ko"); } });
}
function choixExpr(j){
  const L=LV[cur], xs=[-3,-1,0,1,2,5,0.5,7], ok=xs.every(x=>{ const X=runSync(L,L.prog,x); return Math.abs(num(X.said[0])-L.choix[j].f(x))<1e-9; });
  if(ok) win(`Le programme calcule (x + 3)(x − 3) = x² − 3x + 3x − 9 = <b>${L.choix[j].lab}</b>.`);
  else { const x=[0,1,2,-1].find(x=>Math.abs(num(runSync(L,L.prog,x).said[0])-L.choix[j].f(x))>1e-9); const X=runSync(L,L.prog,x);
    msg(`<b>Non.</b> Avec x = ${fmtV(x)}, le lutin dit ${fmtV(X.said[0])}, mais ${L.choix[j].lab.replace(/x/g,`(${fmtV(x)})`)} = ${fmtV(L.choix[j].f(x))}.`, "ko"); }
}
function mystere(){
  const L=LV[cur], a=($("sin").value||"").trim(), b=($("sin2").value||"").trim();
  if(!numeric(a)||!numeric(b)){ msg("Écris un nombre dans chaque case.", "ko"); return; }
  if(Math.abs(num(a)-num(b))<1e-9){ msg("Écris deux nombres <b>différents</b>.", "ko"); return; }
  const ra=runSync(L,L.prog,num(a)).said[0], rb=runSync(L,L.prog,num(b)).said[0];
  const oa=Math.abs(num(ra)-L.cible)<1e-9, ob=Math.abs(num(rb)-L.cible)<1e-9;
  if(oa&&ob) win(`Avec ${fmtV(num(a))} et avec ${fmtV(num(b))}, le lutin dit bien ${L.cible}. En effet, (x − 4)² = 25 donne x − 4 = 5 ou x − 4 = −5.`);
  else msg(`Avec ${fmtV(num(a))}, le lutin dit ${fmtV(ra)} ${oa?"✓":"✗"} · avec ${fmtV(num(b))}, il dit ${fmtV(rb)} ${ob?"✓":"✗"}. ${oa||ob?"Il en manque un : pense aux nombres négatifs !":"Remonte le programme à l'envers."}`, "ko");
}
function levels(pack){ return PACKS[pack].levels.map(L=>({t:L.titre, defi:!!L.defi})); }
function destroy(){ OPT={}; if(timer){ clearTimeout(timer); timer=null; } run=null; if(RO){ RO.disconnect(); RO=null; } if(WS){ const w=WS; WS=null; try{ w.dispose(); }catch(e){} } R0=null; }
window.addEventListener("hashchange", ()=>{ if(R0 && !R0.isConnected) destroy(); });
document.addEventListener("keydown", e=>{ if(!R0 || !R0.isConnected || !LV || !LV[cur] || !LV[cur].keys) return; const k={ArrowRight:"droite",ArrowLeft:"gauche",ArrowUp:"haut",ArrowDown:"bas"}[e.key]; if(!k || !LV[cur].touches.includes(k)) return;
  if(/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||"")) return; e.preventDefault(); pressKey(k); });
return {init, destroy, levels, PACKS, _t:{setDef2:l=>{ const d=WS.getBlocksByType("s_def2")[0]; Blockly.Events.disable(); let b=d.getNextBlock(); if(b) b.dispose(false); Blockly.Events.enable(); chain(WS, d.nextConnection, l); WS.getAllBlocks(false).forEach(x=>x.setEnabled(true)); },
  addKey:(k,l)=>{ const h=WS.newBlock("s_key"); h.setFieldValue(k,"K"); h.initSvg(); h.render(); h.moveBy(320,320); chain(WS, h.nextConnection, l); WS.getAllBlocks(false).forEach(x=>x.setEnabled(true)); },
  keyProgs:()=>keyProgs(), defProg2:()=>defProg2(), pressKey:k=>pressKey(k), RAND, PAR, runSync, compare, count, kinds, L4, L3, S, V, O, REP, premier, get WS(){ return WS; }, mainProg:()=>mainProg(), load:i=>load(i), chain:(l)=>{ const s=WS.getBlocksByType("s_start")[0]; Blockly.Events.disable(); let b=s.getNextBlock(); if(b) b.dispose(false); Blockly.Events.enable(); chain(WS, s.nextConnection, l); WS.getAllBlocks(false).forEach(x=>x.setEnabled(true)); }}};
})();
