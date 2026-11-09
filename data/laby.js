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
 {titre:"Une boucle dans une boucle", voir:true, dir:"E", max:4, blocs:MVR,
  map:["########","########","########","#D...###","####.###","####.###","#R...###","########"],
  aide:"Tu n'as droit qu'à 4 blocs. Chaque côté du U, c'est « avancer 3 fois » puis « tourner ». Et « avancer 3 fois », ça peut s'écrire avec un « répéter »… placé à l'intérieur d'un autre « répéter » !",
  sol:[["repeter",3,[["repeter",3,[["avancer"]]],["gauche"]]]]},
 {titre:"Le grand zigzag", voir:true, dir:"E", max:7, blocs:MVR,
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
 /* ---- niveaux bonus « En autonomie » (indices 16 à 19, puis 20 à 33 plus bas) ---- */
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
  sol:[["repeter",3,[["avancer"],["gauche"],["avancer"],["droite"]]],["avancer"],["repeter",3,[["avancer"],["droite"],["avancer"],["gauche"]]]]},
 /* ---- niveaux « En autonomie » ajoutés (indices 20 à 33 ; on ajoute toujours à la fin pour garder la progression enregistrée) ---- */
 {titre:"Le robot regarde en bas", dir:"S", max:5, blocs:MVR,
  map:["#########","##R######","##.######","##.######","##.....D#","#########"],
  aide:"Attention : au départ, le robot regarde vers le bas de l'écran. Pour aller ensuite vers la droite de l'écran, il doit tourner à SA gauche ! Mets-toi à sa place (tu peux tourner ta feuille).",
  sol:[["repeter",3,[["avancer"]]],["gauche"],["repeter",5,[["avancer"]]]]},
 {titre:"Demi-tour !", dir:"O", max:7, blocs:MVR,
  map:["#########","#######D#","#######.#","#######.#","##R.....#","#########"],
  aide:"Le robot regarde vers la gauche, mais le chemin part vers la droite. Pour faire demi-tour, il faut tourner deux fois du même côté. Ensuite, regarde bien dans quel sens il regarde avant le virage.",
  sol:[["droite"],["droite"],["repeter",5,[["avancer"]]],["gauche"],["repeter",3,[["avancer"]]]]},
 {titre:"Dedans ou dehors ?", type:"bug", dir:"E", max:5, blocs:MVR,
  map:["#########","#R......#","#######.#","#######D#","#########"],
  depart:[["repeter",6,[["avancer"],["droite"]]],["repeter",2,[["avancer"]]]],
  aide:"Un bloc est rangé au mauvais endroit : il est DANS la boucle, alors le robot le refait 6 fois ! Lance le programme et regarde quand le robot tourne. Sors ce bloc de la boucle et place-le juste après.",
  sol:[["repeter",6,[["avancer"]]],["droite"],["repeter",2,[["avancer"]]]]},
 {titre:"L'escalier à l'envers", dir:"O", max:6, blocs:MVR,
  map:["#########","#D#######","#...#####","###...###","#####..R#","#########"],
  aide:"Le robot regarde vers la gauche de l'écran et monte un escalier. Quand il regarde vers la gauche, monter, c'est tourner à SA droite ! Chaque marche : 2 cases en avant, puis une case vers le haut. Mets ce motif dans un « répéter ».",
  sol:[["repeter",3,[["avancer"],["avancer"],["droite"],["avancer"],["gauche"]]]]},
 {titre:"Prévois : départ vers le haut", type:"prevois", dir:"N", max:0, blocs:[],
  map:["#########","#.....A.#","#.......#","#.......#","#.......#","#....BC.#","#.R.....#","#########"],
  prog:[["repeter",3,[["avancer"]]],["droite"],["repeter",4,[["avancer"]]],["droite"],["repeter",2,[["avancer"]]]], rep:"C",
  aide:"Au départ, le robot regarde vers le HAUT de l'écran. Suis-le avec ton doigt, case par case. Après chaque virage, demande-toi : vers où regarde-t-il maintenant ?",
  sol:null},
 {titre:"Deux chemins", dir:"S", max:5, blocs:MVR,
  map:["##########","#R..######","#.#.######","#.#....###","#.####...#","#.######.#","#.......D#","##########"],
  aide:"Deux chemins mènent au drapeau. Celui qui a l'air le plus direct tourne tout le temps : il demande beaucoup de blocs ! Avec 5 blocs seulement, quel chemin peux-tu programmer ? Attention, au départ le robot regarde vers le bas.",
  sol:[["repeter",5,[["avancer"]]],["gauche"],["repeter",7,[["avancer"]]]]},
 {titre:"Prévois : aller-retour", type:"prevois", dir:"E", max:0, blocs:[],
  map:["########","#..A...#","#......#","#......#","#R.....#","#......#","#.C....#","#..B...#","########"],
  prog:[["repeter",4,[["avancer"]]],["droite"],["droite"],["repeter",2,[["avancer"]]],["droite"],["repeter",3,[["avancer"]]]], rep:"A",
  aide:"Deux « tourner à droite » de suite : le robot fait demi-tour ! Il revient alors sur ses pas. Ensuite, quand il regarde vers la gauche de l'écran, de quel côté est SA droite ?",
  sol:null},
 {titre:"Le vrai labyrinthe", dir:"E", max:11, blocs:MVR,
  map:["##########","#R...#####","#.##.#.#D#","#.#..#.#.#","#.##.#.#.#","####.....#","####.###.#","##...###.#","##########"],
  aide:"Attention aux culs-de-sac ! Trouve d'abord le bon chemin avec ton doigt. Il est fait de 4 lignes droites : compte les cases de chacune, puis écris une boucle « répéter » pour chaque ligne droite.",
  sol:[["repeter",3,[["avancer"]]],["droite"],["repeter",4,[["avancer"]]],["gauche"],["repeter",4,[["avancer"]]],["gauche"],["repeter",3,[["avancer"]]]]},
 {titre:"Trouve l'erreur : les nombres échangés", type:"bug", dir:"N", max:4, blocs:MVR,
  map:["########","#.....D#","#.######","#.######","#.######","#.######","#R######","########"],
  depart:[["repeter",5,[["repeter",2,[["avancer"]]],["droite"]]]],
  aide:"Les bons blocs sont là, mais les deux nombres des boucles ont été échangés ! La petite boucle (à l'intérieur) fait avancer le robot le long d'un côté : combien de cases ? La grande boucle refait tout le côté : combien de fois ?",
  sol:[["repeter",2,[["repeter",5,[["avancer"]]],["droite"]]]]},
 {titre:"Le tour du rectangle", dir:"E", max:7, blocs:MVR,
  map:["#########","#R......#","#######.#","#D#####.#","#.......#","#########"],
  aide:"Le robot fait le tour d'un grand rectangle de haies : un grand côté (6 cases), un petit côté (3 cases), puis encore un grand et un petit. Écris le motif « grand côté, virage, petit côté, virage » avec deux boucles, puis répète-le. Le robot s'arrête dès qu'il touche le drapeau.",
  sol:[["repeter",2,[["repeter",6,[["avancer"]]],["droite"],["repeter",3,[["avancer"]]],["droite"]]]]},
 {titre:"L'escalier à paliers", dir:"E", max:8, blocs:MVR,
  map:["###########","#######..D#","######..###","###....####","##..#######","#R.########","###########"],
  aide:"Deux marches, puis un palier plat de 2 cases… et ça recommence. Une marche, c'est « avancer, tourner à gauche, avancer, tourner à droite ». Mets les 2 marches dans une boucle, ajoute le palier après cette boucle, puis répète le tout.",
  sol:[["repeter",2,[["repeter",2,[["avancer"],["gauche"],["avancer"],["droite"]]],["repeter",2,[["avancer"]]]]]]},
 {titre:"Prévois : l'escalier mystère", type:"prevois", dir:"E", max:0, blocs:[],
  map:["#########","#R.....A#","#.......#","#.......#","#...B...#","#.......#","#.......#","#......C#","#########"],
  prog:[["repeter",2,[["repeter",3,[["avancer"],["droite"],["avancer"],["gauche"]]],["gauche"]]]], rep:"A",
  aide:"La petite boucle fait descendre un escalier de 3 marches. Puis le robot tourne à gauche : il ne regarde plus dans le même sens ! Au deuxième tour, refais l'escalier en partant de sa nouvelle direction.",
  sol:null},
 {titre:"Défi : le serpent", defi:true, voir:true, dir:"N", max:13, blocs:MVR,
  map:["##########","#...#...##","#.#.#.#.##","#.#.#.#.##","#.#.#.#.##","#R#...#D##","##########"],
  aide:"Le robot fait des allers-retours comme un serpent : 4 cases vers le haut, 2 vers la droite, 4 vers le bas, 2 vers la droite… En haut, il tourne à droite ; en bas, il tourne à gauche. Écris une montée ET une descente (avec des boucles pour les lignes droites), puis répète le tout.",
  sol:[["repeter",2,[["repeter",4,[["avancer"]]],["droite"],["repeter",2,[["avancer"]]],["droite"],["repeter",4,[["avancer"]]],["gauche"],["repeter",2,[["avancer"]]],["gauche"]]]]},
 {titre:"Défi : le tour de la croix", defi:true, voir:true, dir:"N", max:8, blocs:MVR,
  map:["#########","###...###","###.#.###","#D#R#...#","#.#####.#","#...#...#","###.#.###","###...###","#########"],
  aide:"Le robot fait le tour d'une croix de haies : 4 branches, toutes pareilles. Une branche : « 2 cases, tourner à droite » deux fois de suite, puis 2 cases et tourner à gauche. « 2 cases, tourner à droite » deux fois, c'est déjà une boucle dans une boucle… et il faut refaire la branche 4 fois. Trois boucles, les unes dans les autres !",
  sol:[["repeter",4,[["gauche"],["repeter",3,[["droite"],["avancer"],["avancer"]]],["gauche"]]]]},
 /* ---- niveaux ajoutés en novembre 2026 pour allonger les séances (34 à 39 : séance 1 ; 40 à 43 : séance 2) ---- */
 {titre:"Deux virages", dir:"E", max:8, blocs:MV,
  map:["#######","###..D#","###.###","#R..###","#######"],
  aide:"Le robot tourne deux fois : d'abord pour monter, ensuite pour repartir vers la droite. Avant chaque virage, regarde dans quel sens il regarde.",
  sol:[["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"]]},
 {titre:"Le demi-tour", dir:"E", max:10, blocs:MV,
  map:["#######","#R...##","####.##","#D...##","#######"],
  aide:"Le robot va vers la droite, descend, puis revient vers la gauche. Il tourne deux fois du même côté : à droite, puis encore à droite.",
  sol:[["avancer"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Il manque un bloc !", type:"bug", dir:"E", max:7, blocs:MV,
  map:["#######","#####D#","#####.#","#R....#","#######"],
  depart:[["avancer"],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"]],
  aide:"Lance le programme : le robot tourne trop tôt et se cogne. Compte les cases de la ligne droite : il manque UN bloc.",
  sol:[["avancer"],["avancer"],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"]]},
 {titre:"Prévois sans boucle", type:"prevois", dir:"E", max:0, blocs:[],
  map:["########","#R...C.#","#......#","#...B..#","#..A...#","#......#","########"],
  prog:[["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["gauche"],["avancer"]], rep:"B",
  aide:"Ne lance rien : suis le robot avec ton doigt, bloc par bloc. Après « tourner à droite », il regarde vers le bas ; après « tourner à gauche », de nouveau vers la droite.",
  sol:null},
 {titre:"Répéter, puis tourner", dir:"E", max:4, blocs:MVR,
  map:["########","######D#","#R.....#","########"],
  aide:"Tu n'as droit qu'à 4 blocs. Une boucle « répéter » pour la ligne droite, puis le virage, puis une dernière case.",
  sol:[["repeter",5,[["avancer"]]],["gauche"],["avancer"]]},
 {titre:"Les créneaux", dir:"E", max:11, blocs:MVR,
  map:["###########","###########","#...#...###","#R#...#..D#","###########"],
  aide:"Le chemin dessine deux créneaux pareils : monter d'une case, avancer de 2 cases, descendre d'une case, avancer de 2 cases. Écris ce motif une seule fois (il y a 4 virages !), puis mets-le dans un « répéter ».",
  sol:[["repeter",2,[["gauche"],["avancer"],["droite"],["avancer"],["avancer"],["droite"],["avancer"],["gauche"],["avancer"],["avancer"]]]]},
 {titre:"Avant la boucle", dir:"E", max:9, blocs:MVR,
  map:["#########","#########","#########","######D##","#####..##","####..###","###..####","#R..#####","#########"],
  aide:"D'abord 2 cases vers la droite et un virage pour monter : ces blocs se placent AVANT la boucle. Ensuite vient l'escalier : son motif va dans un « répéter ». Une dernière case APRÈS la boucle.",
  sol:[["avancer"],["avancer"],["gauche"],["repeter",3,[["avancer"],["droite"],["avancer"],["gauche"]]],["avancer"]]},
 {titre:"Trouve l'erreur : compte les cases", type:"bug", dir:"E", max:5, blocs:MVR,
  map:["#########","#######D#","#######.#","#######.#","#R......#","#########"],
  depart:[["repeter",5,[["avancer"]]],["gauche"],["repeter",3,[["avancer"]]]],
  aide:"Les blocs sont les bons, mais UN nombre est faux. Lance le programme et regarde où le robot tourne. Compte les cases de la grande ligne droite.",
  sol:[["repeter",6,[["avancer"]]],["gauche"],["repeter",3,[["avancer"]]]]},
 {titre:"Prévois : deux boucles", type:"prevois", dir:"E", max:0, blocs:[],
  map:["########","#R....C#","#......#","#....B.#","#...A..#","########"],
  prog:[["repeter",3,[["avancer"]]],["droite"],["repeter",2,[["avancer"]]],["gauche"],["avancer"]], rep:"B",
  aide:"Fais la première boucle : 3 cases vers la droite. Le robot tourne à droite (il regarde vers le bas), fait 2 cases, tourne à gauche… et avance encore d'une case.",
  sol:null},
 {titre:"La boucle au milieu", dir:"E", max:11, blocs:MVR,
  map:["##########","#R..######","###..#####","####..####","#####...D#","##########"],
  aide:"Trois parties : 2 cases tout droit puis un virage vers le bas (AVANT la boucle) ; un escalier qui descend (DANS la boucle) ; puis un virage et 2 cases jusqu'au drapeau (APRÈS la boucle).",
  sol:[["avancer"],["avancer"],["droite"],["repeter",3,[["avancer"],["gauche"],["avancer"],["droite"]]],["gauche"],["avancer"],["avancer"]]},
 /* ---- niveaux SECRETS de la 6e (44 à 48) : la zone cachée, ouverte quand toute la séance 1 est réussie ; tous dans le noir ----
    noir : seules les cases autour du robot sont éclairées (true : elles restent éclairées ; "oubli" : le noir revient derrière lui) · miroir : « gauche » et « droite » sont inversés */
 {titre:"Dans le noir", secret:true, noir:true, dir:"E", max:8, blocs:MVR,
  map:["###########","#########D#","#######...#","###.#...#.#","###...#####","#R...######","###########"],
  consigne:"Le labyrinthe est plongé dans le <b>noir</b> : tu ne vois que les cases autour du robot. Le chemin est long et tu n'as droit qu'à <b>8 blocs</b>. Lance ton programme pour explorer : les cases découvertes restent éclairées. Attention aux culs-de-sac !",
  aide:"Explore avec quelques blocs, regarde ce qui s'éclaire, puis continue. Note le chemin sur une feuille. Tu verras qu'un même morceau de chemin revient plusieurs fois : mets-le dans un « répéter ».",
  sol:[["repeter",4,[["avancer"],["avancer"],["gauche"],["avancer"],["droite"]]]]},
 {titre:"Le miroir dans le noir", secret:true, noir:true, miroir:true, dir:"E", max:8, blocs:MVR,
  map:["##########","#R...#####","###.######","##....####","#####.####","#####....#","#######.##","#######D##","##########"],
  consigne:"Toujours dans le <b>noir</b>… et ce labyrinthe est un <b>miroir</b> : quand le programme dit « tourner à gauche », le robot tourne à droite, et inversement ! Tu as droit à <b>8 blocs</b>.",
  aide:"Avant chaque virage, demande-toi d'abord de quel côté le robot doit VRAIMENT tourner, puis prends le bloc contraire. Le chemin descend comme un escalier : cherche le motif qui se répète.",
  sol:[["repeter",3,[["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"]]]]},
 {titre:"Le serpent", secret:true, noir:true, dir:"E", max:14, blocs:MVR,
  map:["########","#R.....#","#####.##","#......#","#.######","#......#","#####.##","#D.....#","########"],
  consigne:"Dans le <b>noir</b>, le chemin serpente de gauche à droite, avec des <b>culs-de-sac</b> au bout des couloirs. Tu as droit à <b>14 blocs</b> : il faudra peut-être mettre une boucle… dans une boucle !",
  aide:"Note la longueur de chaque couloir. Un aller-retour (vers la droite, puis vers la gauche) se répète deux fois. Dans cet aller-retour, chaque couloir peut lui-même se faire avec un « répéter ».",
  sol:[["repeter",2,[["repeter",4,[["avancer"]]],["droite"],["avancer"],["avancer"],["droite"],["repeter",4,[["avancer"]]],["gauche"],["avancer"],["avancer"],["gauche"]]]]},
 {titre:"Le robot à l'envers", secret:true, noir:true, dir:"O", max:5, blocs:MVR,
  map:["###########","#######..R#","#######..##","######..###","#####..####","###...#####","####D######","###########"],
  consigne:"Dans le <b>noir</b>, le robot regarde vers la <b>gauche de l'écran</b> : sa gauche à lui n'est donc pas ta gauche ! Tu n'as droit qu'à <b>5 blocs</b>.",
  aide:"Mets-toi à la place du robot : s'il regarde vers la gauche de l'écran, « tourner à gauche » le fait regarder vers le bas. Le chemin est un escalier qui descend : écris une marche, puis répète-la.",
  sol:[["repeter",5,[["avancer"],["gauche"],["avancer"],["droite"]]]]},
 {titre:"La nuit sans lune", secret:true, noir:"oubli", dir:"E", max:14, blocs:MVR,
  map:["###############","#######.#######","##...#...#...##","##.#.#.#.#.#.##","#R.#...#...#.D#","#####.###.#####","###############"],
  consigne:"La porte finale : une <b>nuit sans lune</b>. Le robot ne voit que les cases autour de lui, et <b>le noir revient derrière lui</b> : rien ne reste éclairé ! Tu as droit à <b>14 blocs</b>. Note le chemin sur une feuille.",
  aide:"Fais un plan sur une feuille quadrillée : à chaque essai, dessine les cases que tu as vues. Le chemin fait trois créneaux pareils : monter, aller à droite, redescendre. Écris un créneau une seule fois, puis mets-le dans un « répéter ».",
  sol:[["repeter",3,[["avancer"],["gauche"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["gauche"],["avancer"]]]]},
 /* ---- niveaux SECRETS 2 de la 6e (49 à 53) : la deuxième zone cachée, ouverte quand toute la séance 2 est réussie ; tous dans le noir ---- */
 {titre:"Trois boucles dans le noir", secret:true, noir:true, dir:"E", max:8, blocs:MVR,
  map:["############","######....D#","######.#####","###.##.#####","#R......####","############"],
  consigne:"Dans le <b>noir</b>, le chemin est fait de trois longues lignes droites, avec des culs-de-sac pour te piéger. Tu n'as droit qu'à <b>8 blocs</b>.",
  aide:"Explore et compte les cases de chaque ligne droite. Chaque ligne droite peut se faire avec un « répéter » : trois boucles à la suite, avec un virage entre deux boucles.",
  sol:[["repeter",5,[["avancer"]]],["gauche"],["repeter",3,[["avancer"]]],["droite"],["repeter",4,[["avancer"]]]]},
 {titre:"Le miroir et l'escalier", secret:true, noir:true, miroir:true, dir:"E", max:9, blocs:MVR,
  map:["##########","#####...D#","####..####","###..#####","#R...#####","##########"],
  consigne:"Dans le <b>noir</b> et dans un <b>miroir</b> : « tourner à gauche » fait tourner le robot à droite, et inversement ! Il y a des blocs avant la boucle, dans la boucle et après. Tu as droit à <b>9 blocs</b>.",
  aide:"Trois parties : une ligne droite (AVANT la boucle), un escalier qui monte (DANS la boucle), une ligne droite (APRÈS). Pour chaque virage, cherche d'abord le vrai sens, puis prends le bloc contraire.",
  sol:[["avancer"],["avancer"],["repeter",3,[["droite"],["avancer"],["gauche"],["avancer"]]],["avancer"],["avancer"]]},
 {titre:"Les grandes marches", secret:true, noir:true, dir:"E", max:7, blocs:MVR,
  map:["##########","#######D##","#######.##","#######.##","####.....#","####.#####","####.#####","#R....####","##########"],
  consigne:"Dans le <b>noir</b>, un escalier géant : chaque marche fait plusieurs cases. Tu n'as droit qu'à <b>7 blocs</b>… il faudra une boucle dans une boucle !",
  aide:"Compte les cases d'une marche : vers la droite, puis vers le haut. Chaque morceau de marche se fait avec un « répéter ». Ensuite, mets toute la marche dans un grand « répéter ».",
  sol:[["repeter",2,[["repeter",3,[["avancer"]]],["gauche"],["repeter",3,[["avancer"]]],["droite"]]]]},
 {titre:"Le robot qui regarde en bas", secret:true, noir:true, dir:"S", max:9, blocs:MVR,
  map:["########","#R######","#..#####","#.######","#.######","#..#####","##..####","###..###","####.D##","########"],
  consigne:"Dans le <b>noir</b>, le robot regarde vers le <b>bas de l'écran</b> : sa gauche à lui, c'est ta droite ! Une ligne droite, puis un escalier. Tu as droit à <b>9 blocs</b>.",
  aide:"Mets-toi à la place du robot : s'il regarde vers le bas, « tourner à gauche » le fait regarder vers la droite de l'écran. La ligne droite se fait avec une boucle, l'escalier avec une autre.",
  sol:[["repeter",4,[["avancer"]]],["gauche"],["repeter",3,[["avancer"],["droite"],["avancer"],["gauche"]]],["avancer"]]},
 {titre:"Le serpent de la nuit", secret:true, noir:"oubli", dir:"E", max:14, blocs:MVR,
  map:["#######","#R....#","####.##","#.....#","#.#####","#.....#","####.##","#D...##","#######"],
  consigne:"La porte finale : une <b>nuit sans lune</b>. Le robot ne voit que les cases autour de lui, et <b>le noir revient derrière lui</b> ! Le chemin serpente, avec des culs-de-sac au bout des couloirs. Tu as droit à <b>14 blocs</b>.",
  aide:"Dessine le plan sur une feuille à chaque essai. Un aller-retour (droite, descente, gauche, descente) se répète deux fois. Chaque couloir peut lui-même se faire avec un « répéter ».",
  sol:[["repeter",2,[["repeter",3,[["avancer"]]],["droite"],["repeter",2,[["avancer"]]],["droite"],["repeter",3,[["avancer"]]],["gauche"],["repeter",2,[["avancer"]]],["gauche"]]]]}
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
 /* ---- niveaux bonus « En autonomie » (18 à 22, puis 23 à 35 plus bas) ---- */
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
  sol:[["repeter",4,[["multiplier",2]]],["repeter",5,[["avancer"]]]]},
 /* ---- niveaux « En autonomie » ajoutés (indices 23 à 35 ; toujours à la fin pour garder la progression enregistrée) ---- */
 {titre:"Trop tard !", type:"bug", v0:10, dir:"E", max:8, blocs:["avancer","ajouter","enlever","multiplier"],
  map:["#########","#R.P.P.D#","#########"], doors:[6,18],
  depart:[["avancer"],["avancer"],["enlever",4],["avancer"],["avancer"],["multiplier",3],["avancer"],["avancer"]],
  aide:"Les bons calculs sont là, mais le robot les fait trop tard : quand il arrive devant une porte, son nombre n'a pas encore changé ! Un calcul doit être fait AVANT d'arriver devant la porte. Déplace les deux blocs de calcul.",
  sol:[["avancer"],["enlever",4],["avancer"],["avancer"],["multiplier",3],["avancer"],["avancer"],["avancer"]]},
 {titre:"Le chemin des calculs", v0:1, dir:"E", max:8, fixe:{ajouter:3, multiplier:2}, blocs:["avancer","ajouter","multiplier"],
  map:["#######","#R.P.D#","#######"], doors:[22],
  aide:"Tu as seulement « ajouter 3 » et « multiplier par 2 », et le robot doit passer de 1 à 22 avec 4 calculs. Astuce : pars de la fin ! 22, c'est 11 × 2… Et 11, c'est 8 + 3…",
  sol:[["ajouter",3],["multiplier",2],["ajouter",3],["multiplier",2],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Sous zéro !", v0:5, dir:"E", max:5, blocs:["avancer","ajouter","enlever","multiplier","repeter"],
  map:["#########","#RP..P.D#","#########"], doors:[-2,3],
  aide:"La première porte demande −2 : un nombre plus petit que zéro ! Pour passer de 5 à −2, il faut enlever… Compte sur une droite graduée. Ensuite, pour passer de −2 à 3, il faut ajouter…",
  sol:[["enlever",7],["avancer"],["ajouter",5],["repeter",5,[["avancer"]]]]},
 {titre:"Trouve les erreurs : le virage", type:"bug", v0:6, dir:"E", max:6, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["######","#R...#","####.#","####P#","####.#","####D#","######"], doors:[24],
  depart:[["repeter",3,[["avancer"]]],["gauche"],["ajouter",4],["repeter",4,[["avancer"]]]],
  aide:"Ce programme contient DEUX erreurs : une dans le chemin, une dans le calcul. Lance-le et regarde où le robot se trompe. Ensuite : le robot part avec 6 et la porte demande 24. Or 6 + 4 = 10. Quel calcul avec le nombre 4 transforme 6 en 24 ?",
  sol:[["repeter",3,[["avancer"]]],["droite"],["multiplier",4],["repeter",4,[["avancer"]]]]},
 {titre:"Prévois en chemin", type:"prevois", v0:2, dir:"E", max:0, blocs:[],
  map:["######","#R.###","##..##","###.D#","######"],
  prog:[["repeter",2,[["avancer"],["multiplier",3],["droite"],["avancer"],["enlever",2],["gauche"]]],["avancer"]], rep:10,
  aide:"Les blocs bleus font bouger le robot mais ne changent pas son nombre : ne regarde que les blocs de calcul (orange). Tour 1 : 2 × 3 = 6, puis 6 − 2 = 4. Tour 2 : on repart de 4…",
  sol:null},
 {titre:"Le coffre-fort à virgule", type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","#R...PD#","########"], doors:[9],
  prog:[["multiplier",4],["enlever",1],["repeter",5,[["avancer"]]]], rep:2.5,
  aide:"Remonte le programme à l'envers. Avant « enlever 1 », le robot affichait 9 + 1 = 10. Quel nombre multiplié par 4 donne 10 ? Ce n'est pas un nombre entier : c'est 10 ÷ 4. Écris-le avec une virgule.",
  sol:null},
 {titre:"Pair ou impair ?", v0:1, dir:"E", max:11, fixe:{ajouter:2, multiplier:3}, blocs:["avancer","gauche","droite","ajouter","multiplier","repeter"],
  map:["#######","#.P..##","#R##.D#","#.P..##","#######"], doors:[10,15],
  aide:"Deux chemins, deux portes : 10 en haut, 15 en bas. Avec « ajouter 2 » et « multiplier par 3 », en partant de 1, peux-tu obtenir 10 ? Essaie : 1, 3, 5, 7… 1 × 3 = 3… Un nombre impair plus 2, ou fois 3, reste-t-il impair ? Choisis bien ton chemin !",
  sol:[["repeter",7,[["ajouter",2]]],["droite"],["avancer"],["gauche"],["repeter",3,[["avancer"]]],["gauche"],["avancer"],["droite"],["avancer"]]},
 {titre:"Toujours le même code", type:"formule", dir:"E", max:4, blocs:["avancer","ajouter","enlever","multiplier","repeter"],
  map:["########","#R..P.D#","########"], doors:["f"], fn:v=>5, formule:"5, quel que soit le nombre de départ", tests:[2,7,13],
  aide:"Le robot part avec 2, puis 7, puis 13, et il doit toujours afficher 5. Il faudrait d'abord transformer n'importe quel nombre en 0… Quelle multiplication donne toujours 0 ?",
  sol:[["multiplier",0],["ajouter",5],["repeter",5,[["avancer"]]]]},
 {titre:"Le compte à rebours", v0:50, dir:"E", max:4, fixe:{enlever:6}, blocs:["avancer","enlever","repeter"],
  map:["#######","#RP..D#","#######"], doors:[2],
  aide:"Le robot part avec 50 et la porte demande 2. Tu as seulement le bloc « enlever 6 ». Combien de fois faut-il enlever 6 ? De 50 à 2, il faut descendre de 48…",
  sol:[["repeter",8,[["enlever",6]]],["repeter",4,[["avancer"]]]]},
 {titre:"Prévois : une boucle dans une boucle", type:"prevois", v0:1, dir:"E", max:0, blocs:[],
  map:["########","#R....D#","########"],
  prog:[["repeter",2,[["repeter",3,[["ajouter",2]]],["multiplier",2]]],["repeter",5,[["avancer"]]]], rep:40,
  aide:"La grande boucle est faite 2 fois. À chaque tour : on ajoute 2, trois fois de suite, puis on multiplie par 2. Tour 1 : 1 + 2 + 2 + 2 = 7, puis 7 × 2 = 14. Tour 2 : on repart de 14…",
  sol:null},
 {titre:"Huit fois plus, et 3", type:"formule", dir:"E", max:5, fixe:{multiplier:2}, blocs:["avancer","ajouter","multiplier","repeter"],
  map:["########","#R..P.D#","########"], doors:["f"], fn:v=>8*v+3, formule:"8 fois le nombre de départ, plus 3", tests:[1,4,10],
  aide:"Ici, tu n'as que « multiplier par 2 ». Multiplier par 2, puis encore par 2, puis encore par 2 : c'est multiplier par combien ? Utilise un « répéter ». N'oublie pas d'ajouter 3 ensuite.",
  sol:[["repeter",3,[["multiplier",2]]],["ajouter",3],["repeter",5,[["avancer"]]]]},
 {titre:"Le tour des portes", v0:2, dir:"E", max:5, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["#######","#RP...#","#####P#","#####.#","#####.#","#D..P.#","#######"], doors:[6,18,54],
  aide:"Le robot fait 3 côtés d'un carré. Sur chaque côté, une porte juste après le coin : 6, puis 18, puis 54. Chaque fois, le code est multiplié par 3. Un côté : « calculer, avancer 4 fois, tourner ». Mets ce motif dans une boucle… avec une boucle à l'intérieur !",
  sol:[["repeter",3,[["multiplier",3],["repeter",4,[["avancer"]]],["droite"]]]]},
 {titre:"Défi : la formule à réduire", defi:true, voir:true, type:"formule", dir:"E", max:4, blocs:["avancer","ajouter","enlever","multiplier","repeter"],
  map:["########","#R..P.D#","########"], doors:["f"], fn:v=>3*(v+4)+3*v, formule:"3 × (nombre de départ + 4) + 3 × nombre de départ", tests:[1,4,10],
  aide:"Le robot ne garde qu'un seul nombre : après avoir calculé 3 × (départ + 4), il a oublié le nombre de départ ! Il faut donc d'abord réduire l'expression. 3 × (x + 4) + 3 × x = 3x + 12 + 3x = … Il te reste 2 blocs de calcul.",
  sol:[["multiplier",6],["ajouter",12],["repeter",5,[["avancer"]]]]},
 /* ---- niveaux ajoutés en novembre 2026 pour allonger les séances (36 à 43 : séance 1 ; 44 à 48 : séance 2) ---- */
 {titre:"Enlever", v0:12, dir:"E", max:5, blocs:["avancer","enlever"],
  map:["#######","#R.P.D#","#######"], doors:[7],
  aide:"Le robot part avec 12 et la porte demande 7. Il faut diminuer son nombre : avec « enlever », de combien ?",
  sol:[["enlever",5],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Un virage", v0:5, dir:"E", max:8, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier"],
  map:["######","#R..##","###P##","###.##","###D##","######"], doors:[15],
  aide:"Le robot doit tourner au coin pour descendre vers la porte. Il part avec 5 et la porte demande 15 : quel calcul transforme 5 en 15 ? Fais-le avant d'arriver devant la porte.",
  sol:[["multiplier",3],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Trouve l'erreur : le mauvais calcul", type:"bug", v0:6, dir:"E", max:6, blocs:["avancer","ajouter","enlever","multiplier"],
  map:["########","#R..P.D#","########"], doors:[18],
  depart:[["ajouter",3],["avancer"],["avancer"],["avancer"],["avancer"],["avancer"]],
  aide:"Le robot arrive devant la porte avec 9 au lieu de 18, car 6 + 3 = 9. Garde le nombre 3, mais change le calcul : lequel transforme 6 en 18 ?",
  sol:[["multiplier",3],["avancer"],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Prévois le nombre 2", type:"prevois", v0:10, dir:"E", max:0, blocs:[],
  map:["########","#R....D#","########"],
  prog:[["enlever",4],["avancer"],["multiplier",5],["avancer"],["ajouter",2],["avancer"],["avancer"],["avancer"]], rep:32,
  aide:"Ne lance rien : calcule toi-même, bloc par bloc. Le robot part avec 10. Les blocs « avancer » ne changent pas son nombre : note le nombre après chaque calcul.",
  sol:null},
 {titre:"Le coffre-fort 3", type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","#R...PD#","########"], doors:[27],
  prog:[["ajouter",5],["multiplier",3],["repeter",4,[["avancer"]]],["avancer"]], rep:4,
  aide:"Remonte le programme à l'envers. Le dernier calcul est « multiplier par 3 » : avant, le robot affichait 27 ÷ 3 = 9. Et avant « ajouter 5 », il affichait… ?",
  sol:null},
 {titre:"Deux portes, deux virages", v0:3, dir:"E", max:14, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier"],
  map:["#######","#R.P..#","#####.#","#D.P..#","#######"], doors:[9,3],
  aide:"Le robot part avec 3. La porte du haut demande 9, celle du bas demande 3. Avant la première porte : quel calcul fait passer de 3 à 9 ? Ensuite, avant la deuxième : de 9 à 3. Et n'oublie pas les deux virages.",
  sol:[["multiplier",3],["avancer"],["avancer"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["droite"],["enlever",6],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Les calculs imposés", v0:2, dir:"E", max:7, fixe:{ajouter:4, multiplier:3}, blocs:["avancer","ajouter","multiplier"],
  map:["#######","#R.P.D#","#######"], doors:[30],
  aide:"Tu as seulement « ajouter 4 » et « multiplier par 3 », et le robot doit passer de 2 à 30 avec 3 calculs. Astuce : pars de la fin ! 30, c'est 10 × 3… Et comment obtenir 10 à partir de 2 ?",
  sol:[["ajouter",4],["ajouter",4],["multiplier",3],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Trouve l'erreur : trop tôt", type:"bug", v0:4, dir:"E", max:8, blocs:["avancer","ajouter","enlever","multiplier"],
  map:["#########","#R.P.P.D#","#########"], doors:[8,16],
  depart:[["ajouter",4],["multiplier",2],["avancer"],["avancer"],["avancer"],["avancer"],["avancer"],["avancer"]],
  aide:"Les bons calculs sont là, mais le robot les fait tous au début : il arrive devant la première porte avec 16 au lieu de 8 ! Le calcul « multiplier par 2 » doit être fait APRÈS la première porte, et avant la deuxième.",
  sol:[["ajouter",4],["avancer"],["avancer"],["multiplier",2],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"Répéter une addition", v0:0, dir:"E", max:4, fixe:{ajouter:3}, blocs:["avancer","ajouter","repeter"],
  map:["#######","#R.P.D#","#######"], doors:[12],
  aide:"Le robot part avec 0 et la porte demande 12, avec le bloc « ajouter 3 » seulement. Combien de fois faut-il ajouter 3 ? Avec 4 blocs au maximum, il faut deux boucles « répéter ».",
  sol:[["repeter",4,[["ajouter",3]]],["repeter",4,[["avancer"]]]]},
 {titre:"Le motif à deux pas", v0:2, dir:"E", max:6, blocs:["avancer","ajouter","enlever","multiplier","repeter"],
  map:["###########","#R.P.P.P.D#","###########"], doors:[6,10,14],
  aide:"Les portes demandent 6, 10, 14 : à chaque fois, 4 de plus. Le motif qui se répète : avancer d'une case, calculer, avancer jusque dans la porte. Combien de fois ? Et que reste-t-il après la dernière porte ?",
  sol:[["repeter",3,[["avancer"],["ajouter",4],["avancer"]]],["avancer"],["avancer"]]},
 {titre:"Prévois : ajouter puis doubler", type:"prevois", v0:1, dir:"E", max:0, blocs:[],
  map:["########","#R....D#","########"],
  prog:[["repeter",3,[["ajouter",2],["multiplier",2]]],["repeter",5,[["avancer"]]]], rep:36,
  aide:"Fais les tours de boucle un par un. Tour 1 : 1 + 2 = 3, puis 3 × 2 = 6. Tour 2 : on repart de 6… Note le nombre après chaque calcul.",
  sol:null},
 {titre:"Trouve l'erreur : un calcul de trop", type:"bug", v0:2, dir:"E", max:5, blocs:["avancer","ajouter","multiplier","repeter"],
  map:["########","#R..P.D#","########"], doors:[20],
  depart:[["repeter",2,[["ajouter",3],["multiplier",2]]],["repeter",5,[["avancer"]]]],
  aide:"Le robot affiche 26 au lieu de 20. Le calcul voulu : ajouter 3 UNE seule fois (2 + 3 = 5), puis doubler deux fois (5 × 2 × 2 = 20). Un bloc est mal placé : il doit sortir de la boucle.",
  sol:[["ajouter",3],["repeter",2,[["multiplier",2]]],["repeter",5,[["avancer"]]]]},
 {titre:"Le coffre-fort à boucle 2", type:"coffre", dir:"E", max:0, blocs:[],
  map:["########","#R...PD#","########"], doors:[40],
  prog:[["repeter",3,[["enlever",2]]],["multiplier",5],["repeter",4,[["avancer"]]],["avancer"]], rep:14,
  aide:"Remonte le programme à l'envers. Avant « multiplier par 5 », le robot affichait 40 ÷ 5 = 8. Avant la boucle, qui enlève 2 trois fois de suite (donc 6 en tout), il affichait… ?",
  sol:null},
 /* ---- niveaux SECRETS de la 5e (49 à 53) : la zone cachée, ouverte quand toute la séance 1 est réussie ; tous dans le noir ----
    noir : seules les cases autour du robot sont éclairées (true : elles restent éclairées ; "oubli" : le noir revient derrière lui)
    miroir : « gauche » et « droite » sont inversés · muet : un code de porte est effacé (indice dans la consigne) */
 {titre:"Dans le noir", secret:true, noir:true, v0:2, dir:"E", max:20, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier"],
  map:["###########","#...###..D#","#.#.###P###","###...P...#","###.#####.#","#R....###.#","###########"], doors:[7,10],
  consigne:"Le labyrinthe est plongé dans le <b>noir</b> : tu ne vois que les cases autour du robot. Il part avec le nombre <b>2</b>. Il y a <b>deux portes</b> et des culs-de-sac. Lance ton programme pour explorer : les cases découvertes restent éclairées.",
  aide:"Explore petit à petit : écris quelques blocs, lance, regarde ce qui s'éclaire, puis continue. Note sur une feuille ce que tu découvres (les virages, les codes). Chaque calcul doit être fait AVANT d'arriver devant sa porte.",
  sol:[["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"],["multiplier",5],["avancer"],["avancer"],["avancer"],["avancer"],["gauche"],["enlever",3],["avancer"],["avancer"],["droite"],["avancer"],["avancer"]]},
 {titre:"Le miroir dans le noir", secret:true, noir:true, miroir:true, v0:3, dir:"E", max:19, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier"],
  map:["#########","#R...####","###.#..D#","###P#P###","###.....#","###.#####","#########"], doors:[12,5],
  consigne:"Toujours dans le <b>noir</b>… et ce labyrinthe est un <b>miroir</b> : quand le programme dit « tourner à gauche », le robot tourne à droite, et inversement ! Il part avec le nombre <b>3</b>.",
  aide:"Avant chaque virage, demande-toi d'abord de quel côté le robot doit VRAIMENT tourner, puis prends le bloc contraire. Explore avec peu de blocs, et note les codes des portes dès qu'ils apparaissent.",
  sol:[["multiplier",4],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["droite"],["enlever",7],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"]]},
 {titre:"Les trois portes", secret:true, noir:true, v0:5, dir:"E", max:21, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier"],
  map:["###########","#R.P.....##","#####.#####","###....P..#","###.####.##","########PD#","###########"], doors:[2,18,6],
  consigne:"Dans le <b>noir</b>, <b>trois portes</b> t'attendent, et leurs codes montent et descendent ! Le robot part avec le nombre <b>5</b>. Explore pour découvrir les trois codes.",
  aide:"Note chaque code dès qu'il apparaît. Avant chaque porte, demande-toi : faut-il ajouter, enlever ou multiplier pour passer du nombre du robot au code ? Un des calculs est une multiplication.",
  sol:[["enlever",3],["avancer"],["avancer"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["gauche"],["multiplier",9],["avancer"],["avancer"],["avancer"],["droite"],["enlever",12],["avancer"],["avancer"],["gauche"],["avancer"]]},
 {titre:"Le coffre muet", secret:true, noir:true, muet:true, v0:7, dir:"N", max:19, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier"],
  map:["###########","#..##...PD#","#.###.#####","#...P...###","#.#.###.###","#R#..######","###########"], doors:[60,"f"], fn:v=>63,
  consigne:"Dans le <b>noir</b>, et le code de la première porte a été <b>effacé</b> ! Un indice est gravé dessus : <b>« Je suis le plus grand multiple de 9 qui est plus petit que 70. »</b> Le robot part avec le nombre <b>7</b> et regarde vers le haut.",
  aide:"Récite la table de 9 : 9, 18, 27… Lequel est le plus grand avant 70 ? Ensuite, trouve le calcul qui transforme 7 en ce nombre. La deuxième porte a un code écrit : tu le verras en t'approchant.",
  sol:[["avancer"],["avancer"],["droite"],["multiplier",9],["avancer"],["avancer"],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"],["enlever",3],["avancer"],["avancer"],["avancer"],["avancer"]]},
 {titre:"La nuit sans lune", secret:true, noir:"oubli", v0:4, dir:"E", max:30, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier"],
  map:["#############","###........##","#.#.###.#####","#.#.###P#.PD#","#R....#.#.###","#.#####.....#","#.#####.#####","#.....#.#####","#############"], doors:[20,13],
  consigne:"La porte finale : une <b>nuit sans lune</b>. Le robot ne voit que les cases autour de lui, et <b>le noir revient derrière lui</b> : rien ne reste éclairé ! Il part avec le nombre <b>4</b>. Note le chemin et les codes sur une feuille.",
  aide:"Fais un plan sur une feuille quadrillée : à chaque essai, dessine les cases que tu as vues. Avance par petits bouts : quelques blocs, lance, note, puis ajoute la suite. Il y a deux portes et plusieurs culs-de-sac.",
  sol:[["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["avancer"],["avancer"],["droite"],["multiplier",5],["avancer"],["avancer"],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"],["enlever",7],["avancer"],["avancer"]]},
 /* ---- niveaux SECRETS 2 de la 5e (54 à 58) : la deuxième zone cachée, ouverte quand toute la séance 2 est réussie ; tous dans le noir, avec des boucles ---- */
 {titre:"Les portes en escalier", secret:true, noir:true, v0:3, dir:"E", max:8, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["########","#####.D#","####.P.#","###.P###","#..P####","#RP#####","########"], doors:[19,15,11,7],
  consigne:"Dans le <b>noir</b>, un escalier de <b>portes</b> ! Le robot part avec le nombre <b>3</b>. Chaque marche a sa porte, et les codes suivent une règle. Tu n'as droit qu'à <b>8 blocs</b>.",
  aide:"Note les codes des portes au fur et à mesure : de combien augmentent-ils à chaque marche ? Une marche = un calcul, puis le déplacement. Mets tout ça dans un « répéter ».",
  sol:[["repeter",4,[["ajouter",4],["avancer"],["gauche"],["avancer"],["droite"]]],["avancer"]]},
 {titre:"Le miroir qui triple", secret:true, noir:true, miroir:true, v0:1, dir:"E", max:9, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["######","#RP..#","####P#","#D##.#","#..P.#","######"], doors:[3,9,27],
  consigne:"Dans le <b>noir</b> et dans un <b>miroir</b> : « gauche » et « droite » sont inversés ! Le robot part avec le nombre <b>1</b> et fait le tour d'un massif. Tu as droit à <b>9 blocs</b>.",
  aide:"Chaque côté du tour se fait pareil : un calcul, puis trois cases, puis un virage. Regarde les codes 3, 9… : par combien faut-il multiplier à chaque fois ? Pour le virage, cherche le vrai sens puis prends le bloc contraire.",
  sol:[["repeter",3,[["multiplier",3],["avancer"],["avancer"],["avancer"],["gauche"]]],["avancer"]]},
 {titre:"Deux boucles, deux calculs", secret:true, noir:true, v0:2, dir:"E", max:10, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["#######","#####D#","#####P#","####..#","###.#P#","#RPPP.#","#######"], doors:[44,22,5,8,11],
  consigne:"Dans le <b>noir</b>, cinq <b>portes</b> : d'abord une ligne vers la droite, puis une ligne vers le haut. Le robot part avec le nombre <b>2</b>. Tu as droit à <b>10 blocs</b>.",
  aide:"Les trois premières portes : leurs codes augmentent toujours du même nombre. Les deux dernières : le code double. Une boucle pour chaque ligne droite, avec le bon calcul dedans.",
  sol:[["repeter",3,[["ajouter",3],["avancer"]]],["avancer"],["gauche"],["repeter",2,[["multiplier",2],["avancer"],["avancer"]]]]},
 {titre:"La porte effacée", secret:true, noir:true, muet:true, v0:1, dir:"E", max:14, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["#########","###.P.PD#","###.#.###","#R...####","#########"], doors:["f",40], fn:v=>32,
  consigne:"Dans le <b>noir</b>, le code de la première porte a été <b>effacé</b> ! Un indice est gravé dessus : <b>« Pars de 1 et double, double, double… Je suis le premier nombre plus grand que 30 que tu obtiens. »</b> Le robot part avec le nombre <b>1</b>. Tu as droit à <b>14 blocs</b>.",
  aide:"Double à partir de 1 : 2, 4, 8… Combien de fois faut-il doubler pour dépasser 30 ? Un « répéter » fera tous ces doublements. La deuxième porte a un code écrit : tu le verras en t'approchant.",
  sol:[["repeter",5,[["multiplier",2]]],["avancer"],["avancer"],["gauche"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["ajouter",8],["avancer"],["avancer"]]},
 {titre:"La nuit des trois portes", secret:true, noir:"oubli", v0:5, dir:"E", max:15, blocs:["avancer","gauche","droite","ajouter","enlever","multiplier","repeter"],
  map:["###############","#######.#######","##...#...#...##","##.#.#.#.#.#.##","#RP#..P#..P#.D#","#####.###.#####","###############"], doors:[10,15,20],
  consigne:"La porte finale : une <b>nuit sans lune</b>. Le robot ne voit que les cases autour de lui, et <b>le noir revient derrière lui</b> ! Il part avec le nombre <b>5</b>. Trois créneaux, trois portes. Tu as droit à <b>15 blocs</b>.",
  aide:"Fais un plan sur une feuille. Chaque créneau commence par une porte : de combien augmentent les codes ? Écris un créneau une seule fois (calcul, porte, monter, droite, descendre), puis mets-le dans un « répéter ».",
  sol:[["repeter",3,[["ajouter",5],["avancer"],["gauche"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["droite"],["avancer"],["avancer"],["gauche"],["avancer"]]]]}
];

/* on retire les rangées de haies inutiles en haut et en bas (une seule rangée de bordure suffit) */
[L6,L5].forEach(P=>P.forEach(L=>{ const full=r=>/^#+$/.test(r); let m=L.map.slice();
  while(m.length>3 && full(m[0]) && full(m[1])) m.shift(); while(m.length>3 && full(m[m.length-1]) && full(m[m.length-2])) m.pop(); L.map=m; }));

/* ------------------------------------------------------------------
   Simulation
------------------------------------------------------------------ */
/* nombres affichés à la française : vrai signe moins, virgule décimale */
const fmtN = v => String(v).replace("-","−").replace(".",",");
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
        case "gauche": case "droite": { const k=(n[0]==="droite"?1:-1)*(L.miroir?-1:1); st.d=(st.d+4+k)%4; acts.push({t:"turn", id, k, x:st.x, y:st.y, d:st.d}); break; }
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
      <rect x="${X+8}" y="${Y+9}" width="${CELL-16}" height="18" rx="3" fill="#fff8e1"/><text class="ldcode" x="${X+CELL/2}" y="${Y+23}" text-anchor="middle" style="font:800 13px Arial;fill:#5a3a1a">${code==="f"?"?":fmtN(code)}</text></g>`; }
  if(L.noir){ s+=`<g class="lfog" aria-hidden="true">`; L.map.forEach((row,y)=>[...row].forEach((c,x)=>{ s+=`<rect id="fg-${x}-${y}" class="lfogc" x="${x*CELL-0.5}" y="${y*CELL-0.5}" width="${CELL+1}" height="${CELL+1}" fill="#0c1430" stroke="#18224a" stroke-width="1"/>`; })); s+="</g>"; }
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
  if(L.consigne) return L.consigne;
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
     : (L.voir && statique(L)) ? `<details class="lsolbox"><summary>Toujours bloqué ? Voir la réponse</summary><p>Le robot doit partir avec <b>${fmtN(L.rep)}</b>. Vérifie en refaisant le calcul dans l'ordre du programme.</p></details>` : "";
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
  WS.updateToolbox({kind:"flyoutToolbox", contents:L.blocs.map(TB)});   /* la palette est recalculée une fois l'espace vidé (sinon elle peut rester grisée) */
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
  if(L.noir) eclaire(x, y);
  const bot=document.getElementById("lbot"); if(!bot) return;
  const tr = anim ? "transform .32s ease-in-out" : "none";
  bot.style.transition = tr; bot.style.transform = `translate(${x*CELL+CELL/2}px, ${y*CELL+CELL/2}px) rotate(${angle}deg)`;
  const val=document.getElementById("lval"); if(val){ val.style.transition=tr; val.style.transform=`translate(${x*CELL+CELL/2}px, ${y*CELL+CELL/2}px)`; }
}
/* niveaux « dans le noir » : les cases autour du robot s'éclairent, et restent éclairées (gardées pour ce niveau) */
function eclaire(x, y){
  const ici=[]; for(let dy=-1; dy<=1; dy++) for(let dx=-1; dx<=1; dx++) ici.push((x+dx)+"-"+(y+dy));
  if(LEVELS[cur].noir==="oubli"){ document.querySelectorAll(".lfogc.vu").forEach(r=>r.classList.remove("vu")); ici.forEach(k=>{ const r=document.getElementById("fg-"+k); if(r) r.classList.add("vu"); }); return; }
  let vu; try{ vu=JSON.parse(store.get("vu2-"+cur)||"[]"); }catch(e){ vu=[]; } let neuf=false;
  ici.forEach(k=>{ if(!vu.includes(k)){ vu.push(k); neuf=true; } });
  vu.forEach(k=>{ const r=document.getElementById("fg-"+k); if(r) r.classList.add("vu"); }); if(neuf) store.set("vu2-"+cur, JSON.stringify(vu)); }
function setVal(v){ const t=document.getElementById("lvalt"); if(t) t.textContent = (v===undefined?"":fmtN(v)); }
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
  if(res.end==="porte"){ const a=res.acts[res.acts.length-1]; if(LEVELS[cur].muet) return `<b>La porte reste fermée !</b> Le robot affiche ${fmtN(a.v)}, mais ce n'est pas le code. Relis l'indice gravé sur la porte.`; return `<b>La porte reste fermée !</b> Le robot affiche ${fmtN(a.v)}, mais le code de la porte est ${fmtN(a.code)}.`; }
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
