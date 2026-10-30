/* Jeux de programmation par blocs (comme Scratch) :
   - 6e : « Le labyrinthe » (instructions et boucle « répéter … fois », programme de cycle 3) ;
   - 5e : « Le labyrinthe des nombres » (programmes de calcul, entrée / sortie, prévoir, formules, boucle simple).
   Blocs Blockly (rendu « zelos », couleurs de Scratch) ; le programme est interprété pas à pas. */
window.LABY = (function(){
const D = [[1,0],[0,1],[-1,0],[0,-1]];                 /* 0 = est, 1 = sud, 2 = ouest, 3 = nord */
const DIRS = {E:0, S:1, O:2, N:3};
const C = {move:"#4C97FF", ctrl:"#FFAB19", calc:"#FF8C1A", event:"#FFBF00"};
const MV = ["avancer","gauche","droite"], MVR = ["avancer","gauche","droite","repeter"];

/* ==================================================================
   NIVEAUX DE 6e — # haie · . chemin · R robot · D drapeau · A B C drapeaux à prévoir
   types : jeu (par défaut) · bug (programme à corriger) · prevois (deviner le drapeau d'arrivée)
================================================================== */
const L6 = [
 {titre:"Premiers pas", dir:"E", max:2, blocs:["avancer"],
  map:["########","########","########","##R.D###","########","########","########","########"],
  aide:"Glisse le bloc « avancer d'une case » sous le bloc « quand le drapeau vert est cliqué », autant de fois que nécessaire.",
  sol:[["avancer"],["avancer"]]},
 {titre:"Un virage", dir:"E", max:5, blocs:MV,
  map:["########","########","########","####D###","####.###","##R..###","########","########"],
  aide:"Le robot doit tourner. Regarde bien dans quel sens il regarde avant de choisir « à gauche » ou « à droite ».",
  sol:[["avancer"],["avancer"],["gauche"],["avancer"],["avancer"]]},
 {titre:"L'escalier", dir:"E", max:9, blocs:MV,
  map:["########","########","########","########","###.D###","##..####","#R.#####","########"],
  aide:"Avance, tourne, avance, tourne… Suis le chemin avec ton doigt sur l'écran avant de placer les blocs.",
  sol:[["avancer"],["gauche"],["avancer"],["droite"],["avancer"],["gauche"],["avancer"],["droite"],["avancer"]]},
 {titre:"Trouve l'erreur !", type:"bug", dir:"E", max:7, blocs:MV,
  map:["########","########","#####D##","#####.##","#####.##","##R...##","########","########"],
  depart:[["avancer"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["avancer"]],
  aide:"Le programme est déjà écrit, mais il contient UNE erreur. Lance-le et regarde à quel moment le robot se trompe. Il suffit de changer un seul bloc.",
  sol:[["avancer"],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["avancer"]]},
 {titre:"La longue ligne droite", dir:"E", max:2, blocs:MVR,
  map:["########","########","########","R......D","########","########","########","########"],
  aide:"Tu n'as droit qu'à 2 blocs ! Le bloc « répéter » refait plusieurs fois les blocs placés à l'intérieur. Combien de cases le robot doit-il avancer ?",
  sol:[["repeter",7,[["avancer"]]]]},
 {titre:"Prévois !", type:"prevois", dir:"E", max:0, blocs:[],
  map:["########","#......#","#...B..#","#......#","#R....C#","#......#","#...A..#","########"],
  prog:[["repeter",3,[["avancer"]]],["gauche"],["repeter",2,[["avancer"]]]], rep:"B",
  aide:"Ne lance rien : lis le programme bloc par bloc, et suis le robot avec ton doigt. Dans quelle direction regarde-t-il après « tourner à gauche » ?",
  sol:null},
 {titre:"L'escalier, en mieux", dir:"E", max:5, blocs:MVR,
  map:["########","########","########","####D###","###..###","##..####","#..#####","R.######"],
  aide:"Repère le motif qui se répète : avancer, tourner, avancer, tourner. Mets ce motif dans un bloc « répéter ».",
  sol:[["repeter",4,[["avancer"],["gauche"],["avancer"],["droite"]]]]},
 {titre:"Le tour du jardin", dir:"E", max:5, blocs:MVR,
  map:["########","#R...###","####.###","####.###","#D...###","########","########","########"],
  aide:"Le robot fait le tour d'un massif de haies. Chaque côté se fait pareil : avancer 3 fois, puis tourner à droite. Mets ce motif dans un « répéter ». Le robot s'arrête tout seul dès qu'il touche le drapeau.",
  sol:[["repeter",4,[["avancer"],["avancer"],["avancer"],["droite"]]]]},
 {titre:"Deux boucles à la suite", dir:"E", max:5, blocs:MVR,
  map:["########","######D#","######.#","######.#","######.#","#R.....#","########","########"],
  aide:"Le chemin est en deux parties : une longue ligne vers la droite, puis une longue ligne vers le haut. Une boucle pour chaque partie… et entre les deux ?",
  sol:[["repeter",5,[["avancer"]]],["gauche"],["repeter",4,[["avancer"]]]]},
 {titre:"Avant, pendant, après", dir:"E", max:8, blocs:MVR,
  map:["##########","##########","##########","#######..D","######..##","#####..###","#R....####","##########"],
  aide:"Le début est une ligne droite, puis vient un escalier. Le motif de l'escalier se répète : mets-le dans une boucle. Les blocs du début se placent AVANT la boucle, et il en faut aussi un APRÈS.",
  sol:[["repeter",4,[["avancer"]]],["repeter",3,[["gauche"],["avancer"],["droite"],["avancer"]]],["avancer"]]},
 {titre:"Prévois encore !", type:"prevois", dir:"E", max:0, blocs:[],
  map:["##########","#........#","#.....C..#","#........#","#........#","#........#","#.R...B..#","#...A....#","##########"],
  prog:[["repeter",2,[["avancer"],["avancer"],["gauche"],["avancer"],["droite"]]],["droite"],["repeter",2,[["avancer"]]]], rep:"B",
  aide:"Fais le programme « dans ta tête », un tour de boucle après l'autre. Tu peux noter sur une feuille la case et la direction du robot après chaque tour.",
  sol:null},
 {titre:"Trouve les erreurs !", type:"bug", dir:"E", max:7, blocs:MVR,
  map:["########","#R..####","###.####","###...##","#####.##","#####...","#######D","########"],
  depart:[["repeter",2,[["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"]]]],
  aide:"Ce programme contient DEUX erreurs. Le motif est presque le bon : regarde dans quel sens le robot doit tourner. Compte ensuite combien de fois le motif doit se répéter pour arriver au drapeau.",
  sol:[["repeter",3,[["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["gauche"]]]]},
 {titre:"Défi : une boucle dans une boucle", defi:true, voir:true, dir:"E", max:4, blocs:MVR,
  map:["########","########","########","#D...###","####.###","####.###","#R...###","########"],
  aide:"Tu n'as droit qu'à 4 blocs. Chaque côté du U, c'est « avancer 3 fois » puis « tourner ». Et « avancer 3 fois », ça peut s'écrire avec un « répéter »… placé à l'intérieur d'un autre « répéter » !",
  sol:[["repeter",3,[["repeter",3,[["avancer"]]],["gauche"]]]]},
 {titre:"Défi : le grand zigzag", defi:true, voir:true, dir:"E", max:7, blocs:MVR,
  map:["########","R...####","###.####","###.####","###....#","######.#","######.#","######D#"],
  aide:"Le motif « 3 cases vers la droite, puis 3 cases vers le bas » revient 2 fois. Avec seulement 7 blocs, il faut des « répéter » à l'intérieur d'un « répéter ». Commence par écrire le motif une seule fois, puis compte tes blocs.",
  sol:[["repeter",2,[["repeter",3,[["avancer"]]],["droite"],["repeter",3,[["avancer"]]],["gauche"]]]]},
 /* ---- niveaux ajoutés pour les séances (indices 14 et 15 : séance 2) ---- */
 {titre:"Trois boucles à la suite", dir:"E", max:8, blocs:MVR,
  map:["##########","##########","#####...D#","#####.####","#####.####","#R....####","##########","##########"],
  aide:"Le chemin a trois lignes droites : une boucle « répéter » pour chacune. Entre deux boucles, le robot doit tourner. Compte bien les cases de chaque ligne.",
  sol:[["repeter",4,[["avancer"]]],["gauche"],["repeter",3,[["avancer"]]],["droite"],["repeter",3,[["avancer"]]]]},
 {titre:"Le grand escalier", dir:"E", max:7, blocs:MVR,
  map:["#########","#######D#","#######.#","#####...#","#####.###","###...###","###.#####","#R..#####","#########"],
  aide:"Chaque marche est plus grande : 2 cases en avant, puis 2 cases vers le haut. Écris le motif d'une marche (6 blocs), puis mets-le dans un « répéter ». Combien y a-t-il de marches ?",
  sol:[["repeter",3,[["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"]]]]},
 /* ---- niveaux bonus « En autonomie » (indices 16 à 19) ---- */
 {titre:"La spirale", dir:"E", max:12, blocs:MVR,
  map:["#########","#R......#","#######.#","###...#.#","###.#.#.#","###.#D#.#","###.###.#","###.....#","#########"],
  aide:"Le robot fait 6 cases, tourne à droite, 6 cases, tourne à droite… puis 4 cases deux fois, puis 2 cases deux fois. Chaque paire « répéter … avancer, tourner à droite » peut se répéter 2 fois : une boucle dans une boucle !",
  sol:[["repeter",2,[["repeter",6,[["avancer"]]],["droite"]]],["repeter",2,[["repeter",4,[["avancer"]]],["droite"]]],["repeter",2,[["repeter",2,[["avancer"]]],["droite"]]]]},
 {titre:"Prévois : une boucle dans une boucle", type:"prevois", dir:"E", max:0, blocs:[],
  map:["#########","#.......#","#.......#","#...B..C#","#.......#","#.......#","#R..A...#","#########"],
  prog:[["repeter",2,[["repeter",3,[["avancer"]]],["gauche"]]]], rep:"B",
  aide:"La grande boucle est faite 2 fois. À chaque fois, le robot avance de 3 cases, puis tourne à gauche. Suis-le avec ton doigt : où est-il après le premier tour ? Et après le deuxième ?",
  sol:null},
 {titre:"Trouve les erreurs : le grand carré", type:"bug", dir:"E", max:4, blocs:MVR,
  map:["#######","#R....#","#####.#","#####.#","#####.#","#D....#","#######"],
  depart:[["repeter",3,[["repeter",3,[["avancer"]]],["gauche"]]]],
  aide:"Ce programme contient DEUX erreurs. Regarde d'abord dans quel sens le robot doit tourner au coin. Compte ensuite les cases de chaque côté : combien de fois faut-il avancer ?",
  sol:[["repeter",3,[["repeter",4,[["avancer"]]],["droite"]]]]},
 {titre:"La montagne", dir:"E", max:11, blocs:MVR,
  map:["##########","##########","####...###","###..#..##","##..###..#","#R.#####D#","##########"],
  aide:"Le robot monte un escalier, avance d'une case au sommet, puis descend l'autre escalier. Une boucle pour la montée, un bloc au sommet, une boucle pour la descente : dans la descente, le robot tourne d'abord à droite.",
  sol:[["repeter",3,[["avancer"],["gauche"],["avancer"],["droite"]]],["avancer"],["repeter",3,[["avancer"],["droite"],["avancer"],["gauche"]]]]}
];

/* ==================================================================
   NIVEAUX DE 5e — P porte à code (codes dans « doors », dans l'ordre de lecture de la carte)
   v0 : nombre de départ · types : jeu · bug · prevois (deviner le nombre final) · coffre (trouver le départ)
   formule : la porte s'ouvre avec code = fn(départ), testé pour plusieurs départs
   fixe : seules ces valeurs sont autorisées dans les blocs de calcul
================================================================== */
const CALC = ["ajouter","enlever","multiplier"];
const L5 = [
 {titre:"La porte à code", v0:5, dir:"E", max:5, blocs:["avancer","ajouter"],
  map:["########","########","########","#R.P.D##","########","########","########","########"], doors:[8],
  aide:"Le robot part avec le nombre 5. La porte ne s'ouvre que s'il affiche 8 quand il arrive devant. Change son nombre AVANT qu'il arrive à la porte !",
  sol:[["avancer"],["ajouter",3],["avancer"],["avancer"],["avancer"]]},
 {titre:"Multiplier", v0:4, dir:"E", max:5, blocs:["avancer","ajouter","multiplier"],
  map:["########","########","########","#R.P.D##","########","########","########","########"], doors:[12],
  aide:"Pour passer de 4 à 12, on peut ajouter… ou multiplier. Essaie avec « multiplier le nombre par ».",
  sol:[["multiplier",3],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Deux portes", v0:2, dir:"E", max:8, blocs:["avancer","ajouter","enlever","multiplier"],
  map:["########","########","########","#R.P.P.D","########","########","########","########"], doors:[7,14],
  aide:"Il y a deux portes : 7, puis 14. Le nombre du robot doit valoir 7 devant la première, puis 14 devant la seconde. Entre les deux, quel calcul transforme 7 en 14 ?",
  sol:[["avancer"],["ajouter",5],["avancer"],["avancer"],["multiplier",2],["avancer"],["avancer"],["avancer"]]},
 {titre:"L'ordre compte !", v0:3, dir:"E", max:7, fixe:{ajouter:2, multiplier:2}, blocs:["avancer","ajouter","multiplier"],
  map:["########","########","########","#R..P.D#","########","########","########","########"], doors:[10],
  aide:"Tu as les blocs « ajouter 2 » et « multiplier par 2 », sans changer les nombres. 3 + 2 puis × 2, ou bien 3 × 2 puis + 2 : est-ce le même résultat ?",
  sol:[["ajouter",2],["multiplier",2],["avancer"],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Prévois le nombre", type:"prevois", v0:6, dir:"E", max:0, blocs:[],
  map:["########","########","########","#R....D#","########","########","########","########"],
  prog:[["ajouter",4],["avancer"],["multiplier",3],["avancer"],["enlever",5],["avancer"],["avancer"],["avancer"]], rep:25,
  aide:"Ne lance rien : calcule toi-même, bloc par bloc. Le robot part avec 6. Note le nombre après chaque calcul.",
  sol:null},
 {titre:"Le coffre-fort", type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","########","########","#R...PD#","########","########","########","########"], doors:[20],
  prog:[["multiplier",2],["ajouter",4],["repeter",4,[["avancer"]]],["avancer"]], rep:8,
  aide:"Cette fois, le programme est fixé : c'est le nombre de départ que tu dois trouver ! À l'arrivée devant la porte, le robot doit afficher 20. Remonte le calcul à l'envers : avant « ajouter 4 », il affichait… ?",
  sol:null},
 {titre:"Répéter un calcul", v0:1, dir:"E", max:4, fixe:{multiplier:2}, blocs:["avancer","multiplier","repeter"],
  map:["########","########","########","#R.P.D##","########","########","########","########"], doors:[16],
  aide:"Le robot part avec 1 et la porte demande 16, avec le bloc « multiplier par 2 » seulement. Avec 4 blocs au maximum, il faut des « répéter ». 1 × 2 = 2, 2 × 2 = 4… combien de fois faut-il doubler ?",
  sol:[["repeter",4,[["multiplier",2]]],["repeter",4,[["avancer"]]]]},
 {titre:"Calculer en marchant", v0:5, dir:"E", max:5, blocs:["avancer","ajouter","enlever","multiplier","repeter"],
  map:["########","########","########","#RPPP.D#","########","########","########","########"], doors:[10,15,20],
  aide:"Trois portes à la suite : 10, 15, 20. À chaque fois, le nombre augmente de la même quantité. Le motif « calculer, puis avancer » se répète.",
  sol:[["repeter",3,[["ajouter",5],["avancer"]]],["avancer"],["avancer"]]},
 {titre:"Prévois avec une boucle", type:"prevois", v0:2, dir:"E", max:0, blocs:[],
  map:["########","########","########","#R....D#","########","########","########","########"],
  prog:[["repeter",3,[["multiplier",2],["enlever",1]]],["repeter",5,[["avancer"]]]], rep:9,
  aide:"Fais les tours de boucle un par un. Tour 1 : 2 × 2 = 4, puis 4 − 1 = 3. Tour 2 : on repart de 3…",
  sol:null},
 {titre:"Trouve l'erreur !", type:"bug", v0:4, dir:"E", max:7, blocs:["avancer","ajouter","enlever","multiplier"],
  map:["########","########","########","#R..P.D#","########","########","########","########"], doors:[30],
  depart:[["multiplier",3],["ajouter",6],["avancer"],["avancer"],["avancer"],["avancer"],["avancer"]],
  aide:"Le programme utilise les bons calculs, mais pas dans le bon ordre ! Le robot affiche 18 au lieu de 30. Que se passe-t-il si on fait d'abord « ajouter 6 » ?",
  sol:[["ajouter",6],["multiplier",3],["avancer"],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Le coffre-fort, avec une boucle", type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","########","########","#R..P.D#","########","########","########","########"], doors:[46],
  prog:[["repeter",2,[["multiplier",3]]],["ajouter",1],["repeter",5,[["avancer"]]]], rep:5,
  aide:"Remonte le programme à l'envers : 46, c'est un nombre auquel on a ajouté 1… Avant, il y avait deux multiplications par 3.",
  sol:null},
 {titre:"La formule magique", type:"formule", dir:"E", max:6, blocs:["avancer","ajouter","enlever","multiplier","repeter"],
  map:["########","########","########","#R..P.D#","########","########","########","########"], doors:["f"], fn:v=>2*v+3, formule:"le double du nombre de départ, plus 3", tests:[4,7,10],
  aide:"La porte change de code ! Elle s'ouvre si le robot affiche « le double du nombre de départ, plus 3 ». Ton programme sera essayé avec 3 nombres de départ différents : il doit marcher à chaque fois. Le double, c'est multiplier par 2.",
  sol:[["multiplier",2],["ajouter",3],["repeter",5,[["avancer"]]]]},
 {titre:"La formule magique 2", type:"formule", dir:"E", max:6, blocs:["avancer","ajouter","enlever","multiplier","repeter"],
  map:["########","########","########","#R..P.D#","########","########","########","########"], doors:["f"], fn:v=>3*(v+2), formule:"le triple de (nombre de départ + 2)", tests:[1,5,8],
  aide:"Les parenthèses indiquent ce qu'on calcule en premier. 3 × (départ + 2) : d'abord on ajoute 2, ensuite on multiplie par 3.",
  sol:[["ajouter",2],["multiplier",3],["repeter",5,[["avancer"]]]]},
 {titre:"Défi : l'escalier des portes", defi:true, voir:true, v0:3, dir:"E", max:7, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["########","########","#####PD#","####P.##","###P.###","##R.####","########","########"], doors:[24,12,6],
  aide:"Trois portes sur l'escalier : 6, puis 12, puis 24. Chaque marche se fait de la même façon, et le nombre est multiplié par la même chose à chaque marche. Où faut-il placer le calcul dans le motif ?",
  sol:[["repeter",3,[["avancer"],["multiplier",2],["gauche"],["avancer"],["droite"]]],["avancer"]]},
 {titre:"Défi : le coffre-fort final", defi:true, voir:true, type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","########","########","#R..P.D#","########","########","########","########"], doors:[47],
  prog:[["repeter",3,[["multiplier",2],["ajouter",1]]],["repeter",5,[["avancer"]]]], rep:5,
  aide:"Remonte à l'envers, tour de boucle par tour de boucle. Le dernier calcul est « ajouter 1 » : avant, le robot affichait 46. Et avant « multiplier par 2 » ?",
  sol:null},
 /* ---- niveaux ajoutés pour les séances (15 et 16 : séance 1 ; 17 : séance 2) ---- */
 {titre:"Trois portes", v0:1, dir:"E", max:11, blocs:["avancer","ajouter","enlever","multiplier"],
  map:["##########","#R.P.P.P.D","##########"], doors:[4,8,5],
  aide:"Les portes demandent 4, puis 8, puis 5. Avant chaque porte, change le nombre du robot : de 1 à 4, puis de 4 à 8, puis de 8 à 5. Il faudra enlever, cette fois !",
  sol:[["ajouter",3],["avancer"],["avancer"],["multiplier",2],["avancer"],["avancer"],["enlever",3],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Le coffre-fort 2", type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","#R...PD#","########"], doors:[28],
  prog:[["enlever",3],["multiplier",4],["repeter",4,[["avancer"]]],["avancer"]], rep:10,
  aide:"Remonte le programme à l'envers. Le dernier calcul est « multiplier par 4 » : avant, le robot affichait 28 ÷ 4 = 7. Et avant « enlever 3 », il affichait… ?",
  sol:null},
 {titre:"Prévois avec deux boucles", type:"prevois", v0:5, dir:"E", max:0, blocs:[],
  map:["########","#R....D#","########"],
  prog:[["repeter",2,[["ajouter",3]]],["repeter",3,[["multiplier",2]]],["repeter",5,[["avancer"]]]], rep:88,
  aide:"Première boucle : on ajoute 3, deux fois de suite. Deuxième boucle : on multiplie par 2, trois fois de suite. Note le nombre du robot après chaque calcul.",
  sol:null},
 /* ---- niveaux bonus « En autonomie » (18 à 22) ---- */
 {titre:"Le virage des nombres", v0:2, dir:"E", max:7, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["######","#R.P##","###.##","###P##","###.##","###D##","######"], doors:[6,18],
  aide:"La porte du haut demande 6, celle du bas demande 18. Quel calcul fait passer de 2 à 6, puis de 6 à 18 ? N'oublie pas de tourner au coin, et pense au bloc « répéter » pour la fin du chemin.",
  sol:[["multiplier",3],["avancer"],["avancer"],["droite"],["multiplier",3],["repeter",4,[["avancer"]]]]},
 {titre:"La formule cachée", type:"formule", dir:"E", max:6, fixe:{ajouter:2}, blocs:["avancer","ajouter","multiplier","repeter"],
  map:["########","#R..P.D#","########"], doors:["f"], fn:v=>5*v+10, formule:"5 fois le nombre de départ, plus 10", tests:[1,4,7],
  aide:"Ici, le bloc « ajouter » ajoute seulement 2. Astuce : 5 × départ + 10, c'est la même chose que 5 × (départ + 2). Vérifie avec 1 : 5 × 1 + 10 = 15, et 5 × (1 + 2) = 15.",
  sol:[["ajouter",2],["multiplier",5],["repeter",5,[["avancer"]]]]},
 {titre:"Le coffre-fort à étages", type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","#R..P.D#","########"], doors:[60],
  prog:[["repeter",3,[["ajouter",2],["multiplier",2]]],["repeter",5,[["avancer"]]]], rep:4,
  aide:"Remonte à l'envers, tour de boucle par tour de boucle. Dans chaque tour, le dernier calcul est « multiplier par 2 » : avant, le robot affichait 60 ÷ 2 = 30, et avant « ajouter 2 », il affichait 28…",
  sol:null},
 {titre:"Prévois le grand calcul", type:"prevois", v0:2, dir:"E", max:0, blocs:[],
  map:["########","#R....D#","########"],
  prog:[["repeter",2,[["multiplier",3],["ajouter",1],["multiplier",2]]],["repeter",5,[["avancer"]]]], rep:86,
  aide:"La boucle contient trois calculs : × 3, puis + 1, puis × 2. Elle est faite 2 fois. Tour 1 : 2 × 3 = 6, puis 6 + 1 = 7, puis 7 × 2 = 14. Tour 2 : on repart de 14…",
  sol:null},
 {titre:"Trouve l'erreur : la boucle", type:"bug", v0:3, dir:"E", max:4, fixe:{multiplier:2}, blocs:["avancer","multiplier","repeter"],
  map:["########","#R..P.D#","########"], doors:[48],
  depart:[["repeter",3,[["multiplier",2]]],["repeter",5,[["avancer"]]]],
  aide:"Le robot affiche 24 au lieu de 48. 3 × 2 = 6, 6 × 2 = 12… Combien de fois faut-il doubler 3 pour obtenir 48 ?",
  sol:[["repeter",4,[["multiplier",2]]],["repeter",5,[["avancer"]]]]}
];

/* on retire les rangées de haies inutiles en haut et en bas (une seule rangée de bordure suffit) */
[L6,L5].forEach(P=>P.forEach(L=>{ const full=r=>/^#+$/.test(r); let m=L.map.slice();
  while(m.length>3 && full(m[0]) && full(m[1])) m.shift(); while(m.length>3 && full(m[m.length-1]) && full(m[m.length-2])) m.pop(); L.map=m; }));

/* ------------------------------------------------------------------
   Simulation
------------------------------------------------------------------ */
function parse(L){ let R=null, G=null; const F={}, P=[]; L.map.forEach((row,y)=>[...row].forEach((c,x)=>{ if(c==="R") R=[x,y]; if(c==="D") G=[x,y]; if("ABC".includes(c)) F[c]=[x,y]; if(c==="P") P.push([x,y]); }));
  const doors={}; P.forEach((p,i)=>doors[p[0]+","+p[1]]=L.doors?L.doors[i]:null); return {R,G,F,doors}; }
function simulate(L, prog, v0){
  const {R,G,F,doors}=parse(L); const st={x:R[0], y:R[1], d:DIRS[L.dir], v:v0}; const acts=[]; let guard=0, end=null; const opened={};
  const free=(x,y)=>y>=0&&y<L.map.length&&x>=0&&x<L.map[0].length&&L.map[y][x]!=="#";
  const at=()=>G && st.x===G[0]&&st.y===G[1] && L.type!=="prevois6";
  const flagMode = !G;                                  /* niveaux « prévois » de 6e : pas d'arrivée, on va au bout */
  function run(list){
    for(const n of list){ if(end) return;
      if(++guard>3000){ end="boucle"; return; }
      const id=n.id;
      switch(n[0]){
        case "avancer": { const nx=st.x+D[st.d][0], ny=st.y+D[st.d][1]; if(!free(nx,ny)){ acts.push({t:"bump", id, x:st.x, y:st.y, d:st.d}); end="mur"; return; }
          const k=nx+","+ny;
          if(k in doors && !opened[k]){ const code = doors[k]==="f" ? L.fn(v0) : doors[k];
            if(st.v!==code){ acts.push({t:"locked", id, x:st.x, y:st.y, d:st.d, code, v:st.v}); end="porte"; return; }
            opened[k]=1; acts.push({t:"open", id, k}); }
          st.x=nx; st.y=ny; acts.push({t:"move", id, x:nx, y:ny, d:st.d}); if(!flagMode && at()){ end="ok"; return; } break; }
        case "gauche": st.d=(st.d+3)%4; acts.push({t:"turn", id, k:-1, x:st.x, y:st.y, d:st.d}); break;
        case "droite": st.d=(st.d+1)%4; acts.push({t:"turn", id, k:1, x:st.x, y:st.y, d:st.d}); break;
        case "ajouter": st.v+=n[1]; acts.push({t:"calc", id, v:st.v}); break;
        case "enlever": st.v-=n[1]; acts.push({t:"calc", id, v:st.v}); break;
        case "multiplier": st.v*=n[1]; acts.push({t:"calc", id, v:st.v}); break;
        case "repeter": for(let i=0;i<n[1] && !end;i++){ acts.push({t:"look", id}); run(n[2]); } break;
      }
      if(acts.length>800){ end="boucle"; return; }
    }
  }
  run(prog);
  let flag=null; if(flagMode){ for(const k in F) if(F[k][0]===st.x&&F[k][1]===st.y) flag=k; }
  return {acts, end: end || (flagMode ? "fin" : at()?"ok":"court"), flag, v:st.v};
}
function blocksIn(prog){ let n=0; const walk=l=>l.forEach(x=>{ n++; if(x[0]==="repeter") walk(x[2]); }); walk(prog||[]); return n; }

/* ------------------------------------------------------------------
   Blocs (Blockly)
------------------------------------------------------------------ */
let defined=false;
function defineBlocks(){
  if(defined) return; defined=true;
  const num=(name,val)=>({type:"field_number", name, value:val, precision:1});
  Blockly.defineBlocksWithJsonArray([
    {type:"l_start", message0:"quand le drapeau vert %1 est cliqué", args0:[{type:"field_label", text:"⚑"}], nextStatement:null, colour:C.event, hat:"cap", tooltip:"Le programme commence ici."},
    {type:"l_start5", message0:"quand le drapeau vert %1 est cliqué %2 le robot part avec %3", args0:[{type:"field_label", text:"⚑"},{type:"input_dummy"},{type:"field_label_serializable", name:"V", text:"?"}], nextStatement:null, colour:C.event, hat:"cap", tooltip:"Le nombre de départ du robot (l'entrée du programme)."},
    {type:"l_avancer", message0:"avancer d'une case", previousStatement:null, nextStatement:null, colour:C.move, tooltip:"Le robot avance d'une case."},
    {type:"l_gauche", message0:"tourner à gauche ↺", previousStatement:null, nextStatement:null, colour:C.move, tooltip:"Le robot fait un quart de tour vers sa gauche."},
    {type:"l_droite", message0:"tourner à droite ↻", previousStatement:null, nextStatement:null, colour:C.move, tooltip:"Le robot fait un quart de tour vers sa droite."},
    {type:"l_repeter", message0:"répéter %1 fois %2 %3", args0:[Object.assign(num("N",4),{min:1,max:20}),{type:"input_dummy"},{type:"input_statement", name:"DO"}], previousStatement:null, nextStatement:null, colour:C.ctrl, tooltip:"Refait plusieurs fois les blocs placés à l'intérieur."},
    {type:"l_ajouter", message0:"ajouter %1 au nombre", args0:[num("N",3)], previousStatement:null, nextStatement:null, colour:C.calc, tooltip:"Le nombre du robot augmente."},
    {type:"l_enlever", message0:"enlever %1 au nombre", args0:[num("N",1)], previousStatement:null, nextStatement:null, colour:C.calc, tooltip:"Le nombre du robot diminue."},
    {type:"l_multiplier", message0:"multiplier le nombre par %1", args0:[num("N",2)], previousStatement:null, nextStatement:null, colour:C.calc, tooltip:"Le nombre du robot est multiplié."}
  ]);
}
function tree(block){
  const out=[];
  for(let b=block; b; b=b.getNextBlock()){
    if(!b.isEnabled()) continue;
    const t=b.type.slice(2); let n;
    if(MV.includes(t)) n=[t];
    else if(t==="repeter") n=["repeter", +b.getFieldValue("N"), tree(b.getInputTargetBlock("DO"))];
    else if(CALC.includes(t)) n=[t, +b.getFieldValue("N")];
    else continue;
    n.id=b.id; out.push(n);
  }
  return out;
}
/* un programme écrit comme des blocs Scratch (affichage seul) */
const LBL = {avancer:["avancer d'une case","move"], gauche:["tourner à gauche ↺","move"], droite:["tourner à droite ↻","move"]};
function progHTML(prog, depart){
  const row=(t,k)=>`<div class="sb ${k}">${t}</div>`, nb=v=>`<span class="sbn">${v}</span>`;
  const walk=l=>l.map(n=>{
    if(LBL[n[0]]) return row(...LBL[n[0]]);
    if(n[0]==="ajouter") return row(`ajouter ${nb(n[1])} au nombre`,"calc");
    if(n[0]==="enlever") return row(`enlever ${nb(n[1])} au nombre`,"calc");
    if(n[0]==="multiplier") return row(`multiplier le nombre par ${nb(n[1])}`,"calc");
    if(n[0]==="repeter") return `<div class="sbg">${row(`répéter ${nb(n[1])} fois`,"ctrl")}<div class="sbin">${walk(n[2])}</div></div>`;
    return ""; }).join("");
  return `<div class="sbprog">${row(`quand le drapeau vert ⚑ est cliqué${depart!==undefined?`<br>le robot part avec ${nb(depart)}`:""}`,"event")}${walk(prog)}</div>`;
}

/* ------------------------------------------------------------------
   Dessin du labyrinthe (SVG)
------------------------------------------------------------------ */
const CELL=44;
function mazeSVG(L){
  const W=L.map[0].length, H=L.map.length; const {G,F,doors}=parse(L);
  let s=`<svg class="lmaze" viewBox="0 0 ${W*CELL} ${H*CELL}" role="img" aria-label="Labyrinthe du niveau">`;
  s+=`<rect width="${W*CELL}" height="${H*CELL}" fill="#7cb86a"/>`;
  L.map.forEach((row,y)=>[...row].forEach((c,x)=>{ const X=x*CELL, Y=y*CELL;
    if(c==="#"){ s+=`<rect x="${X+3}" y="${Y+3}" width="${CELL-6}" height="${CELL-6}" rx="9" fill="#4f9a45"/><circle cx="${X+14}" cy="${Y+15}" r="5" fill="#5fae53"/><circle cx="${X+29}" cy="${Y+27}" r="6" fill="#5fae53"/>`; }
    else s+=`<rect x="${X}" y="${Y}" width="${CELL}" height="${CELL}" fill="#f3e3b5"/><rect x="${X}" y="${Y}" width="${CELL}" height="${CELL}" fill="none" stroke="#e6d39d" stroke-width="1"/>`; }));
  const flag=(x,y,col,lab)=>{ const gx=x*CELL, gy=y*CELL; return `<g class="lflag"><line x1="${gx+15}" y1="${gy+8}" x2="${gx+15}" y2="${gy+38}" stroke="#5a4632" stroke-width="3" stroke-linecap="round"/><path d="M${gx+16} ${gy+9} L${gx+35} ${gy+15} L${gx+16} ${gy+22} Z" fill="${col}"/>${lab?`<text x="${gx+30}" y="${gy+38}" text-anchor="middle" style="font:800 15px Arial;fill:#1b2a44">${lab}</text>`:""}</g>`; };
  if(G) s+=flag(G[0],G[1],"#e8413c");
  const FC={A:"#e8413c",B:"#2c7be5",C:"#7a3fd0"}; for(const k in F) s+=flag(F[k][0],F[k][1],FC[k],k);
  for(const k in doors){ const [x,y]=k.split(",").map(Number), X=x*CELL, Y=y*CELL, code=doors[k];
    s+=`<g class="ldoor" data-k="${k}"><rect x="${X+5}" y="${Y+3}" width="${CELL-10}" height="${CELL-6}" rx="4" fill="#9a6a3a" stroke="#6b4423" stroke-width="2"/><circle cx="${X+CELL-12}" cy="${Y+CELL/2+2}" r="2.4" fill="#f5d36b"/>
      <rect x="${X+8}" y="${Y+9}" width="${CELL-16}" height="18" rx="3" fill="#fff8e1"/><text class="ldcode" x="${X+CELL/2}" y="${Y+23}" text-anchor="middle" style="font:800 13px Arial;fill:#5a3a1a">${code==="f"?"?":code}</text></g>`; }
  s+=`<g class="lbot" id="lbot"><g transform="translate(${-CELL/2} ${-CELL/2})">
     <rect x="9" y="11" width="24" height="22" rx="7" fill="#4C97FF" stroke="#2c5fb3" stroke-width="2"/>
     <rect x="31" y="17" width="6" height="10" rx="2" fill="#2c5fb3"/>
     <circle cx="25" cy="18" r="3.4" fill="#fff"/><circle cx="25" cy="26" r="3.4" fill="#fff"/><circle cx="26.2" cy="18" r="1.6" fill="#1b2a44"/><circle cx="26.2" cy="26" r="1.6" fill="#1b2a44"/>
     <line x1="14" y1="11" x2="12" y2="5" stroke="#2c5fb3" stroke-width="2"/><circle cx="12" cy="5" r="2.4" fill="#FFBF00"/></g></g>`;
  if(L.v0!==undefined || L.type==="coffre" || L.type==="formule") s+=`<g class="lval" id="lval"><rect x="-22" y="-40" width="44" height="22" rx="7" fill="#1b2a44"/><text id="lvalt" x="0" y="-24" text-anchor="middle" style="font:800 14px Arial;fill:#fff">?</text></g>`;
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Page du jeu
------------------------------------------------------------------ */
let P=null, LEVELS=null, WS=null, WS2=null, THEME=null, cur=0, timer=null, angle=0, RO=null;
/* séance : SUB = numéros (dans LEVELS) des niveaux de la séance, dans l'ordre ; OPT = options données par la page (niv, onChange, onFin, fin) */
let SUB=[], OPT={};
const numero = i => SUB.indexOf(i)+1;
const store = { get(k){ try{ return localStorage.getItem(P.key+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(P.key+k, v); }catch(e){} }, del(k){ try{ localStorage.removeItem(P.key+k); }catch(e){} } };
function done(){ try{ return JSON.parse(store.get("done")||"[]"); }catch(e){ return []; } }
const PACKS = {
  "6e": {key:"staal-laby6-", levels:L6, start:"l_start"},
  "5e": {key:"staal-nombres5-", levels:L5, start:"l_start5"}
};

function init(root, pack, opts){
  defineBlocks(); P=PACKS[pack]; LEVELS=P.levels; OPT=opts||{};
  SUB=(OPT.niv||LEVELS.map((_,i)=>i)).filter(i=>i>=0 && i<LEVELS.length);
  root.innerHTML = `<div class="laby">
    <div class="lhead"><div class="llevels" id="llevels"></div><p class="where" id="lleg"></p></div>
    <div class="lgrid">
      <div class="lleft"><h2 id="ltitre"></h2><p id="lconsigne" class="lconsigne"></p><div id="lmaze"></div>
        <div class="lbtns" id="lbtns"></div>
        <p class="lcount" id="lcount"></p><div class="lmsg" id="lmsg" hidden></div>
        <details class="lhelp"><summary>Besoin d'aide ?</summary><p id="laide"></p><div id="lsol"></div></details></div>
      <div class="lright"><div id="lws" class="lws"></div><div id="lstatic" class="lstatic" hidden></div></div>
    </div></div>`;
  const nd = SUB.filter(i=>LEVELS[i].defi).length;
  document.getElementById("lleg").innerHTML = !nd ? "" : OPT.niv ? `Les niveaux en orange sont des <b>défis</b> pour aller plus loin.` : `Les ${nd} derniers niveaux (en orange) sont des <b>défis</b> pour aller plus loin.`;
  WS = Blockly.inject(document.getElementById("lws"), {
    renderer:"zelos", media:"lib/blockly/media/", sounds:false, trashcan:true, scrollbars:true,
    zoom:{controls:true, wheel:false, startScale:(window.innerWidth<600?0.66:0.82), maxScale:1.4, minScale:0.5},
    move:{scrollbars:true, drag:true, wheel:true},
    theme: THEME = THEME || Blockly.Theme.defineTheme("staal", {base:Blockly.Themes.Classic, fontStyle:{family:"Arial, Helvetica, sans-serif", size:12, weight:"600"}, startHats:true,
      componentStyles:{workspaceBackgroundColour:"#f9f9fb", flyoutBackgroundColour:"#eef0f5", flyoutOpacity:1}}),
    toolbox:{kind:"flyoutToolbox", contents:[{kind:"block",type:"l_avancer"}]}
  });
  WS.addChangeListener(Blockly.Events.disableOrphans);
  WS.addChangeListener(e=>{ if(e.isUiEvent) return; count(); if(!timer && e.type!==Blockly.Events.FINISHED_LOADING) save(); });
  let start = +(store.get("niveau")||0); if(!SUB.includes(start)){ const d=done(); start=SUB.find(i=>!d.includes(i)); if(start===undefined) start=SUB[0]; }
  load(start);
  RO=new ResizeObserver(()=>{ if(WS) Blockly.svgResize(WS); }); RO.observe(document.getElementById("lws"));
}
function levelsBar(){
  const d=done();
  document.getElementById("llevels").innerHTML = SUB.map((i,j)=>{ const L=LEVELS[i]; return `<button class="lnum${i===cur?" on":""}${d.includes(i)?" ok":""}${L.defi?" defi":""}" data-i="${i}" aria-label="Niveau ${j+1}${L.defi?" (défi)":""}${d.includes(i)?" (réussi)":""}">${j+1}</button>`; }).join("");
  document.querySelectorAll("#llevels .lnum").forEach(b=>b.onclick=()=>{ stop(); load(+b.dataset.i); });
}
const TB = k => { const t={kind:"block", type:"l_"+k}; const L=LEVELS[cur];
  if(k==="repeter") t.fields={N:3};
  if(CALC.includes(k)){ const f=L.fixe&&L.fixe[k]; t.fields={N: f!==undefined?f:(k==="multiplier"?2:k==="ajouter"?3:1)}; }
  return t; };
const statique = L => ["prevois","coffre"].includes(L.type);
function consigne(L){
  if(L.type==="prevois") return L.v0!==undefined ? "Sans lancer le programme, prévois le nombre qu'affichera le robot en arrivant au drapeau." : "Sans lancer le programme, prévois sur quel drapeau (A, B ou C) le robot va s'arrêter.";
  if(L.type==="coffre") return "Le programme est déjà écrit. Trouve avec quel nombre le robot doit partir pour ouvrir la porte.";
  if(L.type==="bug") return "Ce programme ne marche pas. Corrige-le pour que le robot arrive au drapeau.";
  if(L.type==="formule") return `La porte s'ouvre si le robot affiche <b>${L.formule}</b>. Ton programme sera essayé avec les nombres de départ ${L.tests.join(", ")} : le « ? » du bloc de départ représente ce nombre.`;
  return L.v0!==undefined ? `Le robot part avec le nombre <b>${L.v0}</b>. Ouvre la porte et amène-le au drapeau.` : "Amène le robot jusqu'au drapeau.";
}
function load(i){
  cur=i; store.set("niveau", i); const L=LEVELS[i];
  document.getElementById("ltitre").textContent = `Niveau ${numero(i)}${OPT.niv?" sur "+SUB.length:""}${L.defi?" · Défi":""} · ${L.titre.replace(/^Défi : /,"")}`;
  if(OPT.onChange) OPT.onChange(i, done());
  document.getElementById("lconsigne").innerHTML = consigne(L);
  document.getElementById("lmaze").innerHTML = mazeSVG(L);
  document.getElementById("laide").textContent = L.aide;
  document.getElementById("lsol").innerHTML = (L.voir && L.sol) ? `<details class="lsolbox"><summary>Toujours bloqué ? Voir une solution possible</summary><p class="where">Essaie d'abord avec l'aide ! Voici <b>une</b> solution (il en existe parfois d'autres) :</p>${progHTML(L.sol, L.v0)}</details>`
     : (L.voir && statique(L)) ? `<details class="lsolbox"><summary>Toujours bloqué ? Voir la réponse</summary><p>Le robot doit partir avec <b>${L.rep}</b>. Vérifie en refaisant le calcul dans l'ordre du programme.</p></details>` : "";
  const h=document.querySelector(".laby details.lhelp"); if(h) h.open=false;
  levelsBar(); msg("");
  /* boutons */
  let btns="";
  if(L.type==="prevois" && L.v0===undefined) btns = `<span class="lask">Ma réponse :</span>${["A","B","C"].map(k=>`<button class="btn lchoice" data-k="${k}">Drapeau ${k}</button>`).join("")}`;
  else if(L.type==="prevois") btns = `<label class="lask" for="lin">Le robot affichera :</label><input id="lin" class="lin" inputmode="text" autocomplete="off"><button class="btn primary" id="lgo">Vérifier en lançant</button>`;
  else if(L.type==="coffre") btns = `<label class="lask" for="lin">Le robot part avec :</label><input id="lin" class="lin" inputmode="text" autocomplete="off"><button class="btn primary" id="lgo">⚑ Lancer</button>`;
  else btns = `<button class="btn primary" id="lrun">⚑ Lancer le programme</button><button class="btn" id="lreset">↺ Remettre le robot</button>${L.type==="bug"?`<button class="btn" id lrestart>Reprendre le programme du début</button>`:""}`;
  document.getElementById("lbtns").innerHTML = btns.replace("id lrestart",'id="lrestart"');
  const $=id=>document.getElementById(id);
  if($("lrun")) $("lrun").onclick = run;
  if($("lreset")) $("lreset").onclick = ()=>{ stop(); place(); msg(""); };
  if($("lrestart")) $("lrestart").onclick = ()=>{ stop(); store.del("prog-"+cur); load(cur); };
  document.querySelectorAll(".lchoice").forEach(b=>b.onclick=()=>check(b.dataset.k));
  if($("lgo")) $("lgo").onclick = ()=>check(($("lin").value||"").trim());
  if($("lin")) $("lin").onkeydown = e=>{ if(e.key==="Enter") $("lgo").click(); };
  /* zone de droite : blocs ou programme affiché */
  const st=$("lstatic"), ws=$("lws");
  if(statique(L)){ ws.hidden=true; st.hidden=false; $("lcount").innerHTML=""; blocsFixes(L); place(); return; }
  ws.hidden=false; st.hidden=true;
  if(WS2){ const w=WS2; WS2=null; w.dispose(); st.innerHTML=""; }
  if(Blockly.common && Blockly.common.setMainWorkspace) Blockly.common.setMainWorkspace(WS);
  WS.options.maxBlocks = L.max + 1;
  WS.updateToolbox({kind:"flyoutToolbox", contents:L.blocs.map(TB)});
  Blockly.Events.disable();
  WS.clear();
  let ok=false; const saved=store.get("prog-"+i);
  if(saved){ try{ Blockly.serialization.workspaces.load(JSON.parse(saved), WS); ok=WS.getBlocksByType(P.start).length===1; }catch(e){ WS.clear(); } }
  if(!ok){ WS.clear(); const s=WS.newBlock(P.start); s.initSvg(); s.render(); if(L.depart) build(s, L.depart); }
  const s0=WS.getBlocksByType(P.start)[0]; s0.setDeletable(false);
  if(P.start==="l_start5"){ s0.setFieldValue(L.type==="formule"?"?":String(L.v0), "V"); }
  Blockly.Events.enable();
  Blockly.svgResize(WS); showStart();
  WS.getAllBlocks(false).forEach(b=>{ if(b.type!==P.start) b.setEnabled(!!b.getRootBlock() && b.getRootBlock().type===P.start); });
  count(); place();
}
/* niveaux « prévois » et « coffre-fort » : le programme est affiché avec les MÊMES blocs que d'habitude, mais on ne peut pas le modifier */
function blocsFixes(L){
  const st=document.getElementById("lstatic");
  if(WS2){ const w=WS2; WS2=null; w.dispose(); }
  st.innerHTML=`<p class="lstatic-t">Le programme <span class="lstatic-s">(déjà écrit, on ne peut pas le modifier)</span> :</p><div id="lws2" class="lws2"></div>`;
  const sc=window.innerWidth<600?0.75:0.9;
  WS2=Blockly.inject(document.getElementById("lws2"), {readOnly:true, renderer:"zelos", media:"lib/blockly/media/", sounds:false, scrollbars:false,
    zoom:{controls:false, wheel:false, startScale:sc}, move:{scrollbars:false, drag:false, wheel:false}, theme:THEME});
  Blockly.Events.disable();
  const s=WS2.newBlock(P.start); s.initSvg();
  if(P.start==="l_start5") s.setFieldValue(L.type==="coffre"?"?":String(L.v0), "V");
  s.render(); build(s, L.prog, WS2);
  Blockly.Events.enable();
  const bb=WS2.getBlocksBoundingBox(), div=document.getElementById("lws2");
  div.style.height=Math.ceil((bb.bottom-bb.top)*sc+36)+"px"; div.style.width=Math.ceil((bb.right-bb.left)*sc+36)+"px";
  Blockly.svgResize(WS2);
  const vm=WS2.getMetricsManager().getViewMetrics(true), p=s.getRelativeToSurfaceXY();
  Blockly.Events.disable(); s.moveBy(vm.left+16/sc-p.x, vm.top+16/sc-p.y); Blockly.Events.enable();
}
/* construit un programme (arbre) sous un bloc */
function build(parent, list, ws){
  ws=ws||WS;
  const mk=n=>{ const b=ws.newBlock("l_"+n[0]); b.initSvg();
    if(n[0]==="repeter"){ b.setFieldValue(n[1],"N"); chain(b.getInput("DO").connection, n[2]); }
    else if(CALC.includes(n[0])) b.setFieldValue(n[1],"N");
    b.render(); return b; };
  const chain=(conn,l)=>{ let c=conn; l.forEach(n=>{ const b=mk(n); c.connect(b.previousConnection); c=b.nextConnection; }); };
  chain(parent.nextConnection, list);
}
function showStart(){
  const st=WS.getBlocksByType(P.start)[0]; if(!st) return;
  const vm=WS.getMetricsManager().getViewMetrics(true), p=st.getRelativeToSurfaceXY();
  Blockly.Events.disable(); st.moveBy(vm.left+20/WS.scale-p.x, vm.top+20/WS.scale-p.y); Blockly.Events.enable();
}
function save(){ if(!WS || statique(LEVELS[cur])) return; try{ store.set("prog-"+cur, JSON.stringify(Blockly.serialization.workspaces.save(WS))); }catch(e){} }
function nb(){ return WS.getAllBlocks(false).filter(b=>b.type!==P.start).length; }
function count(){ if(!WS) return; const L=LEVELS[cur]; if(statique(L)) return; const el=document.getElementById("lcount"); if(el) el.innerHTML = `Blocs utilisés : <b>${nb()}</b> sur ${L.max} au maximum`; }
function place(x, y, d, anim){
  const L=LEVELS[cur], {R}=parse(L); if(x===undefined){ x=R[0]; y=R[1]; d=DIRS[L.dir]; angle=d*90; setVal(L.type==="coffre"||L.type==="formule"?"?":L.v0); doorsReset(); }
  const bot=document.getElementById("lbot"); if(!bot) return;
  const tr = anim ? "transform .32s ease-in-out" : "none";
  bot.style.transition = tr; bot.style.transform = `translate(${x*CELL+CELL/2}px, ${y*CELL+CELL/2}px) rotate(${angle}deg)`;
  const val=document.getElementById("lval"); if(val){ val.style.transition=tr; val.style.transform=`translate(${x*CELL+CELL/2}px, ${y*CELL+CELL/2}px)`; }
}
function setVal(v){ const t=document.getElementById("lvalt"); if(t) t.textContent = (v===undefined?"":String(v).replace("-","−")); }
function doorsReset(){ document.querySelectorAll(".ldoor").forEach(g=>g.classList.remove("open","shut")); }
function msg(h, kind){ const el=document.getElementById("lmsg"); if(!el) return; el.hidden=!h; el.className="lmsg "+(kind||""); el.innerHTML=h; }
function stop(){ if(timer){ clearTimeout(timer); timer=null; } if(WS) WS.highlightBlock(null); setBusy(false); }
function setBusy(b){ document.querySelectorAll("#lbtns button, #lbtns input").forEach(x=>x.disabled=b); }

/* anime une liste d'actions, puis appelle fin() */
function animate(res, fin, fast){
  let k=0; setBusy(true);
  const step=()=>{
    if(k>=res.acts.length){ timer=null; if(WS) WS.highlightBlock(null); setBusy(false); fin(); return; }
    const a=res.acts[k++]; if(WS && a.id) WS.highlightBlock(a.id);
    if(a.t==="look"){ timer=setTimeout(step, fast?40:90); return; }
    if(a.t==="calc"){ setVal(a.v); const v=document.getElementById("lval"); if(v){ v.classList.remove("pop"); void v.getBBox(); v.classList.add("pop"); } timer=setTimeout(step, fast?250:520); return; }
    if(a.t==="open"){ const g=document.querySelector(`.ldoor[data-k="${a.k}"]`); if(g) g.classList.add("open"); timer=setTimeout(step, 260); return; }
    if(a.t==="turn") angle += a.k*90;
    if(a.t==="bump"||a.t==="locked"){ const bot=document.getElementById("lbot"); const dx=D[a.d][0]*10, dy=D[a.d][1]*10; bot.style.transition="transform .15s"; bot.style.transform=`translate(${a.x*CELL+CELL/2+dx}px, ${a.y*CELL+CELL/2+dy}px) rotate(${angle}deg)`;
      if(a.t==="locked"){ const kk=(a.x+D[a.d][0])+","+(a.y+D[a.d][1]); const g=document.querySelector(`.ldoor[data-k="${kk}"]`); if(g) g.classList.add("shut"); }
      timer=setTimeout(()=>{ place(a.x,a.y,a.d,true); timer=setTimeout(step,250); },160); return; }
    place(a.x, a.y, a.d, true); timer=setTimeout(step, fast?220:380);
  };
  step();
}
const fmtN = v => String(v).replace("-","−");
function win(extra){
  const d=done(), avant=SUB.every(i=>d.includes(i)); if(!d.includes(cur)){ d.push(cur); store.set("done", JSON.stringify(d)); } levelsBar();
  const nxt=SUB[SUB.indexOf(cur)+1];
  msg(`<b>Bravo, niveau réussi !</b>${extra||""}${nxt!==undefined?` <br><button class="btn primary" id="lnext">Niveau suivant →</button>`:OPT.onFin?` <br><button class="btn primary" id="lfin">${OPT.fin||"Terminer la séance"} →</button>`:" <br>Tu as terminé tous les niveaux : bravo !"}`, "ok");
  const nx=document.getElementById("lnext"); if(nx) nx.onclick=()=>load(nxt);
  const fb=document.getElementById("lfin"); if(fb) fb.onclick=()=>OPT.onFin(done());
  if(OPT.onChange) OPT.onChange(cur, d);
  if(!avant && SUB.every(i=>d.includes(i)) && OPT.onFin) OPT.onFin(d);
}
function failMsg(res){
  if(res.end==="mur") return "<b>Aïe !</b> Le robot s'est cogné contre une haie. Regarde où il s'est arrêté, puis corrige ton programme.";
  if(res.end==="porte"){ const a=res.acts[res.acts.length-1]; return `<b>La porte reste fermée !</b> Le robot affiche ${fmtN(a.v)}, mais le code de la porte est ${fmtN(a.code)}.`; }
  if(res.end==="boucle") return "<b>Le programme est beaucoup trop long !</b> Vérifie le nombre de répétitions.";
  return "<b>Presque !</b> Le programme est fini, mais le robot n'est pas sur le drapeau. Il manque des blocs ?";
}
function run(){
  stop(); place(); msg("");
  const L=LEVELS[cur], starts=WS.getBlocksByType(P.start); const prog = starts.length ? tree(starts[0].getNextBlock()) : [];
  if(!prog.length){ msg("Ton programme est vide : accroche des blocs sous « quand le drapeau vert est cliqué ».", "ko"); return; }
  if(L.fixe){ const bad=[]; const walk=l=>l.forEach(n=>{ if(n[0] in L.fixe && n[1]!==L.fixe[n[0]]) bad.push(n[0]); if(n[0]==="repeter") walk(n[2]); }); walk(prog);
    if(bad.length){ msg(`Dans ce niveau, tu dois utiliser exactement ${Object.entries(L.fixe).map(([k,v])=>`« ${k==="ajouter"?"ajouter "+v:k==="enlever"?"enlever "+v:"multiplier par "+v} »`).join(" et ")}, sans changer les nombres.`, "ko"); return; } }
  if(L.type==="formule"){ runTests(L, prog, 0, []); return; }
  const res=simulate(L, prog, L.v0);
  animate(res, ()=>{
    if(res.end==="ok"){ const n=nb(), opt=blocksIn(L.sol); win(` Tu as utilisé ${n} bloc${n>1?"s":""}.${L.type!=="bug" && n>opt?` <br>Défi : c'est possible avec seulement ${opt} bloc${opt>1?"s":""}. Essaie de faire plus court !`:""}`); }
    else msg(failMsg(res), "ko");
  });
}
function runTests(L, prog, i, lines){
  if(i>=L.tests.length){ win(`<br>${lines.join("<br>")}<br>Ton programme marche pour n'importe quel nombre de départ : c'est la formule !`); return; }
  const v0=L.tests[i]; place(); setVal(v0);
  document.querySelectorAll(".ldcode").forEach(t=>t.textContent=fmtN(L.fn(v0)));
  msg(`Essai ${i+1} sur ${L.tests.length} : le robot part avec ${v0}, la porte demande ${fmtN(L.fn(v0))}.`, "");
  const res=simulate(L, prog, v0);
  animate(res, ()=>{
    if(res.end==="ok"){ lines.push(`Essai ${i+1} : départ ${v0} → code ${fmtN(L.fn(v0))} ✓`); timer=setTimeout(()=>runTests(L, prog, i+1, lines), 500); }
    else { lines.push(`Essai ${i+1} : départ ${v0} → ✗`); msg(`${failMsg(res)}<br>${lines.join("<br>")}`, "ko"); }
  }, true);
}
/* niveaux « prévois » et « coffre-fort » */
function check(ans){
  stop(); place(); msg("");
  const L=LEVELS[cur];
  if(L.type==="prevois" && L.v0===undefined){
    const res=simulate(L, L.prog);
    animate(res, ()=>{ if(ans===res.flag) win(` Le robot s'est bien arrêté sur le drapeau ${res.flag}.`); else msg(`<b>Raté !</b> Tu avais choisi le drapeau ${ans}, mais le robot s'est arrêté sur le drapeau ${res.flag}. Relis le programme bloc par bloc en suivant le robot.`, "ko"); });
    return;
  }
  const v=Number(ans.replace(/[−–]/g,"-").replace(",","."));
  if(ans==="" || !isFinite(v)){ msg("Écris un nombre.", "ko"); return; }
  if(L.type==="prevois"){
    const res=simulate(L, L.prog, L.v0);
    animate(res, ()=>{ if(v===res.v) win(` Le robot affiche bien ${fmtN(res.v)}.`); else msg(`<b>Raté !</b> Tu avais prévu ${fmtN(v)}, mais le robot affiche ${fmtN(res.v)}. Refais le calcul bloc par bloc.`, "ko"); });
    return;
  }
  /* coffre */
  setVal(v); const res=simulate(L, L.prog, v);
  animate(res, ()=>{ if(res.end==="ok") win(` Avec ${fmtN(v)} au départ, la porte s'ouvre.`); else msg(failMsg(res)+" Essaie un autre nombre de départ.", "ko"); });
}
function levels(pack){ return PACKS[pack].levels.map(L=>({t:L.titre, defi:!!L.defi})); }
function destroy(){ OPT={}; stop(); if(WS2){ const w=WS2; WS2=null; w.dispose(); } if(RO){ RO.disconnect(); RO=null; } if(WS){ const w=WS; WS=null; w.dispose(); } }
return {init, destroy, levels, L6, L5, simulate, blocksIn, PACKS, parse};
})();
