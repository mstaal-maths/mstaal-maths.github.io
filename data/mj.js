/* Registre des mini-jeux de maths : window.MJ[clé] = {cls, src, name, titre, tag, badge, desc, intro, ill, wide} — assemblé par SC/mj/build.py */
window.MJ = {};
MJ["sniper6"] = {cls:"6e", src:"data/mj-sniper.js", name:"MJ_SNIPER", wide:true,
  titre:"Le sniper de la droite graduée", tag:"Nombres décimaux", badge:"10 niveaux",
  desc:"Un nombre décimal s'affiche : vise-le sur la droite graduée. Plus ton tir est précis, plus tu marques !",
  intro:"Un nombre s'affiche : clique sur la droite graduée à l'endroit exact où il se trouve. Plus ton tir est précis, plus tu gagnes de points.",
  ill:`<rect width="200" height="110" fill="#f4f7fd"/>
    <path d="M6 74H194" stroke="#15213b" stroke-width="2.2"/><path d="M197 74l-7-4v8z" fill="#15213b"/>
    ${Array.from({length:21},(_,i)=>`<path d="M${14+i*8.6} ${74-(i%10?(i%5?4:6.5):9)}V${74+(i%10?(i%5?4:6.5):9)}" stroke="#15213b" stroke-width="${i%10?1:1.8}"/>`).join("")}
    <text x="14" y="98" text-anchor="middle" style="font:700 10px Arial,sans-serif" fill="#15213b">2</text><text x="100" y="98" text-anchor="middle" style="font:700 10px Arial,sans-serif" fill="#15213b">3</text><text x="186" y="98" text-anchor="middle" style="font:700 10px Arial,sans-serif" fill="#15213b">4</text>
    <path d="M138.7 74V44" stroke="#1e8e3e" stroke-width="2"/><rect x="121.7" y="28" width="34" height="17" rx="5" fill="#1e8e3e"/><text x="138.7" y="40.5" text-anchor="middle" style="font:700 10px Arial,sans-serif" fill="#fff">3,45</text>
    <path d="M131 66h7.7" stroke="#e8a200" stroke-width="3" stroke-linecap="round"/>
    <g transform="translate(131 74)"><circle r="12" fill="none" stroke="#d93025" stroke-width="2"/><circle r="1.8" fill="#d93025"/><path d="M-19 0h10M9 0h10M0 -19v10M0 9v10" stroke="#d93025" stroke-width="2"/></g>
    <rect x="10" y="10" width="62" height="24" rx="7" fill="#fff" stroke="#2563eb" stroke-width="1.6"/><text x="41" y="27" text-anchor="middle" style="font:800 13px Arial,sans-serif" fill="#2563eb">Vise 3,45</text>`};
MJ["multiples6"] = {cls:"6e", src:"data/mj-multiples.js", name:"MJ_MULTIPLES", wide:true,
  titre:"Chasse aux multiples", tag:"Divisibilité", badge:"10 niveaux",
  desc:"Multiples de 2, 3, 4, 5, 9, 10 : clique-les tous dans la grille avant la fin du chrono !",
  intro:"Clique sur tous les multiples demandés avant la fin du chrono, grâce aux critères de divisibilité. Chaque erreur coûte des points et elle est expliquée.",
  ill:`<rect width="200" height="110" fill="#f4f7fd"/>
    <rect x="8" y="7" width="98" height="17" rx="5" fill="#2563eb"/><text x="57" y="19.5" text-anchor="middle" style="font:800 10px Arial,sans-serif" fill="#fff">Multiples de 3</text>
    <rect x="114" y="13" width="78" height="6" rx="3" fill="#dde4f0"/><rect x="114" y="13" width="46" height="6" rx="3" fill="#2563eb"/>
    ${[["123","ok"],["58",""],["207","ok"],["94",""],["311","ko"],["66","ok"],["145",""],["900","ok"],["251",""],["72","ok"],["119",""],["438","ok"]].map(([n,s],i)=>{ const x=8+(i%4)*47, y=31+Math.floor(i/4)*26;
      return `<rect x="${x}" y="${y}" width="43" height="22" rx="5" fill="${s==="ok"?"#e3f5ec":s==="ko"?"#fce9e9":"#fff"}" stroke="${s==="ok"?"#167a54":s==="ko"?"#c43c3c":"#c9d4e3"}" stroke-width="1.5"/><text x="${x+21.5}" y="${y+15.5}" text-anchor="middle" style="font:800 11px Arial,sans-serif" fill="${s==="ok"?"#167a54":s==="ko"?"#c43c3c":"#15213b"}">${n}</text>${s==="ko"?`<path d="M${x+9} ${y+11}h25" stroke="#c43c3c" stroke-width="1.6"/>`:""}`; }).join("")}`};
MJ["ninja6"] = {cls:"6e", src:"data/mj-ninja.js", name:"MJ_NINJA", wide:true,
  titre:"Fraction Ninja", tag:"Fractions", badge:"10 niveaux",
  desc:"Chocolat, pizzas, pastèques volent : tranche-les d'un coup de sabre aux 3/5, aux 2/3… le plus précisément possible !",
  intro:"Un objet est lancé avec une consigne comme « Coupe aux 3/5 » : clique et glisse à travers l'objet pour le trancher au bon endroit. Plus ta coupe est précise, plus tu marques, et les coupes précises d'affilée font des combos.",
  ill:`<rect width="200" height="110" fill="#1b2747"/>
    <rect x="14" y="0" width="7" height="110" fill="#fff" opacity=".05"/><rect x="180" y="0" width="8" height="110" fill="#fff" opacity=".05"/>
    <circle cx="164" cy="22" r="11" fill="#fff" opacity=".07"/>
    <g transform="translate(22 52) rotate(-6)"><rect width="78" height="30" rx="3" fill="#4a2412"/>
      ${[0,1,2].map(i=>[0,1].map(j=>`<rect x="${1.5+i*26}" y="${1.5+j*15}" width="23" height="12" rx="2" fill="#86492a"/>`).join("")).join("")}
      <path d="M77 2V28" stroke="#b9784a" stroke-width="2"/></g>
    <g transform="translate(112 50) rotate(9)"><rect width="52" height="30" rx="3" fill="#4a2412"/>
      ${[0,1].map(i=>[0,1].map(j=>`<rect x="${1.5+i*26}" y="${1.5+j*15}" width="23" height="12" rx="2" fill="#86492a"/>`).join("")).join("")}
      <path d="M1 2V28" stroke="#b9784a" stroke-width="2"/></g>
    <path d="M118 6C112 36 104 70 92 104" stroke="#bfe9ff" stroke-width="6" stroke-linecap="round" opacity=".45" fill="none"/>
    <path d="M118 6C112 36 104 70 92 104" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>
    <rect x="98" y="88" width="5" height="5" fill="#6e381b"/><rect x="122" y="92" width="4" height="4" fill="#9a5a32"/><rect x="86" y="40" width="4" height="4" fill="#9a5a32"/><rect x="128" y="38" width="5" height="5" fill="#6e381b"/>
    <rect x="6" y="8" width="76" height="34" rx="8" fill="#fff" stroke="#ffcf3f" stroke-width="2"/>
    <text x="11" y="29.5" style="font:700 10px Arial,sans-serif;letter-spacing:0" fill="#15213b">Coupe aux</text>
    <text x="70" y="23" text-anchor="middle" style="font:800 11px Arial,sans-serif;letter-spacing:0" fill="#1d4ed8">3</text><path d="M64 25.5h12" stroke="#1d4ed8" stroke-width="1.6"/><text x="70" y="36" text-anchor="middle" style="font:800 11px Arial,sans-serif;letter-spacing:0" fill="#1d4ed8">5</text>
    <text x="150" y="102" text-anchor="middle" style="font:800 12px Arial,sans-serif;letter-spacing:0" fill="#ffcf3f">COMBO ×3</text>`};
MJ["golf6"] = {cls:"6e", src:"data/mj-golf.js", name:"MJ_GOLF", wide:true,
  titre:"Le mini-golf des angles", tag:"Angles", badge:"9 trous",
  desc:"Tape l'angle de tir, dose la puissance et fais rebondir la balle sur les murs jusqu'au trou !",
  intro:"Tape l'angle de tir en degrés, choisis la puissance et vise le trou : estime, mesure au rapporteur, puis calcule les rebonds. Moins tu utilises de coups, plus tu gagnes d'étoiles.",
  ill:`<rect width="200" height="110" fill="#2e6b3b"/>
    <rect x="7" y="7" width="186" height="96" rx="5" fill="#4aa35a" stroke="#8a5a2b" stroke-width="6"/>
    ${[...Array(9)].map((_,i)=>`<path d="M${22+i*20} 10V100" stroke="rgba(255,255,255,.16)"/>`).join("")}${[...Array(4)].map((_,i)=>`<path d="M10 ${25+i*20}H190" stroke="rgba(255,255,255,.16)"/>`).join("")}
    <rect x="96" y="34" width="8" height="66" fill="#9a6332" stroke="#6b4220" stroke-width="1.2"/>
    <path d="M34 88L100 13.5L163.5 84" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="2 4" stroke-linecap="round"/>
    <circle cx="100" cy="14" r="4.5" fill="rgba(255,255,255,.4)" stroke="#fff" stroke-width="1" stroke-dasharray="2 1.5"/>
    <path d="M34 88H80" stroke="#15213b" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M60 88A26 26 0 0 0 51.2 68.5" fill="none" stroke="#7a3fd0" stroke-width="2.4"/>
    <rect x="64" y="68" width="30" height="16" rx="5" fill="#fff" stroke="#7a3fd0" stroke-width="1.5"/><text x="79" y="79.5" text-anchor="middle" style="font:800 10px Arial,sans-serif" fill="#7a3fd0">48°</text>
    <circle cx="164" cy="84" r="7" fill="#e8f5e9"/><circle cx="164" cy="84" r="5.5" fill="#0f2a18"/>
    <path d="M165 84V60" stroke="#f4f4f4" stroke-width="1.8"/><path d="M165.5 60l12 4-12 4z" fill="#e53935"/>
    <circle cx="35" cy="89.5" r="4.5" fill="rgba(0,0,0,.25)"/><circle cx="34" cy="88" r="4.5" fill="#fff" stroke="#8a95a3" stroke-width=".8"/>
    <rect x="128" y="18" width="56" height="18" rx="6" fill="#fff" stroke="#2563eb" stroke-width="1.4"/><text x="156" y="30.5" text-anchor="middle" style="font:800 10px Arial,sans-serif" fill="#2563eb">Tir : 48°</text>`};
MJ["ascenseur5"] = {cls:"5e", src:"data/mj-ascenseur.js", name:"MJ_ASCENSEUR", wide:true,
  titre:"L'ascenseur des relatifs", tag:"Nombres relatifs", badge:"8 niveaux",
  desc:"Prévois l'étage où arrive l'ascenseur, sous-sols compris, puis regarde-le faire le trajet.",
  intro:"L'ascenseur monte et descend, jusque dans les sous-sols : prévois où il arrive. Clique sur l'étage ou écris le nombre, puis regarde le trajet.",
  ill:`<rect width="200" height="110" fill="#cfe8ff"/><rect y="70" width="200" height="40" fill="#8a6a4a"/>
    <circle cx="178" cy="16" r="9" fill="#ffd34d"/>
    <rect x="52" y="6" width="84" height="4" rx="2" fill="#7b5b48"/>
    ${[0,1,2,3,4].map(i=>`<rect x="56" y="${10+i*12}" width="76" height="12" fill="${i%2?"#f6dfba":"#f1d5a9"}" stroke="#c9a46f" stroke-width=".6"/>`).join("")}
    ${[0,1,2].map(i=>`<rect x="56" y="${70+i*12}" width="76" height="12" fill="${i%2?"#6b7385":"#646c7e"}" stroke="#4b5263" stroke-width=".6"/>`).join("")}
    ${[0,1,2,3].map(i=>`<rect x="61" y="${13+i*12}" width="9" height="6" rx="1" fill="#a8d4f5"/><rect x="117" y="${13+i*12}" width="9" height="6" rx="1" fill="#a8d4f5"/>`).join("")}
    <path d="M0 70H200" stroke="#3f7d3a" stroke-width="2.5"/>
    <rect x="84" y="10" width="20" height="96" fill="#3a4152"/>
    <rect x="85.5" y="83" width="17" height="10" rx="2" fill="#ffd166" stroke="#a87a00"/><circle cx="94" cy="86" r="2" fill="#f2c39b"/><path d="M91 93v-3.5a3 3 0 0 1 6 0V93z" fill="#e8413c"/>
    ${[["4",16],["3",28],["2",40],["1",52],["0",64],["−1",76],["−2",88],["−3",100]].map(([t,y])=>`<text x="50" y="${y+3.5}" text-anchor="end" style="font:700 9px Arial,sans-serif" fill="${t.startsWith("−")?"#f4efe6":"#15213b"}">${t}</text>`).join("")}
    <path d="M110 38C126 46 124 74 110 86" fill="none" stroke="#d64545" stroke-width="2.4" stroke-dasharray="4 3"/><path d="M107 82l4 6 4-5" fill="none" stroke="#d64545" stroke-width="2.4" stroke-linecap="round"/>
    <rect x="142" y="38" width="52" height="22" rx="6" fill="#fff" stroke="#1b2a44"/><text x="168" y="53" text-anchor="middle" style="font:800 11px Arial,sans-serif" fill="#1b2a44">2 + (−4)</text>
    <rect x="152" y="80" width="36" height="20" rx="6" fill="#1f9d55"/><text x="170" y="94" text-anchor="middle" style="font:800 12px Arial,sans-serif" fill="#fff">−2 ?</text>`};
MJ["angles5"] = {cls:"5e", src:"data/mj-angles.js", name:"MJ_ANGLES", wide:true,
  titre:"L'œil du rapporteur", tag:"Angles", badge:"6 niveaux",
  desc:"Estime la mesure d'un angle à l'œil, puis le rapporteur révèle la vraie valeur.",
  intro:"Un angle s'affiche : estime sa mesure sans rapporteur. Le rapporteur apparaît ensuite et donne la vraie mesure : plus tu es proche, plus tu gagnes de points.",
  ill:`<rect width="200" height="110" fill="#fff"/>${[...Array(21)].map((_,i)=>`<path d="M${i*10} 0V110" stroke="#eef3f9"/>`).join("")}${[...Array(12)].map((_,i)=>`<path d="M0 ${i*10}H200" stroke="#eef3f9"/>`).join("")}
    <g transform="translate(92 98)"><path d="M-84 0A84 84 0 0 1 84 0Z" fill="rgba(255,236,150,.7)" stroke="#b8962e"/>
    ${[...Array(19)].map((_,i)=>{ const t=i*10*Math.PI/180, c=Math.cos(t), s=-Math.sin(t); return `<path d="M${(84*c).toFixed(1)} ${(84*s).toFixed(1)}L${(74*c).toFixed(1)} ${(74*s).toFixed(1)}" stroke="#5a4a14" stroke-width="1"/>`; }).join("")}
    <path d="M0 0H96" stroke="#1f1f1f" stroke-width="2.4"/><path d="M0 0L57.4 -82" stroke="#1f1f1f" stroke-width="2.4"/>
    <path d="M0 0L84 0A84 84 0 0 0 48.2 -68.8Z" fill="rgba(37,99,235,.15)"/>
    <path d="M0 0L54 -64.3" stroke="#e8590c" stroke-width="2.2" stroke-dasharray="6 4"/>
    <path d="M-5 -5l10 10m0-10-10 10" stroke="#1f1f1f" stroke-width="1.8"/></g>
    <rect x="128" y="8" width="62" height="24" rx="7" fill="#2563eb"/><text x="159" y="25" text-anchor="middle" style="font:800 14px Arial,sans-serif" fill="#fff">55°</text>
    <rect x="128" y="38" width="62" height="20" rx="6" fill="#fff" stroke="#e8590c" stroke-width="1.5"/><text x="159" y="52" text-anchor="middle" style="font:700 10px Arial,sans-serif" fill="#e8590c">estimé : 50°</text>`};
MJ["pixel5"] = {cls:"5e", src:"data/mj-pixel.js", name:"MJ_PIXEL", wide:true,
  titre:"Pixel art en symétrie centrale", tag:"Symétrie centrale", badge:"8 niveaux",
  desc:"Colorie les cases pour compléter des dessins en pixels par un demi-tour autour du point O.",
  intro:"Complète chaque dessin en pixels pour que le point O soit son centre de symétrie. Choisis une couleur, colorie les cases, et le bouton « Voir le demi-tour » t'aide à comprendre.",
  ill:`<rect width="200" height="110" fill="#fff"/><rect x="18.0" y="9.0" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="9.0" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="9.0" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="9.0" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="9.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="9.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="9.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="9.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="18.0" y="20.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="20.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="20.5" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="20.5" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="20.5" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="20.5" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="20.5" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="20.5" width="11.5" height="11.5" fill="rgba(245,196,0,.3)" stroke="#c4cfdf" stroke-width=".8"/><rect x="18.0" y="32.0" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="32.0" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="32.0" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="32.0" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="32.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="32.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="32.0" width="11.5" height="11.5" fill="rgba(245,196,0,.3)" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="32.0" width="11.5" height="11.5" fill="rgba(245,196,0,.3)" stroke="#c4cfdf" stroke-width=".8"/><rect x="18.0" y="43.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="43.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="43.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="43.5" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="43.5" width="11.5" height="11.5" fill="rgba(245,196,0,.3)" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="43.5" width="11.5" height="11.5" fill="rgba(245,196,0,.3)" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="43.5" width="11.5" height="11.5" fill="rgba(245,196,0,.3)" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="43.5" width="11.5" height="11.5" fill="rgba(245,196,0,.3)" stroke="#c4cfdf" stroke-width=".8"/><rect x="18.0" y="55.0" width="11.5" height="11.5" fill="#f5c400" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="55.0" width="11.5" height="11.5" fill="#f5c400" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="55.0" width="11.5" height="11.5" fill="#f5c400" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="55.0" width="11.5" height="11.5" fill="#f5c400" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="55.0" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="55.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="55.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="55.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="18.0" y="66.5" width="11.5" height="11.5" fill="#f5c400" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="66.5" width="11.5" height="11.5" fill="#f5c400" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="66.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="66.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="66.5" width="11.5" height="11.5" fill="rgba(232,65,60,.25)" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="66.5" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="66.5" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="66.5" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="18.0" y="78.0" width="11.5" height="11.5" fill="#f5c400" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="78.0" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="78.0" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="78.0" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="78.0" width="11.5" height="11.5" fill="rgba(232,65,60,.25)" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="78.0" width="11.5" height="11.5" fill="rgba(232,65,60,.25)" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="78.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="78.0" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><rect x="18.0" y="89.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="29.5" y="89.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="41.0" y="89.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="52.5" y="89.5" width="11.5" height="11.5" fill="#e4e9f1" stroke="#c4cfdf" stroke-width=".8"/><rect x="64.0" y="89.5" width="11.5" height="11.5" fill="rgba(232,65,60,.25)" stroke="#c4cfdf" stroke-width=".8"/><rect x="75.5" y="89.5" width="11.5" height="11.5" fill="rgba(232,65,60,.25)" stroke="#c4cfdf" stroke-width=".8"/><rect x="87.0" y="89.5" width="11.5" height="11.5" fill="#e8413c" stroke="#c4cfdf" stroke-width=".8"/><rect x="98.5" y="89.5" width="11.5" height="11.5" fill="#fff" stroke="#c4cfdf" stroke-width=".8"/><circle cx="64" cy="55" r="3.6" fill="#1a56db" stroke="#fff" stroke-width="1.4"/><text x="68" y="51" style="font:800 10px Arial,sans-serif" fill="#1a56db" stroke="#fff" stroke-width="2.4" paint-order="stroke">O</text><path d="M131 55A24 24 0 0 1 179 55" fill="none" stroke="#1a56db" stroke-width="3" stroke-linecap="round"/><path d="M173 52l6 8 6-8" fill="none" stroke="#1a56db" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle cx="155" cy="55" r="3" fill="#1a56db"/><text x="155" y="79" text-anchor="middle" style="font:800 13px Arial,sans-serif" fill="#1b2a44">180°</text>`};
MJ["balance4"] = {cls:"4e", src:"data/mj-balance.js", name:"MJ_BALANCE", wide:true,
  titre:"La balance des équations", tag:"Équations", badge:"6 niveaux",
  desc:"Enlève ou partage la même chose des deux côtés de la balance pour trouver ce que pèse x.",
  intro:"La balance est en équilibre : enlève, ajoute ou partage la même chose des deux côtés pour qu'il ne reste qu'une boîte x. L'équation s'écrit sous la balance à chaque étape.",
  ill:`<rect width="200" height="110" fill="#eef6f1"/>
    <rect x="70" y="100" width="60" height="6" rx="3" fill="#56637a"/><path d="M95 68L90 101H110L105 68Z" fill="#7d8a9e"/>
    <path d="M36 68H164" stroke="#5b6b80" stroke-width="5" stroke-linecap="round"/><circle cx="100" cy="68" r="4" fill="#cfd6e2" stroke="#56637a" stroke-width="1.5"/>
    <path d="M36 68V60M164 68V60" stroke="#5b6b80" stroke-width="3"/><rect x="4" y="57" width="64" height="4" rx="2" fill="#7d8a9e"/><rect x="132" y="57" width="64" height="4" rx="2" fill="#7d8a9e"/>
    ${[8,25,42].map(x=>`<rect x="${x}" y="41" width="15" height="15" rx="2" fill="#f2b25c" stroke="#a8641b" stroke-width="1.2"/><text x="${x+7.5}" y="52.5" text-anchor="middle" style="font:italic 800 11px Georgia,serif" fill="#4a2a05">x</text>`).join("")}
    <path d="M59.5 48H65.5L67.5 56H57.5Z" fill="#4b5567"/><circle cx="62.5" cy="46" r="1.8" fill="none" stroke="#3d4656" stroke-width="1.2"/>
    <rect x="136" y="41" width="15" height="15" rx="2" fill="#f2b25c" stroke="#a8641b" stroke-width="1.2"/><text x="143.5" y="52.5" text-anchor="middle" style="font:italic 800 11px Georgia,serif" fill="#4a2a05">x</text>
    ${[[154,48],[164,48],[174,48],[184,48],[159,39],[169,39],[179,39]].map(([x,y])=>`<path d="M${x+2} ${y}H${x+7}L${x+9} ${y+8}H${x}Z" fill="#4b5567"/>`).join("")}
    <rect x="44" y="9" width="112" height="19" rx="9.5" fill="#fff" stroke="#0b8457" stroke-width="1.5"/><text x="100" y="22.5" text-anchor="middle" style="font:800 11px Arial,sans-serif" fill="#14213d">3x + 1 = x + 7</text>`};
MJ["peintre4"] = {cls:"4e", src:"data/mj-peintre.js", name:"MJ_PEINTRE", wide:true,
  titre:"Le peintre", tag:"Proportionnalité", badge:"6 niveaux",
  desc:"Mélange les pots dans les bonnes proportions pour reproduire la teinte exacte que veut le client.",
  intro:"Reproduis la teinte demandée en versant les bonnes quantités de chaque pot. Si les proportions sont fausses, la couleur change : multiplie la recette par le bon coefficient.",
  ill:`<rect width="200" height="110" fill="#fbf7ef"/><g transform="translate(8 14)"><ellipse cx="22" cy="7" rx="18" ry="4.5" fill="#c9ced8" stroke="#6b7280" stroke-width="1.5"/><path d="M4 7V40Q4 45 22 45Q40 45 40 40V7" fill="#e7eaf0" stroke="#6b7280" stroke-width="1.5"/><path d="M4 17H40V33H4Z" fill="#306fce"/><ellipse cx="22" cy="7" rx="15" ry="3.2" fill="#306fce"/><text x="22" y="62" text-anchor="middle" style="font:800 12px Arial,sans-serif" fill="#1b2a44">3 L</text></g><g transform="translate(56 14)"><ellipse cx="22" cy="7" rx="18" ry="4.5" fill="#c9ced8" stroke="#6b7280" stroke-width="1.5"/><path d="M4 7V40Q4 45 22 45Q40 45 40 40V7" fill="#e7eaf0" stroke="#6b7280" stroke-width="1.5"/><path d="M4 17H40V33H4Z" fill="#f6df30"/><ellipse cx="22" cy="7" rx="15" ry="3.2" fill="#f6df30"/><text x="22" y="62" text-anchor="middle" style="font:800 12px Arial,sans-serif" fill="#1b2a44">2 L</text></g><text x="54" y="44" text-anchor="middle" style="font:800 13px Arial,sans-serif" fill="#1b2a44">+</text><rect x="12" y="88" width="84" height="17" rx="6" fill="#fff" stroke="#1b2a44"/><text x="54" y="100.5" text-anchor="middle" style="font:800 10.5px Arial,sans-serif" fill="#1b2a44">× 3 → 15 L</text><path d="M102 40h14m-5-5 5 5-5 5" fill="none" stroke="#1b2a44" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M155 16A33 33 0 0 0 155 82Z" fill="#488e3f"/><path d="M155 16A33 33 0 0 1 155 82Z" fill="#60a636"/><circle cx="155" cy="49" r="33" fill="none" stroke="#6b7280" stroke-width="1.8"/><path d="M155 16V82" stroke="#fff" stroke-width="1.8"/><text x="155" y="100" text-anchor="middle" style="font:800 10px Arial,sans-serif" fill="#1b2a44">même teinte ?</text>`};
MJ["grappin4"] = {cls:"4e", src:"data/mj-grappin.js", name:"MJ_GRAPPIN", wide:true,
  titre:"Le ninja au grappin", tag:"Pythagore", badge:"6 niveaux",
  desc:"Calcule la longueur exacte de la corde pour que le ninja saute de toit en toit sans finir dans les cartons.",
  intro:"La corde bien tendue est l'hypoténuse du triangle rectangle : calcule sa longueur avec le théorème de Pythagore, puis appuie sur Entrée. Trop courte, le ninja tombe ; trop longue, il s'écrase contre le mur !",
  ill:`<defs><linearGradient id="ill-grappin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#151d45"/><stop offset=".6" stop-color="#3b3474"/><stop offset="1" stop-color="#c96f6a"/></linearGradient></defs>
    <rect width="200" height="110" fill="url(#ill-grappin)"/><circle cx="178" cy="16" r="8" fill="#fff3c4"/>
    ${[[14,10],[40,22],[96,8],[120,26],[150,12]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1" fill="#fff" opacity=".7"/>`).join("")}
    <rect x="0" y="104" width="200" height="6" fill="#14182c"/>
    <rect x="0" y="30" width="58" height="80" fill="#2c3560"/><rect x="0" y="28" width="58" height="4" fill="#58628f"/>
    <rect x="142" y="66" width="58" height="44" fill="#3a3060"/><rect x="142" y="64" width="58" height="4" fill="#58628f"/>
    ${[[8,40],[24,40],[40,52],[8,64],[24,76],[40,88],[152,76],[168,88],[184,76]].map(([x,y])=>`<rect x="${x}" y="${y}" width="7" height="9" rx="1" fill="#ffd76a"/>`).join("")}
    <path d="M58 30L58 66L142 66" fill="none" stroke="#fff" stroke-width="1.6" stroke-dasharray="4 3.5"/>
    <path d="M58 58H66V66" fill="rgba(255,255,255,.18)" stroke="#fff" stroke-width="1.4"/>
    <path d="M58 30L142 66" stroke="#e9c46a" stroke-width="2"/>
    <g transform="translate(80 40.4)"><circle r="2.4" fill="#cfd6e2"/><path d="M-1 1L-2.5 7M1 1L2.5 7" stroke="#1b1e2b" stroke-width="2.6" stroke-linecap="round"/><circle cy="8" r="4.6" fill="#1b1e2b"/><rect x="-1" y="6" width="5.6" height="2.8" rx="1.4" fill="#f3cfaa"/><rect x="-4.6" y="3.6" width="9.2" height="1.9" fill="#e03131"/><path d="M-4.6 4.5q-4 -1 -7 1.5" stroke="#e03131" stroke-width="1.4" fill="none"/><rect x="-4" y="12" width="8" height="10" rx="3" fill="#1b1e2b"/><path d="M-2 21L-4 28M2 21L1 28" stroke="#1b1e2b" stroke-width="3" stroke-linecap="round"/></g>
    <rect x="92" y="70" width="40" height="15" rx="7.5" fill="#fff" stroke="#15213b"/><text x="112" y="81" text-anchor="middle" style="font:800 10px Arial,sans-serif" fill="#15213b">12 m</text>
    <rect x="18" y="41" width="34" height="15" rx="7.5" fill="#fff" stroke="#15213b"/><text x="35" y="52" text-anchor="middle" style="font:800 10px Arial,sans-serif" fill="#15213b">5 m</text>
    <rect x="98" y="26" width="34" height="15" rx="7.5" fill="#ffd43b" stroke="#15213b"/><text x="115" y="37" text-anchor="middle" style="font:800 10px Arial,sans-serif" fill="#15213b">? m</text>`};
MJ["graph3"] = {cls:"3e", src:"data/mj-graph.js", name:"MJ_GRAPH", wide:true,
  titre:"Graph Shooter", tag:"Fonctions affines", badge:"8 niveaux",
  desc:"Choisis a et b : ta droite traverse le plus de cibles possible d'un seul tir, en évitant les murs.",
  intro:"Écris la fonction f(x) = ax + b : le canon tire le long de sa droite et détruit les cibles qu'elle traverse. Plus tu touches de cibles d'un seul tir, plus tu marques de points.",
  ill:`<rect width="200" height="110" fill="#fbfcff"/>${[...Array(21)].map((_,i)=>`<path d="M${i*10} 0V110" stroke="#e8edf6"/>`).join("")}${[...Array(12)].map((_,i)=>`<path d="M0 ${i*10}H200" stroke="#e8edf6"/>`).join("")}
    <path d="M0 70H200M80 0V110" stroke="#3b4762" stroke-width="1.4"/>
    <rect x="133" y="8" width="7" height="34" rx="2" fill="#6b5643" stroke="#3f3125"/>
    <path d="M0 90L180 0" stroke="#7c3aed" stroke-width="2" stroke-dasharray="5 4" opacity=".3"/>
    <path d="M6 87L133 23.5" stroke="#7c3aed" stroke-width="3.5" stroke-linecap="round"/>
    ${[[40,70],[80,50]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="7" fill="#e03131" opacity=".22"/>`).join("")}
    ${[[40,70],[80,50]].map(([x,y],k)=>[...Array(7)].map((_,j)=>{const a=j*0.9+k;return `<circle cx="${(x+Math.cos(a)*11).toFixed(1)}" cy="${(y+Math.sin(a)*11).toFixed(1)}" r="2" fill="${j%2?"#f59f00":"#e03131"}"/>`;}).join("")).join("")}
    <circle cx="133" cy="23.5" r="4.5" fill="#fff" stroke="#7c3aed" stroke-width="2.4"/>
    ${[[160,30],[170,60],[120,90]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="8" fill="#e03131" stroke="#9b1c1c"/><circle cx="${x}" cy="${y}" r="5" fill="#fff"/><circle cx="${x}" cy="${y}" r="2.2" fill="#e03131"/>`).join("")}
    <g transform="translate(6 87) rotate(-26.57)"><rect x="0" y="-4" width="18" height="8" rx="2" fill="#4b4f6b"/><circle r="7" fill="#2b2f45"/></g>
    <rect x="8" y="8" width="84" height="20" rx="6" fill="#fff" stroke="#1b2a44" stroke-width="1.3"/><text x="50" y="22" text-anchor="middle" style="font:700 10.5px Arial,sans-serif" fill="#1b2a44">f(x) = 0,5x + 2</text>`};
MJ["bombe3"] = {cls:"3e", src:"data/mj-bombe.js", name:"MJ_BOMBE", wide:true,
  titre:"Désamorçage", tag:"Équations produit nul", badge:"7 niveaux",
  desc:"Une bombe, une équation, un compte à rebours : coupe tous les fils solutions, et seulement eux !",
  intro:"La bombe affiche une équation produit nul. Coupe tous les fils qui portent une solution, puis appuie sur « Désamorcer » avant la fin du compte à rebours.",
  ill:`<rect width="200" height="110" fill="#2a2f3d"/>
    <rect x="22" y="12" width="9" height="40" rx="3" fill="#c92a2a"/><rect x="169" y="12" width="9" height="40" rx="3" fill="#c92a2a"/>
    <rect x="34" y="6" width="132" height="54" rx="8" fill="#4b5163" stroke="#1d2029" stroke-width="1.5"/>
    <rect x="41" y="12" width="118" height="24" rx="4" fill="#0f2a1c" stroke="#0a1a12" stroke-width="1.2"/>
    <text x="100" y="28.5" text-anchor="middle" style="font:700 10.5px Arial,sans-serif" fill="#7dffb0">(2x − 6)(x + 4) = 0</text>
    <rect x="41" y="40" width="40" height="14" rx="3" fill="#1a0606"/><text x="61" y="51" text-anchor="middle" style="font:700 10px 'Courier New',monospace" fill="#ff4d4d">0:27</text>
    <circle cx="100" cy="47" r="3.5" fill="#e03131"/>
    <rect x="125" y="40" width="34" height="14" rx="4" fill="#e03131"/>
    ${[["#e03131",1],["#1c7ed6",0],["#f2b705",0],["#2f9e44",0]].map(([c,cut],i)=>{ const x0=58+i*28, x1=25+i*50;
      return cut===1 ? `<path d="M${x0} 60C${x0} 68 ${(x0+x1)/2} 70 ${(x0+x1)/2} 74" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M${(x0+x1)/2+2} 81C${(x0+x1)/2+2} 86 ${x1} 86 ${x1} 92" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`
      : `<path d="M${x0} 60C${x0} 72 ${x1} 78 ${x1} 92" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>`; }).join("")}
    ${[["x = 3",25,"#d3f9d8"],["x = −3",75,"#fff8e1"],["x = 6",125,"#fff8e1"],["x = −4",175,"#fff8e1"]].map(([t,x,f])=>`<rect x="${x-21}" y="92" width="42" height="15" rx="4" fill="${f}" stroke="#6b5a2e"/><text x="${x}" y="103" text-anchor="middle" style="font:700 9px Arial,sans-serif" fill="#1b2a44">${t}</text>`).join("")}`};
