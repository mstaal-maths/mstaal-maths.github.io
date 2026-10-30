/* Séances tableur : 6e (chapitre « Proportionnalité »), 5e (chapitre « Statistiques »), 4e (statistiques, diagrammes, calcul littéral) et 3e (fonctions, équations par essais), dans un tableur qui ressemble à un tableur en ligne classique.
   Les boutons inutiles pour la séance restent visibles mais grisés. Les formules s'écrivent comme dans un vrai tableur
   en français : =B1*1,2 · =SOMME(B1:B5) · =MOYENNE(…) · MIN · MAX (séparateur « ; »).
   Icônes : Material Symbols (Google), licence Apache 2.0. */
window.TABLEUR = (function(){
const IC = {"add":"M450-450H200v-60h250v-250h60v250h250v60H510v250h-60v-250Z","add_comment":"M450-400h60v-130h130v-60H510v-130h-60v130H320v60h130v130ZM80-80v-740q0-24 18-42t42-18h680q24 0 42 18t18 42v520q0 24-18 42t-42 18H240L80-80Zm134-220h606v-520H140v600l74-80Zm-74 0v-520 520Z","arrow_drop_down":"M480-360 280-559h400L480-360Z","border_all":"M120-120v-720h720v720H120Zm660-60v-270H510v270h270Zm0-600H510v270h270v-270Zm-600 0v270h270v-270H180Zm0 600h270v-270H180v270Z","cell_merge":"M130-130v-220h60v160h160v60H130Zm480 0v-60h160v-160h60v220H610ZM287-341l-43-42 67-67H90v-60h221l-67-67 43-42 139 139-139 139Zm386 0L534-480l139-139 43 42-67 67h221v60H649l67 67-43 42ZM130-610v-220h220v60H190v160h-60Zm640 0v-160H610v-60h220v220h-60Z","cloud_done":"m412-279 230-230-40-40-189 189-100-100-41 41 140 140ZM251-160q-88 0-149.5-61.5T40-371q0-78 50-137t127-71q20-97 94-158.5T482-799q112 0 189 81.5T748-522v24q72-2 122 46.5T920-329q0 69-50 119t-119 50H251Zm0-60h500q45 0 77-32t32-77q0-45-32-77t-77-32h-63v-84q0-91-61-154t-149-63q-88 0-149.5 63T267-522h-19q-62 0-105 43.5T100-371q0 63 44 107t107 44Zm229-260Z","decimal_decrease":"M626-94 480-240l146-146 42 42-73 74h285v60H595l73 74-42 42ZM80-440v-100h100v100H80Zm201-41q-41-41-41-99v-160q0-58 41-99t99-41q58 0 99 41t41 99v160q0 58-41 99t-99 41q-58 0-99-41Zm155.5-42.33Q460-546.67 460-580v-160q0-33.33-23.26-56.67Q413.47-820 380.24-820q-33.24 0-56.74 23.33Q300-773.33 300-740v160q0 33.33 23.26 56.67Q346.53-500 379.76-500q33.24 0 56.74-23.33Z","decimal_increase":"m734-94-42-42 73-74H480v-60h285l-73-74 42-42 146 146L734-94ZM80-440v-100h100v100H80Zm201-41q-41-41-41-99v-160q0-58 41-99t99-41q58 0 99 41t41 99v160q0 58-41 99t-99 41q-58 0-99-41Zm360 0q-41-41-41-99v-160q0-58 41-99t99-41q58 0 99 41t41 99v160q0 58-41 99t-99 41q-58 0-99-41Zm-204.5-42.33Q460-546.67 460-580v-160q0-33.33-23.26-56.67Q413.47-820 380.24-820q-33.24 0-56.74 23.33Q300-773.33 300-740v160q0 33.33 23.26 56.67Q346.53-500 379.76-500q33.24 0 56.74-23.33Zm360 0Q820-546.67 820-580v-160q0-33.33-23.26-56.67Q773.47-820 740.24-820q-33.24 0-56.74 23.33Q660-773.33 660-740v160q0 33.33 23.26 56.67Q706.53-500 739.76-500q33.24 0 56.74-23.33Z","filter_alt":"M440-160q-17 0-28.5-11.5T400-200v-240L161-745q-14-17-4-36t31-19h584q21 0 31 19t-4 36L560-440v240q0 17-11.5 28.5T520-160h-80Zm40-276 240-304H240l240 304Zm0 0Z","format_align_left":"M120-120v-60h720v60H120Zm0-165v-60h480v60H120Zm0-165v-60h720v60H120Zm0-165v-60h480v60H120Zm0-165v-60h720v60H120Z","format_bold":"M275-200v-560h228q66 0 114.5 42T666-612q0 38-21 70t-56 49v6q43 14 69.5 50t26.5 81q0 68-52.5 112T510-200H275Zm86-76h144q38 0 66-25t28-63q0-37-28-62t-66-25H361v175Zm0-247h136q35 0 60.5-23t25.5-58q0-35-25.5-58.5T497-686H361v163Z","format_color_fill":"m255-917 43-43 347.69 347.69Q669-589 669-555.37q0 33.62-23 56.37L468-321q-23 23-54 23t-54-23L182-499q-23-22.77-23-56.44 0-33.66 23-56.44L371-801 255-917Zm159 159L215-559h398L414-758Zm287 455.85Q680-323.3 680-353q0-17.35 8-37.17Q696-410 710-431q8-13 19.5-28t22.5-28q11 13 22.5 28t19.5 28q14 21 22 40.83 8 19.82 8 37.17 0 29.7-21.21 50.85-21.21 21.15-51 21.15T701-302.15ZM80 1v-121h800V1H80Z","format_color_text":"M80 0v-160h800V0H80Zm140-280 220-560h80l220 560h-75l-57-150H352l-57 150h-75Zm156-214h208L482-765h-4L376-494Z","format_italic":"M224-199v-80h134l139-409H338v-80h380v80H584L445-279h159v80H224Z","format_paint":"M437-80q-24 0-42-17.63-18-17.62-18-42.37v-200H220q-24 0-42-18t-18-42v-303q0-55 39.66-96 39.65-41 95.34-41h505v440q0 24-18 42t-42 18H583v200q0 24.75-18 42.37Q547-80 523-80h-86ZM220-554h520v-226h-56v171h-60v-171h-71v85h-60v-85H295q-32 0-53.5 23T220-703v149Zm0 154h520v-94H220v94Zm0 0v-94 94Z","format_strikethrough":"M80-410v-60h800v60H80Zm350-120v-170H200v-100h560v100H530v170H430Zm0 370v-190h100v190H430Z","functions":"M240-160v-63l275-257-275-257v-63h480v100H396l235 220-235 220h324v100H240Z","history":"M477-120q-149 0-253-105.5T120-481h60q0 125 86 213t211 88q127 0 215-89t88-216q0-124-89-209.5T477-780q-68 0-127.5 31T246-667h105v60H142v-208h60v106q52-61 123.5-96T477-840q75 0 141 28t115.5 76.5Q783-687 811.5-622T840-482q0 75-28.5 141t-78 115Q684-177 618-148.5T477-120Zm128-197L451-469v-214h60v189l137 134-43 43Z","insert_chart":"M284-277h60v-275h-60v275Zm166 0h60v-406h-60v406Zm166 0h60v-148h-60v148ZM180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0-600v600-600Z","link":"M450-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h170v60H280q-58.33 0-99.17 40.76-40.83 40.77-40.83 99Q140-422 180.83-381q40.84 41 99.17 41h170v60ZM325-450v-60h310v60H325Zm185 170v-60h170q58.33 0 99.17-40.76 40.83-40.77 40.83-99Q820-538 779.17-579q-40.84-41-99.17-41H510v-60h170q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H510Z","menu":"M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z","print":"M658-648v-132H302v132h-60v-192h476v192h-60Zm-518 60h680-680Zm599 95q12 0 21-9t9-21q0-12-9-21t-21-9q-12 0-21 9t-9 21q0 12 9 21t21 9Zm-81 313v-192H302v192h356Zm60 60H242v-176H80v-246q0-45.05 30.5-75.53Q141-648 186-648h588q45.05 0 75.53 30.47Q880-587.05 880-542v246H718v176Zm102-236v-186.21Q820-562 806.78-575q-13.23-13-32.78-13H186q-19.55 0-32.77 13.22Q140-561.55 140-542v186h102v-76h476v76h102Z","redo":"M392-200q-95 0-163.5-64T160-422q0-94 68.5-158T392-644h294L572-758l42-42 186 186-186 186-42-42 114-114H391q-70 0-120.5 46.5T220-422q0 69 50.5 115.5T391-260h310v60H392Z","remove":"M200-450v-60h560v60H200Z","search":"M796-121 533-384q-30 26-70 40.5T378-329q-108 0-183-75t-75-181q0-106 75-181t182-75q106 0 180.5 75T632-585q0 43-14 83t-42 75l264 262-44 44ZM377-389q81 0 138-57.5T572-585q0-81-57-138.5T377-781q-82 0-139.5 57.5T180-585q0 81 57.5 138.5T377-389Z","star":"m323-245 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm-90 125 65-281L80-590l288-25 112-265 112 265 288 25-218 189 65 281-247-149-247 149Zm247-355Z","text_rotation_none":"M160-196v-60h566l-52-52 42-42 124 124-124 124-42-42 52-52H160Zm126-204 164-440h59l164 440h-55l-43-122H384l-43 122h-55Zm114-166h160l-78-222h-4l-78 222Z","undo":"M259-200v-60h310q70 0 120.5-46.5T740-422q0-69-50.5-115.5T569-584H274l114 114-42 42-186-186 186-186 42 42-114 114h294q95 0 163.5 64T800-422q0 94-68.5 158T568-200H259Z","vertical_align_bottom":"M160-120v-60h640v60H160Zm320-120L286-434l43-43 121 121v-484h60v484l117-117 43 43-190 190Z","wrap_text":"M579-130 440-270l139-141 42 43-67 69h141q35 0 60-25.5t25-60.5q0-35-25-60t-60-25H160v-60h535q60 0 102.5 42.5T840-385q0 60-42.5 103T695-239H554l67 66-42 43ZM160-239v-60h200v60H160Zm0-461v-60h640v60H160Z","lock":"M220-80q-24.75 0-42.37-17.63Q160-115.25 160-140v-434q0-24.75 17.63-42.38Q195.25-634 220-634h70v-96q0-78.85 55.61-134.42Q401.21-920 480.11-920q78.89 0 134.39 55.58Q670-808.85 670-730v96h70q24.75 0 42.38 17.62Q800-598.75 800-574v434q0 24.75-17.62 42.37Q764.75-80 740-80H220Zm0-60h520v-434H220v434Zm314.5-162.03Q557-324.06 557-355q0-30-22.67-54.5t-54.5-24.5q-31.83 0-54.33 24.5t-22.5 55q0 30.5 22.67 52.5t54.5 22q31.83 0 54.33-22.03ZM350-634h260v-96q0-54.17-37.88-92.08-37.88-37.92-92-37.92T388-822.08q-38 37.91-38 92.08v96ZM220-140v-434 434Z","restart_alt":"M451-122q-123-10-207-101t-84-216q0-77 35.5-145T295-695l43 43q-56 33-87 90.5T220-439q0 100 66 173t165 84v60Zm60 0v-60q100-12 165-84.5T741-439q0-109-75.5-184.5T481-699h-20l60 60-43 43-133-133 133-133 43 43-60 60h20q134 0 227 93.5T801-439q0 125-83.5 216T511-122Z","check_circle":"m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z","lightbulb":"M422.5-103.5Q399-127 399-161h162q0 34-23.5 57.5T480-80q-34 0-57.5-23.5ZM318-223v-60h324v60H318Zm5-121q-66-43-104.5-107.5T180-597q0-122 89-211t211-89q122 0 211 89t89 211q0 81-38 145.5T637-344H323Zm22-60h271q48-32 76-83t28-110q0-99-70.5-169.5T480-837q-99 0-169.5 70.5T240-597q0 59 28 110t77 83Zm135 0Z"};
const ico = (n, cls="") => `<svg class="ti ${cls}" viewBox="0 -960 960 960" aria-hidden="true"><path d="${IC[n]}"/></svg>`;
const NC = 14; let NR = 24;
const CN = i => String.fromCharCode(65+i);
const key = (r,c) => CN(c)+(r+1);
const pos = k => { const m=/^([A-Z])(\d+)$/.exec(k); return m ? {r:+m[2]-1, c:m[1].charCodeAt(0)-65} : null; };
const inGrid = p => p && p.r>=0 && p.r<NR && p.c>=0 && p.c<NC;
let WIDTH = [];

/* ---------------- petits outils pour écrire les consignes ---------------- */
const cel = k => `<span class="cel">${k}</span>`;
const ENT = `<span class="kbd">Entrée ↵</span>`;
const CARRE = `<span class="mini" role="img" aria-label="petit carré bleu"></span>`;
const ol = (...l) => `<ol class="tetapes">${l.map(x=>`<li>${x}</li>`).join("")}</ol>`;
const voir = t => `<p class="tvoir"><b>Ce que tu dois voir :</b> ${t}</p>`;
const note = t => `<p class="tnote">${t}</p>`;

/* ---------------- données de départ de la séance ---------------- */
const START6 = {
  A1:"Nombre de croissants", B1:"1", C1:"2", D1:"3", E1:"4", F1:"5", G1:"10", H1:"20", I1:"50", A2:"Prix (en €)",
  A4:"Distance (en km)", B4:"1", C4:"2", D4:"5", E4:"10", F4:"20", G4:"50", A5:"Prix de la course (en €)", A6:"Prix ÷ distance",
  A8:"Nombre de personnes", B8:"1", C8:"2", D8:"4", E8:"6", F8:"8", G8:"10", H8:"30",
  A9:"Farine (en g)", D9:"200", A10:"Lait (en cl)", D10:"60", A11:"Sucre (en g)", D11:"100"
};

/* ---------------- moteur de formules ---------------- */
const ER = e => ({err:e});
function tokenize(s){
  const t=[]; let i=0;
  while(i<s.length){
    const ch=s[i], rest=s.slice(i); let m;
    if(/\s/.test(ch)){ i++; continue; }
    if(rest.startsWith("#REF!")) throw ER("#REF!");
    if((m=/^\d+(?:[.,]\d+)?/.exec(rest))){ t.push({k:"num", v:parseFloat(m[0].replace(",","."))}); i+=m[0].length; continue; }
    if((m=/^[A-ZÀ-Ü_]+(?=\s*\()/i.exec(rest))){ t.push({k:"fn", v:m[0].toUpperCase()}); i+=m[0].length; continue; }
    if((m=/^\$?[A-Z]+\$?\d+/i.exec(rest))){ t.push({k:"ref", v:m[0].toUpperCase().replace(/\$/g,"")}); i+=m[0].length; continue; }
    if((m=/^[A-ZÀ-Ü_]+/i.exec(rest))) throw ER("#NOM?");
    if((m=/^"[^"]*"/.exec(rest))){ t.push({k:"str", v:m[0].slice(1,-1)}); i+=m[0].length; continue; }
    if(ch===","){ t.push({k:";"}); i++; continue; }
    if("+-*/^();:".includes(ch)){ t.push({k:ch}); i++; continue; }
    throw ER("#ERREUR!");
  }
  return t;
}
function parse(T){
  let p=0; const peek=()=>T[p], is=k=>T[p]&&T[p].k===k;
  const eat=k=>{ if(is(k)) return T[p++]; throw ER("#ERREUR!"); };
  function expr(){ let a=term(); while(is("+")||is("-")){ const o=T[p++].k; a={op:o, a, b:term()}; } return a; }
  function term(){ let a=pw(); while(is("*")||is("/")){ const o=T[p++].k; a={op:o, a, b:pw()}; } return a; }
  function pw(){ let a=un(); while(is("^")){ p++; a={op:"^", a, b:un()}; } return a; }
  function un(){ if(is("-")||is("+")){ const o=T[p++].k, a=un(); return o==="-"?{op:"neg", a}:a; } return prim(); }
  function prim(){
    const t=T[p++]; if(!t) throw ER("#ERREUR!");
    if(t.k==="num") return {num:t.v};
    if(t.k==="str") return {str:t.v};
    if(t.k==="ref"){ if(is(":")){ p++; return {range:[t.v, eat("ref").v]}; } return {ref:t.v}; }
    if(t.k==="fn"){ eat("("); const args=[]; if(!is(")")){ args.push(expr()); while(is(";")){ p++; args.push(expr()); } } eat(")"); return {fn:t.v, args}; }
    if(t.k==="("){ const e=expr(); eat(")"); return e; }
    throw ER("#ERREUR!");
  }
  if(!T.length) throw ER("#ERREUR!");
  const e=expr(); if(p<T.length) throw ER("#ERREUR!"); return e;
}
const sum = l => l.reduce((s,x)=>s+x, 0);
const FN = {
  SOMME:sum, SUM:sum,
  MOYENNE:l=>{ if(!l.length) throw ER("#DIV/0!"); return sum(l)/l.length; }, AVERAGE:l=>FN.MOYENNE(l),
  MIN:l=>l.length?Math.min(...l):0, MAX:l=>l.length?Math.max(...l):0
};
let CELLS={}, VAL={}; const COMP=new Set();
function constant(raw){
  if(/^[-+]?\d+(?:[.,]\d+)?$/.test(raw)) return parseFloat(raw.replace(",","."));
  if(/^[-+]?\d{1,3}(?: \d{3})+(?:[.,]\d+)?$/.test(raw)) return parseFloat(raw.replace(/ /g,"").replace(",","."));
  return raw;
}
function value(k){
  if(k in VAL) return VAL[k];
  if(COMP.has(k)) throw ER("#REF!");
  const raw=(CELLS[k]||"").trim(); let v;
  if(raw==="") v=null;
  else if(raw[0]==="="){
    COMP.add(k);
    try{ v=ev(parse(tokenize(raw.slice(1)))); if(v===null) v=0; if(typeof v==="number" && !isFinite(v)) v=ER("#NUM!"); }
    catch(e){ v = e && e.err ? e : ER("#ERREUR!"); }
    COMP.delete(k);
  } else v=constant(raw);
  VAL[k]=v; return v;
}
function num(v){ if(v===null) return 0; if(typeof v==="number") return v; if(v && v.err) throw v; throw ER("#VALEUR!"); }
function cellsIn([a,b]){ const p=pos(a), q=pos(b); if(!inGrid(p)||!inGrid(q)) throw ER("#REF!"); const out=[];
  for(let r=Math.min(p.r,q.r); r<=Math.max(p.r,q.r); r++) for(let c=Math.min(p.c,q.c); c<=Math.max(p.c,q.c); c++) out.push(key(r,c)); return out; }
function ev(n){
  if("num" in n) return n.num;
  if("str" in n) return n.str;
  if(n.ref){ if(!inGrid(pos(n.ref))) throw ER("#REF!"); const v=value(n.ref); if(v && v.err) throw v; return v; }
  if(n.range) throw ER("#VALEUR!");
  if(n.op){
    if(n.op==="neg") return -num(ev(n.a));
    const a=num(ev(n.a)), b=num(ev(n.b));
    if(n.op==="+") return a+b; if(n.op==="-") return a-b; if(n.op==="*") return a*b;
    if(n.op==="/"){ if(b===0) throw ER("#DIV/0!"); return a/b; }
    return Math.pow(a,b);
  }
  if(n.fn){
    const F=FN[n.fn]; if(!F) throw ER("#NOM?");
    const l=[];
    n.args.forEach(a=>{ if(a.range) cellsIn(a.range).forEach(k=>{ const v=value(k); if(v && v.err) throw v; if(typeof v==="number") l.push(v); }); else l.push(num(ev(a))); });
    return F(l);
  }
  throw ER("#ERREUR!");
}
function recalc(){ VAL={}; for(let r=0;r<NR;r++) for(let c=0;c<NC;c++) value(key(r,c)); }
const fmt = x => String(Number(x.toPrecision(12))).replace(".",",").replace("-","−");
const show = v => v===null ? "" : v.err ? v.err : typeof v==="number" ? fmt(v) : v;
/* mise en forme d'une saisie : formule en majuscules (hors texte entre guillemets) */
const normalize = raw => raw[0]==="=" ? raw.replace(/"[^"]*"|[^"]+/g, m=>m[0]==='"'?m:m.toUpperCase()) : raw;
/* recopie : les références relatives sont décalées, celles avec $ restent fixes */
function shift(raw, dr, dc){
  if(!raw || raw[0]!=="=") return raw;
  return raw.replace(/"[^"]*"|(\$?)([A-Z])(\$?)(\d+)/g, (m, a, col, b, row)=>{
    if(m[0]==='"') return m;
    const c = a ? col.charCodeAt(0)-65 : col.charCodeAt(0)-65+dc, r = b ? +row-1 : +row-1+dr;
    return inGrid({r,c}) ? `${a}${CN(c)}${b}${r+1}` : "#REF!";
  });
}
const refsOf = raw => raw && raw[0]==="=" ? (raw.slice(1).replace(/"[^"]*"/g,"").toUpperCase().match(/\$?[A-Z]\$?\d+/g)||[]).map(s=>s.replace(/\$/g,"")) : [];

/* ---------------- activité : 7 missions ---------------- */
const V = k => VAL[k];
const isF = k => (CELLS[k]||"").trim()[0]==="=";
const eq = (a,b) => typeof a==="number" && Math.abs(a-b)<1e-9;
const nb = s => { const t=String(s).replace(/€|\s/g,"").replace(",","."); return t!=="" && isFinite(+t) ? +t : NaN; };
/* vérifie une ligne de formules : cols, ligne r, valeur attendue f(c) */
function ligne(r, cols, attendu, ref, conseil){
  for(const c of cols){
    const k=key(r,c), raw=(CELLS[k]||"").trim();
    if(raw==="") return `La cellule ${k} est encore vide. ${conseil}`;
    if(!isF(k)) return `En ${k}, tu as tapé un nombre : il faut une <b>formule</b>, qui commence par le signe =. ${conseil}`;
    if(/[x×]/i.test(raw.replace(/MAX/gi,""))) return `En ${k}, le signe × s'écrit avec une étoile dans un tableur : <b>*</b>.`;
    if(ref && !refsOf(raw).includes(ref(c))) return `La formule de ${k} doit utiliser la cellule ${ref(c)}.`;
    const v=V(k), a=attendu(c);
    if(v && v.err) return `En ${k}, le tableur affiche l'erreur ${v.err} : vérifie ta formule.`;
    if(!eq(v,a)) return `En ${k}, le tableur affiche ${show(v)}, mais il faudrait ${fmt(a)}.`;
  }
  return true;
}
const COLS = (a,b) => { const l=[]; for(let c=a;c<=b;c++) l.push(c); return l; };
const M6 = [
 {t:"Se repérer dans le tableur", cible:["J1"],
  h:`<p>Un tableur est un grand tableau. Chaque case s'appelle une <b>cellule</b>.</p>
     <p>Chaque cellule a un <b>nom</b> : la <b>lettre de sa colonne</b> (écrite en gris, en haut) puis le <b>numéro de sa ligne</b> (écrit en gris, à gauche).</p>
     ${note(`Exemple : la cellule ${cel("B1")} est dans la colonne B et dans la ligne 1. Elle contient le nombre 1.`)}
     <p><b>a)</b> Trouve le nom de la cellule qui contient le nombre <b>30</b>.</p>
     ${ol("Cherche le nombre 30 dans le tableau (il n'y en a qu'un).", "Clique <b>une fois</b> dessus : la cellule est entourée en bleu.", "Regarde en haut à gauche, à côté de <b><i>fx</i></b> : le nom de la cellule est écrit.", "Écris ce nom dans la case ci-dessous.")}`,
  q:{lab:"Le nom de la cellule :", ok:s=>s.replace(/\s/g,"").toUpperCase()==="H8"},
  h2:`<p><b>b)</b> Écris le nombre <b>100</b> dans la cellule ${cel("J1")} (elle est surlignée en jaune).</p>
     ${ol(`Clique sur la cellule ${cel("J1")} : colonne J, ligne 1, à droite du 50.`, "Tape <b>100</b> au clavier.", `Appuie sur la touche ${ENT} pour valider.`)}
     ${note("Tu t'es trompé ? Clique sur la flèche ↶ (« Annuler »), en haut à gauche de la barre d'outils.")}`,
  test:()=> eq(V("J1"),100) || "Écris 100 dans la cellule J1 : colonne J, ligne 1.",
  aide:"Le nom d'une cellule commence par la lettre de la colonne (en haut), puis le numéro de la ligne (à gauche).",
  bravo:"Tu sais maintenant repérer une cellule."},
 {t:"Ta première formule", cible:["B2"],
  h:`<p>Un croissant coûte <b>1,20 €</b>. On veut que le tableur calcule le prix <b>à notre place</b> : pour cela, on écrit une <b>formule</b>.</p>
     ${note(`Une formule commence <b>toujours</b> par le signe <b>=</b>.<br>Dans un tableur, le signe × s'écrit <b>*</b> (l'étoile).<br>1,20 s'écrit <b>1,2</b> (avec une virgule).`)}
     ${ol(`Clique sur la cellule ${cel("B2")}, juste sous le 1.`, "Tape le signe <b>=</b>", `Clique sur la cellule ${cel("B1")} : « B1 » s'écrit tout seul dans ta formule.`, "Tape <b>*1,2</b>", `Ta formule est maintenant <b>=B1*1,2</b>. Appuie sur ${ENT}.`)}
     ${voir(`la cellule ${cel("B2")} affiche <b>1,2</b> : c'est le prix d'un croissant. Si tu cliques sur B2, ta formule apparaît en haut, à côté de <i>fx</i>.`)}`,
  test:()=> ligne(1,[1],c=>1.2*V(key(0,c)),c=>key(0,c),""),
  aide:"Le prix, c'est le nombre de croissants multiplié par 1,20. Dans B2, écris : =B1*1,2",
  bravo:"Ta formule calcule 1 × 1,20 = 1,2. Sélectionne B2 : dans la barre en haut, on voit la formule ; dans la cellule, on voit le résultat."},
 {t:"Recopier une formule", cible:["C2:J2"],
  h:`<p>Il faudrait écrire une formule pour 2 croissants, pour 3 croissants, pour 4… C'est long ! Le tableur peut <b>recopier</b> la formule tout seul.</p>
     ${ol(`Clique <b>une fois</b> sur la cellule ${cel("B2")}.`, `Regarde le coin <b>en bas à droite</b> de la cellule : il y a un petit carré bleu ${CARRE}.`, "Pose la souris sur ce petit carré : la flèche se transforme en croix <b>+</b>.", `<b>Garde le bouton de la souris appuyé</b> et glisse vers la droite jusqu'à la cellule ${cel("J2")}.`, "Lâche le bouton.")}
     ${voir(`toute la ligne 2 est remplie. Pour 10 croissants, le tableur affiche <b>12</b> (12 €).`)}`,
  test:()=> ligne(1,COLS(2,9),c=>1.2*num(V(key(0,c))),c=>key(0,c),"Sélectionne B2, puis fais glisser le petit carré bleu jusqu'à J2."),
  aide:"Clique d'abord une fois sur B2 pour la sélectionner. Le carré bleu est dans le coin en bas à droite. Garde le bouton de la souris appuyé (ou ton doigt sur l'écran) pendant que tu le fais glisser jusqu'à J2.",
  bravo:"Clique sur E2 : la formule est devenue =E1*1,2. En recopiant, le tableur a adapté la formule à chaque colonne."},
 {t:"Le tableur recalcule tout seul", cible:["J1","J2"],
  h:`<p>Quand on change un nombre, le tableur refait <b>tous les calculs tout seul</b>. Essayons !</p>
     ${ol(`Clique sur la cellule ${cel("J1")} (elle contient 100).`, "Tape <b>365</b> : il remplace le 100. (365, c'est un croissant par jour pendant un an !)", `Appuie sur ${ENT}.`, `Regarde la cellule ${cel("J2")}, juste en dessous : le prix a changé tout seul !`, "Écris ce prix dans la case ci-dessous.")}`,
  q:{lab:"365 croissants coûtent (en €) :", ok:s=>eq(nb(s),438)},
  test:()=>{ if(!eq(V("J1"),365)) return "Écris 365 dans la cellule J1."; const l=ligne(1,[9],()=>438,()=>"J1",""); return l===true ? true : "La formule de J2 a disparu : recopie de nouveau la formule de B2 jusqu'à J2."; },
  aide:"Quand on change un nombre, toutes les formules qui l'utilisent sont recalculées. Lis le résultat dans la cellule J2.",
  bravo:"365 × 1,20 = 438 €. Pas besoin de refaire le calcul : le tableur recalcule tout seul dès qu'on change un nombre."},
 {t:"Le prix d'une course de taxi", cible:["B5:G5"],
  h:`<p>Une course de taxi coûte :</p>
     <ul class="tliste"><li><b>3 €</b> dès qu'on monte dans le taxi (on appelle ça la « prise en charge ») ;</li><li>plus <b>1,50 €</b> pour chaque kilomètre.</li></ul>
     ${note("Exemple : pour 2 km, on paie 2 × 1,50 + 3 = 6 €.")}
     ${ol(`Clique sur la cellule ${cel("B5")}.`, `Écris une formule qui calcule le prix pour la distance écrite en ${cel("B4")}. Elle ressemble à l'exemple, avec <b>B4</b> à la place de 2. N'oublie pas le signe = au début !`, `Appuie sur ${ENT} : la cellule B5 doit afficher <b>4,5</b>.`, `Recopie la formule jusqu'à ${cel("G5")} avec le petit carré bleu ${CARRE}.`)}
     ${voir(`pour 2 km, la cellule ${cel("C5")} affiche <b>6</b>.`)}`,
  test:()=>{ const r=ligne(4,COLS(1,6),c=>1.5*V(key(3,c))+3,c=>key(3,c),"Écris la formule en B5, puis recopie-la jusqu'à G5.");
    if(r!==true && eq(V("B5"),1.5)) return "Il manque la prise en charge de 3 € dans ta formule.";
    if(r!==true && eq(V("B5"),6)) return "Attention aux priorités : le tableur calcule les multiplications avant les additions, comme toi ! Inutile de mettre des parenthèses."; return r; },
  aide:"Pour 1 km : 1 × 1,50 + 3 = 4,50 €. Dans B5, écris : =B4*1,5+3",
  bravo:"Une course de 10 km coûte 18 €, une course de 20 km coûte 33 €."},
 {t:"Est-ce proportionnel ?", cible:["B6:G6"],
  h:`<p>On veut savoir si le prix de la course est <b>proportionnel</b> à la distance.</p>
     ${note("Rappel : dans un tableau de proportionnalité, on passe de la 1<sup>re</sup> ligne à la 2<sup>e</sup> en multipliant <b>toujours par le même nombre</b>. Pour le vérifier, on divise chaque prix par la distance : si on trouve <b>toujours le même résultat</b>, c'est proportionnel.")}
     ${ol(`Clique sur la cellule ${cel("B6")}.`, `Écris la formule <b>=B5/B4</b> (dans un tableur, le signe ÷ s'écrit <b>/</b>), puis appuie sur ${ENT}.`, `Recopie la formule jusqu'à ${cel("G6")} avec le petit carré bleu ${CARRE}.`, "Compare les nombres de la ligne 6 : sont-ils tous égaux ?", "Réponds à la question ci-dessous.")}`,
  q:{lab:"Ma réponse :", choix:["Oui","Non"], ok:s=>s==="Non"},
  test:()=> ligne(5,COLS(1,6),c=>V(key(4,c))/V(key(3,c)),c=>key(4,c),"Le signe ÷ s'écrit / dans un tableur : =B5/B4"),
  aide:"Dans un tableau de proportionnalité, on passe toujours de la première ligne à la deuxième en multipliant par le même nombre. Les quotients de la ligne 6 sont-ils tous égaux ?",
  bravo:"Les quotients ne sont pas tous égaux (4,5 ; 3 ; 2,1…) : le prix n'est <b>pas proportionnel</b> à la distance, à cause des 3 € de prise en charge. Pour les croissants, le quotient vaut toujours 1,2 : c'est le <b>coefficient de proportionnalité</b>."},
 {t:"Défi : la recette de crêpes", defi:true, cible:["B9:H11"],
  h:`<p>Pour faire des crêpes pour <b>4 personnes</b>, il faut <b>200 g</b> de farine, <b>60 cl</b> de lait et <b>100 g</b> de sucre. Ces nombres sont déjà écrits dans la colonne D.</p>
     <p>Remplis les quantités pour 1, 2, 6, 8, 10 et 30 personnes (les cellules en jaune).</p>
     ${ol("Calcule d'abord <b>dans ta tête</b> la quantité de farine pour <b>1 personne</b> : 200 g ÷ 4.", `En ${cel("B9")}, écris une formule qui multiplie le nombre de personnes (${cel("B8")}) par cette quantité.`, `Recopie la formule jusqu'à ${cel("H9")}.`, "Fais pareil pour le lait (ligne 10) et pour le sucre (ligne 11).")}
     ${note("La recopie remplace aussi les nombres de la colonne D. Ce n'est pas grave si ta formule est juste : le tableur doit retrouver 200, 60 et 100.")}`,
  test:()=>{
    const per=[50,15,25];
    for(let i=0;i<3;i++){ const k=key(8+i,3); if(!eq(V(k),4*per[i])) return `La cellule ${k} devait rester ${4*per[i]} (la quantité pour 4 personnes), mais ta recopie l'a remplacée. Clique sur la flèche « Annuler » en haut à gauche, puis essaie une autre formule : commence par calculer la quantité pour 1 personne.`; }
    for(let i=0;i<3;i++){ const r=8+i;
      for(const c of COLS(1,7)){ const k=key(r,c), raw=(CELLS[k]||"").trim(), a=per[i]*V(key(7,c));
        if(raw==="") return `La cellule ${k} est encore vide.`;
        if(c!==3 && !isF(k)) return `En ${k}, tu as tapé un nombre : utilise une formule, recopiée vers la droite, comme pour les croissants.`;
        const v=V(k); if(v && v.err) return `En ${k}, le tableur affiche l'erreur ${v.err} : vérifie ta formule.`;
        if(!eq(v,a)) return `En ${k}, le tableur affiche ${show(v)}, mais il faudrait ${fmt(a)}.`; } }
    return true; },
  aide:"Commence par calculer la quantité pour 1 personne : 200 g ÷ 4 = 50 g de farine. Pour B8 personnes, il faut donc B8 × 50 g : en B9, écris =B8*50 et recopie jusqu'à H9. Fais pareil pour le lait et le sucre.",
  bravo:"Pour 30 personnes, il faut 1 500 g de farine, 450 cl de lait et 750 g de sucre. Bravo, tu as terminé la séance !"}
];


/* ---------------- 5e : statistiques ---------------- */
const SPORTS=["Football","Basket","Natation","Danse","Handball"], EFF=[8,5,4,6,2];
const START5 = {A1:"Sport préféré", B1:"Effectif", C1:"Fréquence", D1:"Pourcentage (%)", A7:"Total",
  A9:"Jour", B9:"Lundi", C9:"Mardi", D9:"Mercredi", E9:"Jeudi", F9:"Vendredi", G9:"Samedi", H9:"Dimanche",
  A10:"Température (en °C)", B10:"23", C10:"26", D10:"31", E10:"28", F10:"22", G10:"25", H10:"27", A11:"Moyenne",
  A13:"Contrôle", B13:"1", C13:"2", D13:"3", E13:"4", F13:"5", G13:"Moyenne", A14:"Notes de Léa", B14:"12", C14:"9", D14:"15", E14:"14"};
SPORTS.forEach((x,i)=>{ START5["A"+(i+2)]=x; START5["B"+(i+2)]=String(EFF[i]); });
/* vérifie une liste de cellules (formules attendues) */
function cellsOk(keys, attendu, conseil, special){
  for(const k of keys){
    const raw=(CELLS[k]||"").trim();
    if(raw==="") return `La cellule ${k} est encore vide. ${conseil}`;
    if(!isF(k)) return `En ${k}, tu as tapé un nombre : il faut une <b>formule</b>, qui commence par le signe =. ${conseil}`;
    if(/[x×÷]/i.test(raw.replace(/MAX|MOYENNE|SOMME|MIN/gi,""))) return `En ${k}, dans un tableur, × s'écrit <b>*</b> et ÷ s'écrit <b>/</b>.`;
    const v=V(k), a=attendu(k);
    if(special){ const sp=special(k,v); if(sp) return sp; }
    if(v && v.err) return `En ${k}, le tableur affiche l'erreur ${v.err} : vérifie ta formule.`;
    if(!eq(v,a)) return `En ${k}, le tableur affiche ${show(v)}, mais il faudrait ${fmt(a)}.`;
  }
  return true;
}
const ROWS = (c,a,b) => COLS(a,b).map(r=>key(r,c));
function chartOk(){
  if(!S.chart) return "Sélectionne les cellules de A1 à B6, puis clique sur le bouton « Insérer un graphique » de la barre d'outils.";
  const d=chartData(S.chart);
  if(!d) return "Le graphique n'utilise pas les bonnes cellules : supprime-le (croix), sélectionne A1 à B6, puis recommence.";
  if(d.labels.includes("Total")) return "Ton graphique contient la ligne « Total » : elle ne doit pas y être. Supprime le graphique (croix), sélectionne seulement A1 à B6, puis recommence.";
  if(d.labels.join()!==SPORTS.join() || d.vals.join()!==EFF.join()) return "Le graphique doit montrer les 5 sports et leurs effectifs : supprime-le (croix), sélectionne A1 à B6, puis recommence.";
  return true;
}
const M5 = [
 {t:"L'effectif total", cible:["B7"],
  h:`<p>On a demandé à des élèves de 5e leur sport préféré. La colonne B donne l'<b>effectif</b> de chaque sport : le nombre d'élèves qui l'ont choisi.</p>
     <p>L'<b>effectif total</b>, c'est le nombre total d'élèves interrogés : on additionne tous les effectifs. Le tableur a une fonction pour ça : <b>SOMME</b>.</p>
     ${ol(`Clique sur la cellule ${cel("B7")}, à côté de « Total ».`, "Tape <b>=SOMME(</b>", `Avec la souris, clique sur ${cel("B2")} et, <b>sans lâcher le bouton</b>, glisse jusqu'à ${cel("B6")} : « B2:B6 » s'écrit dans ta formule.`, `Tape <b>)</b> pour fermer la parenthèse, puis appuie sur ${ENT}.`)}
     ${note("Le signe « <b>:</b> » veut dire « jusqu'à » : B2:B6, ce sont les cellules de B2 jusqu'à B6.")}
     ${voir(`la cellule ${cel("B7")} affiche le nombre total d'élèves.`)}`,
  test:()=>{ const r=cellsOk(["B7"],()=>25,""); if(r!==true && !isF("B7") && CELLS.B7) return r; if(r!==true && typeof V("B7")==="number") return `Ta somme donne ${show(V("B7"))} : vérifie que tu as bien pris les cellules de B2 à B6.`; return r; },
  aide:"Dans B7, la formule complète est : =SOMME(B2:B6). Le signe « : » veut dire « jusqu'à ».",
  bravo:"25 élèves ont répondu. =SOMME(B2:B6) additionne toutes les cellules de B2 jusqu'à B6."},
 {t:"Les fréquences", cible:["C2:C6"],
  h:`<p>La <b>fréquence</b> d'un sport, c'est la part des élèves qui l'ont choisi :</p>
     ${note("fréquence = effectif ÷ effectif total<br>Exemple : 8 élèves sur 25 ont choisi le football, donc sa fréquence est 8 ÷ 25.")}
     ${ol(`Clique sur la cellule ${cel("C2")}.`, `Écris une formule qui divise ${cel("B2")} par ${cel("B7")} (le signe ÷ s'écrit <b>/</b>), puis appuie sur ${ENT}. Tu dois lire <b>0,32</b>.`, `Recopie la formule vers le bas jusqu'à ${cel("C6")} avec le petit carré bleu ${CARRE}.`, "Clique sur <b>Vérifier</b>. Si tu vois <b>#DIV/0!</b> dans le tableau, pas de panique : le message t'explique comment faire.")}`,
  test:()=> cellsOk(ROWS(2,1,5), k=>EFF[pos(k).r-1]/25, "Écris la formule en C2, puis recopie-la jusqu'à C6.",
     (k,v)=> v && v.err==="#DIV/0!" && k!=="C2" ? `En ${k}, le tableur affiche #DIV/0! (division par zéro). En recopiant vers le bas, B7 est devenu B8, B9… qui sont vides ! Pour <b>bloquer</b> la cellule B7 pendant la recopie, écris <b>$B$7</b> : en C2, =B2/$B$7. Puis recopie de nouveau.` : null),
  aide:"Pour le football : 8 ÷ 25. En C2, écris =B2/$B$7 : les signes $ empêchent le tableur de décaler B7 quand on recopie.",
  bravo:"Le football a une fréquence de 8 ÷ 25 = 0,32, c'est-à-dire 8/25. Les signes $ servent à bloquer une cellule pendant une recopie."},
 {t:"Les pourcentages", cible:["D2:D6"],
  h:`<p>Une fréquence peut aussi s'écrire en <b>pourcentage</b> : on la multiplie par 100.</p>
     ${note("Exemple : 0,32 × 100 = 32, donc la fréquence du football est 32 %.")}
     ${ol(`Clique sur la cellule ${cel("D2")}.`, `Écris une formule qui multiplie ${cel("C2")} par 100, puis appuie sur ${ENT}. Tu dois lire <b>32</b>.`, `Recopie la formule jusqu'à ${cel("D6")}.`, "Lis le pourcentage de la danse et réponds à la question ci-dessous.")}`,
  q:{lab:"Pourcentage des élèves qui préfèrent la danse :", ok:s=>eq(nb(String(s).replace("%","")),24)},
  test:()=> cellsOk(ROWS(3,1,5), k=>EFF[pos(k).r-1]*4, "Écris la formule en D2, puis recopie-la jusqu'à D6."),
  aide:"En D2, écris =C2*100 puis recopie jusqu'à D6. Lis ensuite le résultat sur la ligne de la danse.",
  bravo:"6 élèves sur 25, c'est 24 %. Si tu calcules =SOMME(D2:D6), tu trouves 100 : tous les élèves sont comptés."},
 {t:"Un diagramme en barres", cible:["A1:B6"],
  h:`<p>Le tableur peut dessiner un diagramme tout seul à partir d'un tableau.</p>
     ${ol(`Clique sur ${cel("A1")} et, <b>sans lâcher le bouton</b>, glisse jusqu'à ${cel("B6")} : les cellules deviennent bleues. Ne prends pas la ligne « Total » !`, `Dans la barre d'outils, clique sur le bouton <b>« Insérer un graphique »</b> <span class="tico">${ico("insert_chart")}</span> (vers la droite de la barre).`, "Le diagramme apparaît. Vérifie que « <b>Barres</b> » est choisi en haut du graphique.")}
     ${voir("un diagramme avec une barre pour chaque sport. La hauteur de la barre, c'est l'effectif.")}`,
  test:()=>{ const r=chartOk(); if(r!==true) return r; return S.chart.type==="barres" || "Dans le graphique, choisis « Barres »."; },
  aide:"La sélection doit contenir la colonne des sports (A) et celle des effectifs (B), mais pas la ligne Total. Le bouton du graphique est dans la barre d'outils, juste avant l'entonnoir.",
  bravo:"Le tableur a dessiné le diagramme tout seul à partir du tableau : la hauteur de chaque barre est l'effectif du sport."},
 {t:"Un diagramme circulaire", cible:[],
  h:`<p>Un autre diagramme montre la <b>part</b> de chaque sport dans la classe : le diagramme circulaire.</p>
     ${ol("En haut du graphique, clique sur « <b>Circulaire</b> ».", "Observe : chaque sport est une part du disque. Plus la part est grande, plus le sport a été choisi.", "Réponds à la question ci-dessous.")}
     ${note("Un tiers du disque, c'est une part quand on coupe le disque en 3 parts égales.")}`,
  q:{lab:"Quel sport est choisi par presque un tiers des élèves ?", choix:SPORTS, ok:s=>s==="Football"},
  test:()=>{ const r=chartOk(); if(r!==true) return r; return S.chart.type==="circulaire" || "Dans le graphique, clique sur « Circulaire »."; },
  aide:"Un tiers du disque, c'est un peu plus que le quart. Regarde aussi les pourcentages de la colonne D : 1/3 ≈ 33 %.",
  bravo:"Le football représente 32 % des élèves, presque un tiers du disque. Le diagramme circulaire montre les <b>parts d'un tout</b> ; le diagramme en barres sert plutôt à <b>comparer des effectifs</b>."},
 {t:"La moyenne", cible:["B11"],
  h:`<p>La ligne 10 donne la température la plus haute de chaque jour d'une semaine.</p>
     ${note("moyenne = somme de toutes les valeurs ÷ nombre de valeurs<br>Le tableur a une fonction pour ça : <b>MOYENNE</b>.")}
     ${ol(`Clique sur la cellule ${cel("B11")}.`, "Tape <b>=MOYENNE(</b>", `Avec la souris, sélectionne les cellules de ${cel("B10")} jusqu'à ${cel("H10")}.`, `Tape <b>)</b> puis appuie sur ${ENT}.`, "Compte les jours où il a fait <b>plus chaud que la moyenne</b>, puis réponds à la question ci-dessous.")}`,
  q:{lab:"Nombre de jours plus chauds que la moyenne :", ok:s=>eq(nb(s),3)},
  test:()=>{ const r=cellsOk(["B11"],()=>26,""); if(r!==true && typeof V("B11")==="number" && isF("B11")) return `Ta formule donne ${show(V("B11"))} : vérifie que tu as bien pris les 7 jours, de B10 à H10.`; return r; },
  aide:"La formule est =MOYENNE(B10:H10). On aurait aussi pu calculer =SOMME(B10:H10)/7. Compare ensuite chaque température à la moyenne.",
  bravo:"La moyenne est 26 °C : c'est la somme des températures (182) divisée par le nombre de jours (7). Trois jours ont été plus chauds : mercredi (31 °C), jeudi (28 °C) et dimanche (27 °C)."},
 {t:"Défi : la note de Léa", defi:true, cible:["F14","G14"],
  h:`<p>Léa a eu 12, 9, 15 et 14 à ses quatre premiers contrôles (ligne 14). Elle veut <b>13 de moyenne</b> après le 5<sup>e</sup> contrôle. Quelle note doit-elle avoir ?</p>
     ${ol(`En ${cel("G14")}, écris <b>=MOYENNE(B14:F14)</b> puis appuie sur ${ENT}. La cellule F14 est encore vide : ce sera la note du 5<sup>e</sup> contrôle.`, `Tape une note au hasard en ${cel("F14")}, par exemple 10, puis appuie sur ${ENT} : la moyenne change !`, "Essaie d'autres notes en F14 jusqu'à ce que la moyenne soit <b>exactement 13</b>.", "Écris la note trouvée dans la case ci-dessous.")}`,
  q:{lab:"La note qu'il faut à Léa :", ok:s=>eq(nb(s),15)},
  test:()=>{ const raw=(CELLS.G14||"").trim();
    if(!raw) return "Commence par la formule de la moyenne en G14.";
    if(!isF("G14")) return "En G14, il faut une formule : =MOYENNE(B14:F14).";
    if(!refsOf(raw).includes("F14") && !/F14/.test(raw)) return "La formule de G14 doit prendre les 5 notes, de B14 jusqu'à F14 (même si F14 est encore vide).";
    if(!eq(V("F14"),15) || !eq(V("G14"),13)) return `Avec ${CELLS.F14?show(V("F14")):"rien"} en F14, la moyenne est ${show(V("G14"))}. Change la note en F14 jusqu'à obtenir 13.`;
    return true; },
  aide:"Écris =MOYENNE(B14:F14) en G14. Tape ensuite une note en F14 (par exemple 10) : la moyenne change. Monte ou descends la note jusqu'à obtenir exactement 13.",
  bravo:"Avec 15, la moyenne est (12 + 9 + 15 + 14 + 15) ÷ 5 = 65 ÷ 5 = 13. Le tableur permet de tester des valeurs très vite. Bravo, tu as terminé la séance !"}
];
const RET6 = `<li>Une formule commence toujours par le signe <b>=</b>. Le signe × s'écrit <b>*</b> et le signe ÷ s'écrit <b>/</b>.</li>
  <li>Quand on recopie une formule, le tableur adapte les noms des cellules.</li>
  <li>Quand on change un nombre, le tableur recalcule tout seul.</li>
  <li>Pour savoir si un tableau est un tableau de proportionnalité, on peut calculer les quotients : ils doivent être tous égaux.</li>`;
const RET5 = `<li><b>=SOMME(B2:B6)</b> additionne les cellules de B2 jusqu'à B6 ; <b>=MOYENNE(B10:H10)</b> calcule leur moyenne.</li>
  <li>Fréquence = effectif ÷ effectif total. Elle peut s'écrire avec une fraction, un nombre décimal ou un pourcentage.</li>
  <li>Pour bloquer une cellule pendant une recopie, on écrit des <b>$</b> : $B$7.</li>
  <li>Le diagramme en barres sert à comparer des effectifs ; le diagramme circulaire montre les parts d'un tout.</li>`;
/* ---------------- 4e : statistiques, diagrammes, moyenne, calcul littéral ---------------- */
const APP=[8,15,10,3,3], NOTES=[8,10,12,14,16], EFFN=[2,5,8,4,1], TRAJ=[12,25,8,17,30,14,9,21,16,18];
const START4 = {A1:"Personnes par appartement", G1:"Total", A2:"Effectif", A3:"Fréquence (%)",
  A15:"Note", G15:"Total", A16:"Effectif", A17:"Note × effectif", A18:"Moyenne",
  A20:"Temps de trajet (min)", A21:"Moyenne", A22:"Étendue",
  A24:"x", A25:"2(x + 3)", A26:"2x + 6", A27:"2x + 3"};
APP.forEach((v,i)=>{ START4[CN(i+1)+"1"]=String(i+1); START4[CN(i+1)+"2"]=String(v); });
NOTES.forEach((v,i)=>{ START4[CN(i+1)+"15"]=String(v); START4[CN(i+1)+"16"]=String(EFFN[i]); });
TRAJ.forEach((v,i)=>{ START4[CN(i+1)+"20"]=String(v); });
[0,1,2,3,4,5].forEach((v,i)=>{ START4[CN(i+1)+"24"]=String(v); });
const RANGE = (r,a,b) => COLS(a,b).map(c=>key(r,c));
function chart4(type){
  if(!S.chart) return "Sélectionne les cellules de A1 à F2, puis clique sur le bouton « Insérer un graphique » de la barre d'outils.";
  const d=chartData(S.chart);
  if(!d) return "Le graphique n'utilise pas les bonnes cellules : supprime-le (croix), sélectionne A1 à F2, puis recommence.";
  if(d.labels.includes("Total")) return "Ton graphique contient la colonne « Total » : elle ne doit pas y être. Supprime le graphique (croix), sélectionne seulement A1 à F2, puis recommence.";
  if(d.labels.join()!=="1,2,3,4,5" || d.vals.join()!==APP.join()) return "Le graphique doit montrer les 5 valeurs (1 à 5 personnes) et leurs effectifs : supprime-le (croix), sélectionne A1 à F2, puis recommence.";
  return S.chart.type===type || `En haut du graphique, choisis « ${type==="barres"?"Barres":"Circulaire"} ».`;
}
const M4 = [
 {t:"L'effectif total", cible:["G2"],
  h:`<p>On a compté le nombre de personnes qui vivent dans chaque appartement d'un immeuble. La ligne 2 donne les <b>effectifs</b> : par exemple, 15 appartements ont 2 habitants.</p>
     ${ol(`Clique sur la cellule ${cel("G2")}, sous « Total ».`, "Tape <b>=SOMME(</b>", `Sélectionne les cellules de ${cel("B2")} jusqu'à ${cel("F2")} avec la souris.`, `Tape <b>)</b> puis appuie sur ${ENT}.`)}
     ${voir(`la cellule ${cel("G2")} affiche le nombre total d'appartements.`)}`,
  test:()=>{ const r=cellsOk(["G2"],()=>39,""); if(r!==true && isF("G2") && typeof V("G2")==="number") return `Ta somme donne ${show(V("G2"))} : vérifie que tu as pris les cellules de B2 à F2.`; return r; },
  aide:"La formule est =SOMME(B2:F2). Le signe « : » veut dire « jusqu'à ».",
  bravo:"L'immeuble compte 39 appartements."},
 {t:"Un diagramme en bâtons", cible:["A1:F2"],
  h:`<p>Le tableur peut dessiner un <b>diagramme en bâtons</b> à partir du tableau.</p>
     ${ol(`Clique sur ${cel("A1")} et, <b>sans lâcher</b>, glisse jusqu'à ${cel("F2")}. Ne prends pas la colonne « Total » !`, `Clique sur le bouton <b>« Insérer un graphique »</b> <span class="tico">${ico("insert_chart")}</span> de la barre d'outils.`, "Vérifie que « <b>Barres</b> » est choisi en haut du graphique.")}
     ${voir("un bâton pour chaque nombre de personnes ; la hauteur du bâton, c'est l'effectif.")}`,
  test:()=>chart4("barres"),
  aide:"La sélection doit contenir les lignes 1 et 2, de la colonne A jusqu'à la colonne F, mais pas la colonne G (Total).",
  bravo:"Le tableur a dessiné le diagramme tout seul. On voit tout de suite que la plupart des appartements ont 2 habitants."},
 {t:"Un diagramme circulaire", cible:[],
  h:`<p>Le <b>diagramme circulaire</b> montre la part de chaque valeur dans l'ensemble des appartements.</p>
     ${ol("En haut du graphique, clique sur « <b>Circulaire</b> ».", "Le tableur écrit le pourcentage de chaque part.", "Lis le pourcentage des appartements où vivent 2 personnes, et écris-le ci-dessous.")}`,
  q:{lab:"Pourcentage des appartements avec 2 personnes (au dixième) :", ok:s=>{ const v=nb(String(s).replace("%","")); return eq(v,38.5)||eq(v,38.46); }},
  test:()=>chart4("circulaire"),
  aide:"Le pourcentage est écrit dans la part de la couleur du « 2 ». On peut aussi le calculer : 15 ÷ 39 × 100 ≈ 38,5.",
  bravo:"15 appartements sur 39, c'est environ 38,5 % : un peu plus d'un tiers du disque."},
 {t:"Note × effectif", cible:["B17:F17"],
  h:`<p>Plus bas (ligne 15), voici les notes d'une classe à un contrôle : 2 élèves ont eu 8, 5 élèves ont eu 10…</p>
     <p>Pour calculer la moyenne, on commence par multiplier chaque note par son effectif.</p>
     ${ol(`Clique sur ${cel("B17")}.`, `Écris la formule <b>=B15*B16</b> puis appuie sur ${ENT}. Tu dois lire 16.`, `Recopie la formule jusqu'à ${cel("F17")} avec le petit carré bleu ${CARRE}.`)}`,
  test:()=> cellsOk(RANGE(16,1,5), k=>NOTES[pos(k).c-1]*EFFN[pos(k).c-1], "Écris la formule en B17, puis recopie-la jusqu'à F17."),
  aide:"En B17 : =B15*B16, puis recopie vers la droite.",
  bravo:"2 élèves ont eu 8 : cela fait 16 points. 8 élèves ont eu 12 : cela fait 96 points."},
 {t:"La moyenne pondérée", cible:["G16","G17","B18"],
  h:`<p>La moyenne = la somme de toutes les notes ÷ le nombre d'élèves.</p>
     ${ol(`En ${cel("G16")}, calcule le nombre d'élèves avec <b>=SOMME(B16:F16)</b>.`, `En ${cel("G17")}, calcule la somme de toutes les notes : <b>=SOMME(B17:F17)</b>.`, `En ${cel("B18")}, divise ${cel("G17")} par ${cel("G16")}.`, "Écris la moyenne de la classe ci-dessous.")}`,
  q:{lab:"La moyenne de la classe est :", ok:s=>eq(nb(s),11.7)},
  test:()=>{ if(eq(V("B18"),12)) return "Ta formule en B18 donne 12 : c'est la moyenne des 5 notes, sans tenir compte des effectifs ! Il faut diviser G17 par G16.";
    return cellsOk(["G16","G17","B18"], k=>({G16:20,G17:234,B18:11.7})[k], ""); },
  aide:"En B18 : =G17/G16. On ne peut pas écrire =MOYENNE(B15:F15) : cette formule ne tient pas compte du nombre d'élèves qui ont eu chaque note.",
  bravo:"20 élèves, 234 points en tout : la moyenne est 234 ÷ 20 = 11,7. C'est une <b>moyenne pondérée</b> par les effectifs."},
 {t:"Moyenne et étendue", cible:["B21","B22"],
  h:`<p>La ligne 20 donne le temps de trajet de 10 élèves pour venir au collège.</p>
     ${note("L'<b>étendue</b>, c'est la différence entre la plus grande valeur et la plus petite : étendue = MAX − MIN.")}
     ${ol(`En ${cel("B21")}, écris <b>=MOYENNE(B20:K20)</b>.`, `En ${cel("B22")}, calcule l'étendue avec <b>=MAX(B20:K20)-MIN(B20:K20)</b>.`)}`,
  test:()=>{ const r=cellsOk(["B21","B22"], k=>k==="B21"?17:22, ""); if(r!==true && eq(V("B22"),30)) return "En B22, tu as seulement le MAX : il faut lui enlever le MIN."; return r; },
  aide:"=MOYENNE(B20:K20) donne la moyenne. Pour l'étendue : =MAX(B20:K20)-MIN(B20:K20).",
  bravo:"Le temps moyen est 17 minutes. L'étendue est 30 − 8 = 22 minutes : les temps de trajet sont très dispersés."},
 {t:"Défi : tester une égalité", defi:true, cible:["B25:G27"],
  h:`<p>Est-ce que 2(x + 3) est égal à 2x + 6 ? Et à 2x + 3 ? Testons avec plusieurs valeurs de x (ligne 24).</p>
     ${ol(`En ${cel("B25")}, écris une formule qui calcule 2(x + 3) avec x = ${cel("B24")}. Attention : dans un tableur, il faut écrire le signe <b>*</b>.`, `En ${cel("B26")} : 2x + 6. En ${cel("B27")} : 2x + 3.`, `Sélectionne ${cel("B25")} jusqu'à ${cel("B27")}, puis recopie les trois formules jusqu'à la colonne G.`, "Compare les lignes, puis réponds.")}`,
  q:{lab:"Quelle expression est égale à 2(x + 3) pour toutes les valeurs de x ?", choix:["2x + 6","2x + 3"], ok:s=>s==="2x + 6"},
  test:()=>{ const x=c=>V(key(23,c)); for(const [r,f,t] of [[24,v=>2*(v+3),"2(x + 3)"],[25,v=>2*v+6,"2x + 6"],[26,v=>2*v+3,"2x + 3"]]){ const l=ligne(r,COLS(1,6),c=>f(x(c)),c=>key(23,c),`Écris la formule de ${t} en ${key(r,1)}, puis recopie-la jusqu'à la colonne G.`); if(l!==true) return l; } return true; },
  aide:"En B25 : =2*(B24+3). En B26 : =2*B24+6. En B27 : =2*B24+3. Puis recopie vers la droite.",
  bravo:"2(x + 3) et 2x + 6 sont égaux pour toutes les valeurs testées : c'est la <b>distributivité</b>, 2(x + 3) = 2 × x + 2 × 3. En revanche, 2x + 3 est différent : pour x = 0, on obtient 6 et 3. Un seul contre-exemple suffit pour prouver qu'une égalité est fausse !"},
 /* mission ajoutée (indice 7) : dans la séance, elle vient juste après le diagramme circulaire */
 {t:"Les fréquences en pourcentage", cible:["B3:F3"],
  h:`<p>La <b>fréquence</b> d'une valeur, c'est son effectif divisé par l'effectif total. Pour l'écrire en <b>pourcentage</b>, on la multiplie par 100.</p>
     ${note("Exemple : 8 appartements sur 39 ont 1 habitant. 8 ÷ 39 × 100 ≈ 20,5 : cela fait environ 20,5 %.")}
     ${ol(`Clique sur ${cel("B3")}.`, `Écris une formule qui calcule ${cel("B2")} ÷ ${cel("G2")} × 100, puis appuie sur ${ENT}.`, `Pendant la recopie, G2 ne doit pas bouger : écris-le <b>$G$2</b> dans ta formule.`, `Recopie la formule jusqu'à ${cel("F3")} avec le petit carré bleu ${CARRE}.`, "Lis le pourcentage des appartements où vivent 3 personnes, et écris-le ci-dessous, arrondi au dixième.")}`,
  q:{lab:"Pourcentage des appartements avec 3 personnes (au dixième) :", ok:s=>{ const v=nb(String(s).replace("%","")); return eq(v,25.6)||eq(v,25.64); }},
  test:()=>{ if(!eq(V("G2"),39)) return "La cellule G2 doit contenir l'effectif total, 39 : fais d'abord la mission 1.";
    return cellsOk(RANGE(2,1,5), k=>APP[pos(k).c-1]/39*100, "Écris la formule en B3, puis recopie-la jusqu'à F3.",
      (k,v)=> v && v.err==="#DIV/0!" && k!=="B3" ? `En ${k}, le tableur affiche #DIV/0! (division par zéro). En recopiant vers la droite, G2 est devenu H2, I2… qui sont vides ! Pour <b>bloquer</b> la cellule G2, écris <b>$G$2</b> : en B3, =B2/$G$2*100. Puis recopie de nouveau.` : null); },
  aide:"En B3 : =B2/$G$2*100, puis recopie jusqu'à F3. Les signes $ empêchent le tableur de décaler G2 pendant la recopie.",
  bravo:"Les pourcentages sont environ 20,5 % ; 38,5 % ; 25,6 % ; 7,7 % et 7,7 %. Ensemble, ils font 100 % : tous les appartements sont comptés. Ce sont les pourcentages écrits dans le diagramme circulaire !"}
];
const RET4 = `<li><b>=SOMME(…)</b>, <b>=MOYENNE(…)</b>, <b>=MAX(…)</b> et <b>=MIN(…)</b> calculent la somme, la moyenne, la plus grande et la plus petite valeur.</li>
  <li>Moyenne pondérée = somme des (valeur × effectif) ÷ effectif total.</li>
  <li>Étendue = plus grande valeur − plus petite valeur.</li>
  <li>Fréquence = effectif ÷ effectif total ; en pourcentage, on la multiplie par 100. Pour bloquer une cellule pendant une recopie, on écrit $G$2.</li>
  <li>Le diagramme en bâtons compare des effectifs ; le diagramme circulaire montre les parts d'un tout.</li>
  <li>Tester une égalité avec quelques valeurs ne prouve pas qu'elle est vraie, mais un seul contre-exemple prouve qu'elle est fausse.</li>`;

/* ---------------- 3e : fonctions, tableau de valeurs, équations par essais successifs ---------------- */
const XS3=[-3,-2,-1,0,1,2,3];
const START3 = {A1:"x", A2:"f(x) = 3x − 5", A3:"g(x) = x² − 4", A4:"Nombre de départ", A5:"Programme 1 : (x − 4)²", A6:"Programme 2 : x² + 2x", A8:"Programme A : 8x + 7", A9:"Programme B : 5x + 12"};
XS3.forEach((v,i)=>{ START3[CN(i+1)+"1"]=String(v); });
const carre = k => /[²³]/.test(CELLS[k]||"") ? `En ${k}, le carré s'écrit <b>^2</b> dans un tableur : par exemple =B4^2.` : null;
function rowF(r, cols, f, conseil){ for(const c of cols){ const k=key(r,c), sp=carre(k); if(sp) return sp; } return cellsOk(cols.map(c=>key(r,c)), k=>f(V(key(3,pos(k).c))), conseil); }
const M3 = [
 {t:"Un tableau de valeurs", cible:["B2:H2"],
  h:`<p>On considère la fonction <b>f : x ⟼ 3x − 5</b>. On veut calculer l'image de chaque nombre de la ligne 1.</p>
     ${ol(`Clique sur ${cel("B2")}.`, `Écris une formule qui calcule 3 × ${cel("B1")} − 5 (le signe × s'écrit <b>*</b>), puis appuie sur ${ENT}.`, `Recopie la formule jusqu'à ${cel("H2")} avec le petit carré bleu ${CARRE}.`)}
     ${voir(`f(−3) = −14 dans la cellule ${cel("B2")}.`)}`,
  test:()=> cellsOk(RANGE(1,1,7), k=>3*V(key(0,pos(k).c))-5, "Écris la formule en B2, puis recopie-la jusqu'à H2."),
  aide:"En B2 : =3*B1-5, puis recopie vers la droite.",
  bravo:"Le tableur a calculé les images de −3, −2, …, 3 par la fonction f : c'est un <b>tableau de valeurs</b>."},
 {t:"Image et antécédent", cible:[],
  h:`<p>Dans le tableau de valeurs :</p><ul class="tliste"><li>sur la ligne 1, on lit les nombres x ;</li><li>sur la ligne 2, on lit leurs <b>images</b> f(x).</li></ul>
     ${note("Exemple : f(−3) = −14. On dit que −14 est l'image de −3, et que −3 est <b>un antécédent</b> de −14.")}
     <p>Lis dans le tableau un antécédent de <b>1</b> par la fonction f.</p>`,
  q:{lab:"Un antécédent de 1 par f est :", ok:s=>eq(nb(s),2)},
  test:()=> cellsOk(RANGE(1,1,7), k=>3*V(key(0,pos(k).c))-5, "Le tableau de valeurs de la mission 1 doit être rempli."),
  aide:"Cherche le nombre 1 sur la ligne 2 (les images). L'antécédent est le nombre écrit juste au-dessus, sur la ligne 1.",
  bravo:"f(2) = 3 × 2 − 5 = 1 : un antécédent de 1 est 2."},
 {t:"La représentation graphique", cible:["A1:H2"],
  h:`<p>On peut placer les points de coordonnées (x ; f(x)) dans un repère.</p>
     ${ol(`Sélectionne les cellules de ${cel("A1")} jusqu'à ${cel("H2")}.`, `Clique sur le bouton <b>« Insérer un graphique »</b> <span class="tico">${ico("insert_chart")}</span>.`, "En haut du graphique, vérifie que « <b>Points</b> » est choisi.", "Observe les points, puis réponds.")}`,
  q:{lab:"Les points sont-ils alignés ?", choix:["Oui","Non"], ok:s=>s==="Oui"},
  test:()=>{ if(!S.chart) return "Sélectionne A1 à H2, puis clique sur « Insérer un graphique ».";
    const d=chartData(S.chart); if(!d || d.xs.join()!==XS3.join() || d.vals.some((v,i)=>!eq(v,3*XS3[i]-5))) return "Le graphique doit utiliser les cellules de A1 à H2 : supprime-le (croix), sélectionne A1 à H2, puis recommence.";
    return S.chart.type==="points" || "En haut du graphique, choisis « Points »."; },
  aide:"Pose une règle sur l'écran : passe-t-elle par tous les points ?",
  bravo:"Les points sont alignés : la représentation graphique de f est une <b>droite</b>. C'est normal, f(x) = 3x − 5 est une <b>fonction affine</b>."},
 {t:"De 0,1 en 0,1", cible:["B4:L4"],
  h:`<p><b>Le problème de Tom.</b> Tom choisit un nombre entre 1 et 2. Avec le programme 1, il calcule (x − 4)² ; avec le programme 2, il calcule x² + 2x. Il trouve le <b>même résultat</b> ! Quel nombre a-t-il choisi ?</p>
     <p>On va essayer les nombres 1 ; 1,1 ; 1,2 ; … ; 2 sur la ligne 4.</p>
     ${ol(`En ${cel("B4")}, écris <b>1</b>.`, `En ${cel("C4")}, écris la formule <b>=B4+0,1</b> (le nombre précédent, plus 0,1).`, `Recopie cette formule jusqu'à ${cel("L4")}.`)}
     ${voir(`la cellule ${cel("L4")} affiche 2.`)}`,
  test:()=>{ if(!eq(V("B4"),1)) return "Écris 1 dans la cellule B4."; return cellsOk(RANGE(3,2,11), k=>1+0.1*(pos(k).c-1), "En C4, écris =B4+0,1, puis recopie jusqu'à L4."); },
  aide:"En C4 : =B4+0,1. Recopie jusqu'à L4 : D4 contiendra =C4+0,1, et ainsi de suite.",
  bravo:"La ligne 4 contient maintenant 1 ; 1,1 ; 1,2 ; … ; 2. Si on change B4, toute la ligne change !"},
 {t:"Le nombre de Tom", cible:["B5:L6"],
  h:`${ol(`En ${cel("B5")}, écris une formule qui calcule (x − 4)² avec x = ${cel("B4")}. Dans un tableur, le carré s'écrit <b>^2</b>.`, `En ${cel("B6")}, calcule x² + 2x.`, `Sélectionne ${cel("B5")} et ${cel("B6")}, puis recopie jusqu'à la colonne L.`, "Cherche la colonne où les deux programmes donnent le même résultat.")}`,
  q:{lab:"Le nombre choisi par Tom est :", ok:s=>eq(nb(s),1.6)},
  test:()=>{ const a=rowF(4,COLS(1,11),x=>(x-4)**2,"Écris la formule en B5, puis recopie-la jusqu'à L5."); if(a!==true) return a; return rowF(5,COLS(1,11),x=>x*x+2*x,"Écris la formule en B6, puis recopie-la jusqu'à L6."); },
  aide:"En B5 : =(B4-4)^2. En B6 : =B4^2+2*B4. Puis recopie les deux formules vers la droite.",
  bravo:"Pour x = 1,6 : (1,6 − 4)² = 5,76 et 1,6² + 2 × 1,6 = 5,76. Tom avait choisi 1,6. On a résolu l'équation (x − 4)² = x² + 2x <b>par essais successifs</b>."},
 {t:"Défi : entre deux valeurs", defi:true, cible:["B8:L9"],
  h:`<p>Deux autres programmes : A calcule 8x + 7 et B calcule 5x + 12. Pour quel nombre donnent-ils le même résultat ?</p>
     ${ol(`En ${cel("B8")}, calcule 8x + 7 avec x = ${cel("B4")} ; en ${cel("B9")}, calcule 5x + 12.`, "Recopie les deux formules jusqu'à la colonne L.", "Compare les deux lignes : à quel moment le programme A dépasse-t-il le programme B ?")}`,
  q:{lab:"Les deux programmes donnent le même résultat pour un nombre :", choix:["égal à 1,6","égal à 1,7","entre 1,6 et 1,7","entre 1,7 et 1,8"], ok:s=>s==="entre 1,6 et 1,7"},
  test:()=>{ const a=rowF(7,COLS(1,11),x=>8*x+7,"Écris la formule en B8, puis recopie-la jusqu'à L8."); if(a!==true) return a; return rowF(8,COLS(1,11),x=>5*x+12,"Écris la formule en B9, puis recopie-la jusqu'à L9."); },
  aide:"En B8 : =8*B4+7. En B9 : =5*B4+12. Pour 1,6, le programme A donne moins que B ; pour 1,7, il donne plus.",
  bravo:"Aucune valeur du tableau ne donne exactement le même résultat : la solution est <b>entre 1,6 et 1,7</b>."},
 {t:"Défi : affiner les essais", defi:true, cible:["B4","C4"],
  h:`<p>Pour trouver la solution plus précisément, on essaie les nombres <b>de 0,01 en 0,01</b> à partir de 1,6.</p>
     ${ol(`En ${cel("B4")}, écris <b>1,6</b>.`, `En ${cel("C4")}, écris la formule <b>=B4+0,01</b>, puis recopie-la jusqu'à ${cel("L4")}.`, "Les lignes 5 à 9 se recalculent toutes seules. Compare de nouveau les lignes 8 et 9.")}`,
  q:{lab:"La solution de 8x + 7 = 5x + 12 est entre :", choix:["1,6 et 1,61","1,66 et 1,67","1,67 et 1,68"], ok:s=>s==="1,66 et 1,67"},
  test:()=>{ if(!eq(V("B4"),1.6)) return "Écris 1,6 dans la cellule B4."; const r=cellsOk(RANGE(3,2,11), k=>1.6+0.01*(pos(k).c-1), "En C4, écris =B4+0,01, puis recopie jusqu'à L4."); if(r!==true) return r;
    const a=rowF(7,COLS(1,11),x=>8*x+7,"Les formules des lignes 8 et 9 doivent rester en place."); if(a!==true) return a; return rowF(8,COLS(1,11),x=>5*x+12,"Les formules des lignes 8 et 9 doivent rester en place."); },
  aide:"Après la recopie, la ligne 4 contient 1,6 ; 1,61 ; … ; 1,7. Pour 1,66, A < B ; pour 1,67, A > B.",
  bravo:"La solution est entre 1,66 et 1,67. En résolvant l'équation : 8x + 7 = 5x + 12 donne 3x = 5, donc x = 5/3 ≈ 1,667. Ce nombre n'a pas d'écriture décimale exacte : le tableur ne pouvait pas le trouver exactement ! Bravo, tu as terminé la séance."},
 /* mission ajoutée (indice 7) : dans la séance, elle vient juste après « Image et antécédent » */
 {t:"Plusieurs antécédents", cible:["B3:H3"],
  h:`<p>Voici une autre fonction : <b>g : x ⟼ x² − 4</b>. On calcule ses images sur la ligne 3.</p>
     ${ol(`Clique sur ${cel("B3")}.`, `Écris une formule qui calcule x² − 4 avec x = ${cel("B1")}. Dans un tableur, le carré s'écrit <b>^2</b>.`, `Recopie la formule jusqu'à ${cel("H3")} avec le petit carré bleu ${CARRE}.`, "Cherche sur la ligne 3 les cellules qui affichent <b>0</b>. Les antécédents de 0 sont écrits au-dessus, sur la ligne 1.")}
     ${voir(`g(−3) = 5 dans la cellule ${cel("B3")}.`)}`,
  q:{lab:"Les antécédents de 0 par g, dans le tableau, sont :", choix:["seulement 2","−2 et 2","seulement 0","−4 et 4"], ok:s=>s==="−2 et 2"},
  test:()=>{ const sq=COLS(1,7).map(c=>key(2,c)).find(k=>/[²³]/.test(CELLS[k]||"")); if(sq) return `En ${sq}, le carré s'écrit <b>^2</b> dans un tableur : par exemple =B1^2-4.`;
    return cellsOk(RANGE(2,1,7), k=>V(key(0,pos(k).c))**2-4, "Écris la formule en B3, puis recopie-la jusqu'à H3."); },
  aide:"En B3 : =B1^2-4, puis recopie jusqu'à H3. Cherche ensuite les 0 sur la ligne 3 : l'antécédent est le nombre écrit juste au-dessus, sur la ligne 1.",
  bravo:"g(−2) = (−2)² − 4 = 4 − 4 = 0 et g(2) = 2² − 4 = 0 : le nombre 0 a <b>deux antécédents</b> par g, −2 et 2. Un nombre a une seule image, mais il peut avoir plusieurs antécédents."}
];
const RET3 = `<li>Un tableau de valeurs se remplit avec une formule recopiée : =3*B1-5. Le carré s'écrit ^2.</li>
  <li>f(2) = 1 : 1 est l'image de 2, et 2 est un antécédent de 1.</li>
  <li>Un nombre a une seule image, mais il peut avoir plusieurs antécédents : par g : x ⟼ x² − 4, les antécédents de 0 sont −2 et 2.</li>
  <li>La représentation graphique d'une fonction affine est une droite.</li>
  <li>Le tableur permet de résoudre une équation par essais successifs, en affinant le pas (0,1 puis 0,01…). La résolution algébrique donne la valeur exacte.</li>`;

const PACKS = {
  "6e": {key:"staal-tableur6-etat", titre:"Séance tableur · Proportionnalité", start:START6, missions:M6, ret:RET6, widths:[200,...Array(NC-1).fill(66)]},
  "5e": {key:"staal-tableur5-etat", titre:"Séance tableur · Statistiques", start:START5, missions:M5, ret:RET5, chart:true, chartAt:[0,4], widths:[190,80,90,124,...Array(NC-4).fill(76)]},
  "4e": {key:"staal-tableur4-etat", rows:30, ajouts:["A3"], titre:"Séance tableur · Statistiques et diagrammes", start:START4, missions:M4, ret:RET4, chart:true, chartAt:[3,0], widths:[210,...Array(NC-1).fill(66)]},
  "3e": {key:"staal-tableur3-etat", ajouts:["A3"], titre:"Séance tableur · Fonctions et équations", start:START3, missions:M3, ret:RET3, chart:true, chartTypes:["points","barres"], chartAt:[10,0], widths:[210,...Array(NC-1).fill(66)]}
};
let P=PACKS["6e"], MISSIONS=M6;
/* séance : SUB = numéros (dans MISSIONS) des missions de la séance, dans l'ordre ; OPT = options données par la page (niv, onChange, onFin, fin) */
let SUB=[], OPT={};
const numero = i => SUB.indexOf(i)+1;
const allDone = () => SUB.every(j=>S.done.includes(j));

/* ---------------- graphique (5e) ---------------- */
function chartData(ch){
  const g=ch.r, W=g.c2-g.c1+1, H=g.r2-g.r1+1, labels=[], vals=[], xs=[]; let title="";
  if(W===2){ for(let r=g.r1;r<=g.r2;r++){ const L=VAL[key(r,g.c1)], v=VAL[key(r,g.c1+1)];
      if(typeof v!=="number"){ if(r===g.r1 && v!==null && !(v&&v.err)){ title=show(v); continue; } if(v===null && L===null) continue; return null; }
      labels.push(show(L)); vals.push(v); xs.push(typeof L==="number"?L:NaN); } }
  else if(H===2){ for(let c=g.c1;c<=g.c2;c++){ const L=VAL[key(g.r1,c)], v=VAL[key(g.r1+1,c)];
      if(typeof v!=="number"){ if(c===g.c1 && v!==null && !(v&&v.err)){ title=show(v); continue; } if(v===null && L===null) continue; return null; }
      labels.push(show(L)); vals.push(v); xs.push(typeof L==="number"?L:NaN); } }
  else return null;
  return labels.length ? {labels, vals, title, xs} : null;
}
const PAL=["#4285f4","#ea4335","#fbbc04","#34a853","#ff6d01","#46bdc6","#7baaf7","#f07b72","#fcd04f","#71c287"];
function niceMax(m){ if(m<=0) return 1; const e=Math.pow(10,Math.floor(Math.log10(m))), f=m/e; return (f<=1?1:f<=2?2:f<=5?5:10)*e; }
function chartSVG(d, type){
  const W=360, H=196, esc=t=>String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;");
  if(type==="circulaire"){
    const tot=d.vals.reduce((a,b)=>a+Math.max(0,b),0)||1, cx=92, cy=98, r=80; let a=-Math.PI/2, s="";
    d.vals.forEach((v,i)=>{ const da=2*Math.PI*Math.max(0,v)/tot, col=PAL[i%PAL.length];
      if(da>=2*Math.PI-1e-9) s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}"/>`;
      else if(da>0){ const x1=cx+r*Math.cos(a), y1=cy+r*Math.sin(a), x2=cx+r*Math.cos(a+da), y2=cy+r*Math.sin(a+da);
        s+=`<path d="M${cx} ${cy}L${x1.toFixed(2)} ${y1.toFixed(2)}A${r} ${r} 0 ${da>Math.PI?1:0} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z" fill="${col}" stroke="#fff" stroke-width="1.5"/>`;
        if(da>0.35){ const m=a+da/2; s+=`<text x="${(cx+r*0.62*Math.cos(m)).toFixed(1)}" y="${(cy+r*0.62*Math.sin(m)+4).toFixed(1)}" text-anchor="middle" class="tcpct">${fmt(Math.round(1000*v/tot)/10)} %</text>`; } }
      a+=da; });
    s+=d.labels.map((l,i)=>`<rect x="200" y="${22+i*24}" width="12" height="12" rx="2" fill="${PAL[i%PAL.length]}"/><text x="218" y="${32+i*24}" class="tcleg">${esc(l)}</text>`).join("");
    return `<svg viewBox="0 0 ${W} ${H}" class="tcsvg" role="img" aria-label="Diagramme circulaire">${s}</svg>`;
  }
  if(type==="points") return pointsSVG(d, W, H);
  const max=niceMax(Math.max(...d.vals,0)), x0=34, y0=164, pw=W-x0-10, ph=146, n=d.vals.length, bw=pw/n;
  let s="";
  for(let i=0;i<=4;i++){ const v=max*i/4, y=y0-ph*i/4; s+=`<line x1="${x0}" x2="${W-10}" y1="${y}" y2="${y}" stroke="${i?"#e1e3e1":"#5f6368"}"/><text x="${x0-5}" y="${y+4}" text-anchor="end" class="tcax">${fmt(v)}</text>`; }
  d.vals.forEach((v,i)=>{ const h=ph*Math.max(0,v)/max, x=x0+i*bw+bw*0.18;
    s+=`<rect x="${x.toFixed(1)}" y="${(y0-h).toFixed(1)}" width="${(bw*0.64).toFixed(1)}" height="${h.toFixed(1)}" fill="#4285f4"/><text x="${(x+bw*0.32).toFixed(1)}" y="${(y0-h-4).toFixed(1)}" text-anchor="middle" class="tcval">${fmt(v)}</text>
       <text x="${(x+bw*0.32).toFixed(1)}" y="${y0+16}" text-anchor="middle" class="tcax">${esc(d.labels[i])}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" class="tcsvg" role="img" aria-label="Diagramme en barres">${s}</svg>`;
}
/* nuage de points (3e) : abscisses = première ligne (ou colonne), ordonnées = seconde */
function niceStep(range){ const r=range/5||1, e=Math.pow(10,Math.floor(Math.log10(r))), f=r/e; return (f<=1?1:f<=2?2:f<=5?5:10)*e; }
function pointsSVG(d, W, H){
  if(d.xs.some(x=>!isFinite(x))) return `<p class="tcerr">Pour un graphique « Points », la première ligne doit contenir des nombres.</p>`;
  const lo=a=>Math.min(0,...a), hi=a=>Math.max(0,...a), sxs=niceStep(hi(d.xs)-lo(d.xs)), sys=niceStep(hi(d.vals)-lo(d.vals));
  const xa=Math.floor(lo(d.xs)/sxs)*sxs, xb=Math.ceil(hi(d.xs)/sxs)*sxs, ya=Math.floor(lo(d.vals)/sys)*sys, yb=Math.ceil(hi(d.vals)/sys)*sys;
  const L=34, R=W-12, T=10, B=H-20, X=x=>L+(x-xa)/((xb-xa)||1)*(R-L), Y=y=>B-(y-ya)/((yb-ya)||1)*(B-T);
  let s="";
  for(let x=xa;x<=xb+1e-9;x+=sxs){ s+=`<line x1="${X(x).toFixed(1)}" x2="${X(x).toFixed(1)}" y1="${T}" y2="${B}" stroke="#eceff1"/>`; s+=`<text x="${X(x).toFixed(1)}" y="${(Math.min(B,Math.max(T,Y(0)))+13).toFixed(1)}" text-anchor="middle" class="tcax">${fmt(x)}</text>`; }
  for(let y=ya;y<=yb+1e-9;y+=sys){ s+=`<line x1="${L}" x2="${R}" y1="${Y(y).toFixed(1)}" y2="${Y(y).toFixed(1)}" stroke="#eceff1"/>`; if(Math.abs(y)>1e-9) s+=`<text x="${(Math.min(R,Math.max(L,X(0)))-4).toFixed(1)}" y="${(Y(y)+4).toFixed(1)}" text-anchor="end" class="tcax">${fmt(y)}</text>`; }
  s+=`<line x1="${L}" x2="${R}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="#5f6368" stroke-width="1.3"/><line x1="${X(0).toFixed(1)}" x2="${X(0).toFixed(1)}" y1="${T}" y2="${B}" stroke="#5f6368" stroke-width="1.3"/>`;
  d.xs.forEach((x,i)=>{ s+=`<circle cx="${X(x).toFixed(1)}" cy="${Y(d.vals[i]).toFixed(1)}" r="4.5" fill="#ea4335" stroke="#fff" stroke-width="1.2"/>`; });
  return `<svg viewBox="0 0 ${W} ${H}" class="tcsvg" role="img" aria-label="Nuage de points">${s}</svg>`;
}
const TYPES = {barres:"Barres", circulaire:"Circulaire", points:"Points"};
function drawChart(){
  const old=R && R.querySelector("#tchart"); if(old) old.remove(); if(!R || !S.chart) return;
  const d=chartData(S.chart), b=box(P.chartAt[0],P.chartAt[1],P.chartAt[0],P.chartAt[1]), t=S.chart.type;
  const el=document.createElement("div"); el.className="tchart"; el.id="tchart"; el.style.left=(b.x+8)+"px"; el.style.top=(b.y+4)+"px"; el.style.width=Math.min(380, SC.clientWidth-24)+"px";
  el.innerHTML = `<div class="tchead"><b>${d&&d.title?d.title:"Graphique"}</b><span class="tctype">${(P.chartTypes||["barres","circulaire"]).map(k=>`<button data-t="${k}" class="${t===k?"on":""}">${TYPES[k]}</button>`).join("")}</span><button class="tcx" aria-label="Supprimer le graphique" title="Supprimer le graphique">×</button></div>
    ${d ? chartSVG(d,t) : `<p class="tcerr">Les cellules choisies ne contiennent pas des noms et des nombres. Supprime ce graphique et recommence.</p>`}`;
  el.addEventListener("pointerdown", e=>e.stopPropagation());
  el.querySelectorAll("[data-t]").forEach(x=>x.onclick=()=>{ S.chart.type=x.dataset.t; save(); drawChart(); check(true); });
  el.querySelector(".tcx").onclick=()=>{ S.chart=null; save(); drawChart(); check(true); };
  SC.appendChild(el);
}
function insertChart(){
  const g=rng();
  if(g.r1===g.r2 && g.c1===g.c2){ toast("Sélectionne d'abord le tableau : par exemple de A1 à B6."); return; }
  const ch={r:g, type:(P.chartTypes||["barres"])[0]};
  if(!chartData(ch)){ toast("Sélectionne deux colonnes (ou deux lignes) : les noms, puis les nombres."); return; }
  S.chart=ch; save(); drawChart(); check(true);
  const el=$("tchart"); if(el){ SC.scrollTop=0; SC.scrollLeft=Math.max(0, el.offsetLeft+el.offsetWidth-SC.clientWidth+10); }
}

/* ---------------- état ---------------- */
let S=null, UNDO=[], REDO=[];
function load(){ try{ const s=JSON.parse(localStorage.getItem(P.key)||"null"); if(s && s.cells){
    /* cellules de départ des missions ajoutées après coup : on les ajoute si elles manquent (sans toucher au travail de l'élève) */
    (P.ajouts||[]).forEach(k=>{ if(!(k in s.cells) && k in P.start) s.cells[k]=P.start[k]; });
    if(!Array.isArray(s.done)) s.done=[]; if(!s.ans) s.ans={}; return s; } }catch(e){} return null; }
function fresh(){ return {cells:Object.assign({},P.start), m:0, done:[], ans:{}, chart:null}; }
function save(){ try{ localStorage.setItem(P.key, JSON.stringify(S)); }catch(e){} }

/* ---------------- interface ---------------- */
let R=null, SC=null, TB=null, sel={r:0,c:0,r2:0,c2:0}, editing=null, fill=null, drag=null, RO=null, pt=null;
const $ = id => R.querySelector("#"+id);
const MENUS=["Fichier","Édition","Affichage","Insertion","Format","Données","Outils","Extensions","Aide"];
function toolbar(){
  const b=(i, lab, on)=>`<button class="tbtn${on?"":" off"}" ${on?`data-act="${on}"`:'aria-disabled="true"'} title="${lab}" aria-label="${lab}">${i}</button>`;
  const sep='<span class="tsep"></span>';
  return `<div class="ttool" role="toolbar" aria-label="Barre d'outils">
    <span class="tsearch off" aria-disabled="true">${ico("search")}<span>Menus</span></span>
    ${b(ico("undo"),"Annuler (Ctrl+Z)","undo")}${b(ico("redo"),"Rétablir (Ctrl+Y)","redo")}${b(ico("print"),"Imprimer")}${b(ico("format_paint"),"Reproduire la mise en forme")}
    <span class="tdrop off" aria-disabled="true">100 %${ico("arrow_drop_down")}</span>${sep}
    ${b('<span class="tt1">€</span>',"Format monétaire")}${b('<span class="tt1">%</span>',"Format pourcentage")}${b(ico("decimal_decrease"),"Diminuer le nombre de décimales")}${b(ico("decimal_increase"),"Augmenter le nombre de décimales")}
    <span class="tdrop off" aria-disabled="true">123${ico("arrow_drop_down")}</span>${sep}
    <span class="tdrop off wide" aria-disabled="true">Par défaut…${ico("arrow_drop_down")}</span>${sep}
    ${b(ico("remove"),"Diminuer la taille")}<span class="tsize off" aria-disabled="true">10</span>${b(ico("add"),"Augmenter la taille")}${sep}
    ${b(ico("format_bold"),"Gras")}${b(ico("format_italic"),"Italique")}${b(ico("format_strikethrough"),"Barré")}${b(ico("format_color_text"),"Couleur du texte")}${sep}
    ${b(ico("format_color_fill"),"Couleur de remplissage")}${b(ico("border_all"),"Bordures")}${b(ico("cell_merge"),"Fusionner les cellules")}${sep}
    ${b(ico("format_align_left"),"Alignement horizontal")}${b(ico("vertical_align_bottom"),"Alignement vertical")}${b(ico("wrap_text"),"Retour à la ligne")}${b(ico("text_rotation_none"),"Rotation du texte")}${sep}
    ${b(ico("link"),"Insérer un lien")}${b(ico("add_comment"),"Insérer un commentaire")}${b(ico("insert_chart"),"Insérer un graphique", P.chart?"chart":null)}${b(ico("filter_alt"),"Créer un filtre")}${b(ico("functions"),"Fonctions")}
  </div>`;
}
function init(root, pack, opts){
  P=PACKS[pack]||PACKS["6e"]; MISSIONS=P.missions; OPT=opts||{};
  SUB=(OPT.niv||MISSIONS.map((_,i)=>i)).filter(i=>i>=0 && i<MISSIONS.length); WIDTH=P.widths.slice(); NR=P.rows||24; if(window.innerWidth<600) WIDTH[0]=Math.min(WIDTH[0],170);
  R=root; S=load()||fresh(); CELLS=S.cells; UNDO=[]; REDO=[];
  if(!SUB.includes(S.m)){ const j=SUB.find(j=>!S.done.includes(j)); S.m = j===undefined ? SUB[0] : j; }
  let head=`<tr><th class="tcorner"></th>${WIDTH.map((w,c)=>`<th class="tch" data-c="${c}">${CN(c)}</th>`).join("")}</tr>`;
  let body=""; for(let r=0;r<NR;r++){ body+=`<tr><th class="trh" data-r="${r}">${r+1}</th>`; for(let c=0;c<NC;c++) body+=`<td class="tc" data-r="${r}" data-c="${c}"></td>`; body+="</tr>"; }
  root.innerHTML = `<div class="tabl"><div class="tlay">
    <div class="tsheet">
      <div class="ttop">
        <svg class="tlogo" viewBox="0 0 40 40" aria-hidden="true"><rect width="40" height="40" rx="10" fill="#1b2a44"/><rect x="7" y="7" width="26" height="26" rx="3" fill="#fff"/><path d="M7 15.7h26M7 24.3h26M15.7 7v26M24.3 7v26" stroke="#1b2a44" stroke-opacity=".28" stroke-width="1.4"/><path d="M7 10a3 3 0 0 1 3-3h23v8.7H7z" fill="#FFBF00" fill-opacity=".9"/><rect x="15.7" y="15.7" width="8.6" height="8.6" fill="#4C97FF" fill-opacity=".22" stroke="#2f7cf6" stroke-width="2.6"/><rect x="21.4" y="21.4" width="6" height="6" rx="1" fill="#2f7cf6" stroke="#fff" stroke-width="1.6"/></svg>
        <div class="tdoc"><div class="ttitle"><span class="tbrand">Tableur M. Staal</span><span class="tdot">·</span>${P.titre} <span class="off" aria-disabled="true">${ico("star")}</span><span class="tsaved">${ico("cloud_done")}</span></div>
          <nav class="tmenus" aria-label="Menus">${MENUS.map(m=>`<span class="off" aria-disabled="true">${m}</span>`).join("")}</nav></div>
        <div class="tright"><span class="tround off" aria-disabled="true">${ico("history")}</span><span class="tround off" aria-disabled="true">${ico("add_comment")}</span><span class="tshare off" aria-disabled="true">${ico("lock")} Partager</span></div>
      </div>
      ${toolbar()}
      <div class="tfbar"><div class="tname" id="tname" aria-live="polite">A1</div><span class="tfx" aria-hidden="true">fx</span><input id="tfin" class="tfin" aria-label="Barre de formule" autocomplete="off" spellcheck="false"></div>
      <div class="tscroll" id="tscroll" tabindex="0" aria-label="Feuille de calcul : utilise les flèches pour te déplacer, tape pour écrire">
        <table class="tt" id="ttab" style="width:${46+WIDTH.reduce((a,b)=>a+b,0)}px"><colgroup><col style="width:46px">${WIDTH.map(w=>`<col style="width:${w}px">`).join("")}</colgroup><thead>${head}</thead><tbody>${body}</tbody></table>
        <div class="tselbox" id="tsel"><div class="thandle" id="thandle" title="Fais glisser pour recopier"></div></div>
        <div class="tfillbox" id="tfill" hidden></div>
        <input id="tedit" class="tedit" hidden autocomplete="off" spellcheck="false" aria-label="Contenu de la cellule">
      </div>
      <div class="tbottom"><span class="off" aria-disabled="true">${ico("add")}</span><span class="off" aria-disabled="true">${ico("menu")}</span><span class="ttab">Feuille 1${ico("arrow_drop_down")}</span><span class="tstat" id="tstat"></span></div>
      <div class="ttoast" id="ttoast" hidden></div>
    </div>
    <aside class="tpanel" id="tpanel"></aside>
  </div></div>`;
  SC=$("tscroll"); TB=$("ttab");
  bind(); recalc(); paint(); select(0,1); panel(); drawChart();
  RO=new ResizeObserver(()=>place()); RO.observe(SC);
}
function td(r,c){ return TB.rows[r+1].cells[c+1]; }
/* cellules à remplir pour la mission en cours (surlignées en jaune) */
function cibles(){ const set=new Set(), M=MISSIONS[S.m]; (M&&M.cible||[]).forEach(x=>{ const [a,b]=x.split(":"); cellsIn([a,b||a]).forEach(k=>set.add(k)); }); return set; }
function paint(){
  const C=cibles();
  for(let r=0;r<NR;r++) for(let c=0;c<NC;c++){ const k=key(r,c), v=VAL[k], el=td(r,c);
    el.textContent=show(v); el.className="tc"+(typeof v==="number"?" n":"")+(v&&v.err?" e":"")+(C.has(k)?" cible":""); }
}
const rng = () => ({r1:Math.min(sel.r,sel.r2), r2:Math.max(sel.r,sel.r2), c1:Math.min(sel.c,sel.c2), c2:Math.max(sel.c,sel.c2)});
function box(r1,c1,r2,c2){
  const a=td(r1,c1).getBoundingClientRect(), b=td(r2,c2).getBoundingClientRect(), s=SC.getBoundingClientRect(), z=(s.width/SC.offsetWidth)||1;
  return {x:(a.left-s.left)/z-SC.clientLeft+SC.scrollLeft, y:(a.top-s.top)/z-SC.clientTop+SC.scrollTop, w:(b.right-a.left)/z, h:(b.bottom-a.top)/z};
}
function place(){
  if(!SC) return; const g=rng(), b=box(g.r1,g.c1,g.r2,g.c2), el=$("tsel");
  Object.assign(el.style,{left:b.x+"px", top:b.y+"px", width:b.w+"px", height:b.h+"px"});
  el.classList.toggle("multi", g.r1!==g.r2||g.c1!==g.c2);
  if(editing){ const e=$("tedit"), a=box(sel.r,sel.c,sel.r,sel.c); Object.assign(e.style,{left:a.x+"px", top:a.y+"px", minWidth:a.w+"px", height:a.h+"px"}); highlight(); }
}
function select(r,c,extend){
  r=Math.max(0,Math.min(NR-1,r)); c=Math.max(0,Math.min(NC-1,c));
  if(extend){ sel.r2=r; sel.c2=c; } else sel={r,c,r2:r,c2:c};
  const g=rng(); $("tname").textContent = (g.r1===g.r2&&g.c1===g.c2) ? key(r,c) : `${key(g.r1,g.c1)}:${key(g.r2,g.c2)}`;
  if(!editing) $("tfin").value = CELLS[key(sel.r,sel.c)]||"";
  R.querySelectorAll(".tch.on,.trh.on").forEach(x=>x.classList.remove("on"));
  for(let c2=g.c1;c2<=g.c2;c2++) R.querySelector(`.tch[data-c="${c2}"]`).classList.add("on");
  for(let r2=g.r1;r2<=g.r2;r2++) R.querySelector(`.trh[data-r="${r2}"]`).classList.add("on");
  place(); scrollInto(extend?sel.r2:r, extend?sel.c2:c); stat();
}
function scrollInto(r,c){ const b=box(r,c,r,c), hw=46, hh=td(0,0).offsetTop;
  if(b.x-hw < SC.scrollLeft) SC.scrollLeft=b.x-hw; else if(b.x+b.w > SC.scrollLeft+SC.clientWidth) SC.scrollLeft=b.x+b.w-SC.clientWidth;
  if(b.y-hh < SC.scrollTop) SC.scrollTop=b.y-hh; else if(b.y+b.h > SC.scrollTop+SC.clientHeight) SC.scrollTop=b.y+b.h-SC.clientHeight; }
function stat(){ const g=rng(), el=$("tstat"); if(g.r1===g.r2&&g.c1===g.c2){ el.textContent=""; return; }
  const l=[]; for(let r=g.r1;r<=g.r2;r++) for(let c=g.c1;c<=g.c2;c++){ const v=VAL[key(r,c)]; if(typeof v==="number") l.push(v); }
  el.textContent = l.length ? `Somme : ${fmt(sum(l))}` : ""; }

/* --- modifications (avec annuler / rétablir) --- */
function change(fn){ UNDO.push(JSON.stringify(CELLS)); if(UNDO.length>100) UNDO.shift(); REDO=[]; fn(); after(); }
function after(){ S.cells=CELLS; recalc(); paint(); select(sel.r,sel.c); save(); drawChart(); check(true); }
function undo(){ if(!UNDO.length) return; if(editing) cancel(); REDO.push(JSON.stringify(CELLS)); CELLS=JSON.parse(UNDO.pop()); after(); }
function redo(){ if(!REDO.length) return; if(editing) cancel(); UNDO.push(JSON.stringify(CELLS)); CELLS=JSON.parse(REDO.pop()); after(); }
function setCell(k, raw){ raw=raw.trim(); if(raw==="") delete CELLS[k]; else CELLS[k]=normalize(raw); }

/* --- édition --- */
function startEdit(text, caretEnd=true, inBar=false){
  editing={k:key(sel.r,sel.c)}; sel.r2=sel.r; sel.c2=sel.c;
  const e=$("tedit"), f=$("tfin"); e.value=text; f.value=text; e.hidden=false; place();
  const target=inBar?f:e; target.focus({preventScroll:true}); if(caretEnd){ const n=target.value.length; target.setSelectionRange(n,n); }
  highlight();
}
function commit(dr=0, dc=0){
  if(!editing) return; const k=editing.k, raw=$("tedit").value; editing=null; $("tedit").hidden=true; unhighlight();
  if(raw.trim() !== (CELLS[k]||"").trim()) change(()=>setCell(k, raw)); else select(sel.r, sel.c);
  if(dr||dc) select(sel.r+dr, sel.c+dc);
  SC.focus({preventScroll:true});
}
function cancel(){ editing=null; $("tedit").hidden=true; unhighlight(); $("tfin").value=CELLS[key(sel.r,sel.c)]||""; SC.focus({preventScroll:true}); }
const COLORS=["#1a73e8","#e8710a","#188038","#a142f4","#d93025","#12b5cb"];
/* pendant la saisie d'une formule : chaque référence (A1) ou plage (B2:F2) est entourée d'un cadre de couleur, comme dans un vrai tableur */
function unhighlight(){ R.querySelectorAll(".trefbox").forEach(x=>x.remove()); }
function highlight(){ unhighlight(); if(!editing) return; const raw=$("tedit").value; if(!raw || raw[0]!=="=") return;
  const host=$("tsel").parentNode, seen={}; let i=0;
  const re=/\$?([A-Z])\$?(\d+)(?:\s*:\s*\$?([A-Z])\$?(\d+))?/g, txt=raw.slice(1).replace(/"[^"]*"/g,m=>" ".repeat(m.length)).toUpperCase(); let m;
  while((m=re.exec(txt))){ const p=pos(m[1]+m[2]), q=m[3]?pos(m[3]+m[4]):p; if(!inGrid(p)||!inGrid(q)) continue;
    const id=m[0].replace(/[\s$]/g,""); if(!(id in seen)) seen[id]=COLORS[i++%COLORS.length];
    const r1=Math.min(p.r,q.r), r2=Math.max(p.r,q.r), c1=Math.min(p.c,q.c), c2=Math.max(p.c,q.c), b=box(r1,c1,r2,c2), d=document.createElement("div");
    d.className="trefbox"; d.style.setProperty("--hl", seen[id]); Object.assign(d.style,{left:b.x+"px", top:b.y+"px", width:b.w+"px", height:b.h+"px"}); host.appendChild(d); } }
function activeInput(){ return document.activeElement===$("tfin") ? $("tfin") : $("tedit"); }
function canPoint(){ if(!editing) return false; const inp=activeInput(), v=inp.value, i=inp.selectionStart??v.length; const before=v.slice(0,i);
  return v[0]==="=" && /[=+\-*/^(;:]\s*$/.test(before); }
function replaceAt(at, len, t){ const inp=activeInput(), v=inp.value, nv=v.slice(0,at)+t+v.slice(at+len); $("tedit").value=nv; $("tfin").value=nv; inp.focus({preventScroll:true}); inp.setSelectionRange(at+t.length, at+t.length); highlight(); }
function insertRef(k){ const inp=activeInput(), v=inp.value, i=inp.selectionStart??v.length, j=inp.selectionEnd??i; const nv=v.slice(0,i)+k+v.slice(j);
  $("tedit").value=nv; $("tfin").value=nv; inp.focus({preventScroll:true}); inp.setSelectionRange(i+k.length,i+k.length); highlight(); }

/* --- recopie avec la poignée --- */
function fillTo(r,c){
  const g=rng(); let dr=0, dc=0;
  if(r>g.r2) dr=r-g.r2; else if(r<g.r1) dr=r-g.r1;
  if(c>g.c2) dc=c-g.c2; else if(c<g.c1) dc=c-g.c1;
  if(Math.abs(dr)>=Math.abs(dc)) dc=0; else dr=0;
  fill.dr=dr; fill.dc=dc;
  const el=$("tfill"); if(!dr&&!dc){ el.hidden=true; return; }
  const b=box(Math.min(g.r1,g.r1+dr), Math.min(g.c1,g.c1+dc), Math.max(g.r2,g.r2+dr), Math.max(g.c2,g.c2+dc));
  el.hidden=false; Object.assign(el.style,{left:b.x+"px", top:b.y+"px", width:b.w+"px", height:b.h+"px"});
}
function applyFill(){
  const g=rng(), {dr,dc}=fill, h=g.r2-g.r1+1, w=g.c2-g.c1+1; if(!dr&&!dc) return;
  change(()=>{
    if(dr){ const rows=dr>0?COLS(g.r2+1,g.r2+dr):COLS(g.r1+dr,g.r1-1);
      rows.forEach(t=>{ const s=g.r1+(((t-g.r1)%h)+h)%h; for(let c=g.c1;c<=g.c2;c++){ const raw=CELLS[key(s,c)]; setCell(key(t,c), shift(raw||"", t-s, 0)); } }); }
    else { const cols=dc>0?COLS(g.c2+1,g.c2+dc):COLS(g.c1+dc,g.c1-1);
      cols.forEach(t=>{ const s=g.c1+(((t-g.c1)%w)+w)%w; for(let r=g.r1;r<=g.r2;r++){ const raw=CELLS[key(r,s)]; setCell(key(r,t), shift(raw||"", 0, t-s)); } }); }
  });
  const k = dr>0 ? [g.r1,g.c1,g.r2+dr,g.c2] : dr<0 ? [g.r2,g.c1,g.r1+dr,g.c2] : dc>0 ? [g.r1,g.c1,g.r2,g.c2+dc] : [g.r1,g.c2,g.r2,g.c1+dc];
  select(k[0],k[1]); select(k[2],k[3],true);
}
function cellAt(x,y){ const el=document.elementFromPoint(x,y); const t=el && el.closest && el.closest("td.tc"); return t && R.contains(t) ? {r:+t.dataset.r, c:+t.dataset.c} : null; }
function edgeScroll(e){ const s=SC.getBoundingClientRect(); if(e.clientX>s.right-30) SC.scrollLeft+=16; else if(e.clientX<s.left+60) SC.scrollLeft-=16; if(e.clientY>s.bottom-24) SC.scrollTop+=12; else if(e.clientY<s.top+40) SC.scrollTop-=12; }
/* défilement automatique quand on garde la souris près du bord pendant un glisser (comme dans un vrai tableur) */
let lastPE=null, autoT=null;
function cellNear(e){ const s=SC.getBoundingClientRect(); return cellAt(Math.min(s.right-34, Math.max(s.left+64, e.clientX)), Math.min(s.bottom-28, Math.max(s.top+44, e.clientY))); }
function autoTick(){ if(!SC || !lastPE || !(fill || pt || (drag && !drag.touch))) return; const e=lastPE, s=SC.getBoundingClientRect();
  if(!(e.clientX>s.right-30 || e.clientX<s.left+60 || e.clientY>s.bottom-24 || e.clientY<s.top+40)) return;
  edgeScroll(e); const p=cellNear(e); if(!p) return;
  if(fill) fillTo(p.r,p.c);
  else if(pt){ const t=(p.r===pt.r&&p.c===pt.c)?key(p.r,p.c):key(Math.min(p.r,pt.r),Math.min(p.c,pt.c))+":"+key(Math.max(p.r,pt.r),Math.max(p.c,pt.c)); replaceAt(pt.at, pt.len, t); pt.len=t.length; }
  else if(p.r!==sel.r2||p.c!==sel.c2){ drag.moved=true; select(p.r,p.c,true); } }

let toastT=null;
function toast(t){ const el=$("ttoast"); el.textContent=t; el.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>{ el.hidden=true; },2600); }

function bind(){
  R.querySelector(".tsheet").addEventListener("click", e=>{ const o=e.target.closest(".off"); if(o) toast("Ce bouton existe dans un vrai tableur, mais on n'en a pas besoin aujourd'hui."); });
  R.querySelectorAll("[data-act]").forEach(b=>b.onclick=()=>{ const a=b.dataset.act; if(a==="undo") undo(); else if(a==="redo") redo(); else insertChart(); SC.focus({preventScroll:true}); });
  /* clic sur une cellule */
  SC.addEventListener("pointerdown", e=>{
    if(e.target.closest("#thandle")||e.target.closest("#tedit")) return;
    const t=e.target.closest("td.tc"); const hdr=e.target.closest("th.tch,th.trh");
    if(hdr && !editing){ e.preventDefault(); if(hdr.classList.contains("tch")){ const c=+hdr.dataset.c; select(0,c); select(NR-1,c,true); } else { const r=+hdr.dataset.r; select(r,0); select(r,NC-1,true); } SC.focus({preventScroll:true}); return; }
    if(!t) return;
    const r=+t.dataset.r, c=+t.dataset.c;
    if(canPoint()){ e.preventDefault(); const inp=activeInput(); pt={r,c, at:inp.selectionStart??inp.value.length, len:key(r,c).length}; insertRef(key(r,c)); SC.setPointerCapture(e.pointerId); return; }
    if(editing) commit();
    const was = sel.r===r && sel.c===c && sel.r2===r && sel.c2===c;
    if(e.shiftKey){ select(r,c,true); e.preventDefault(); SC.focus({preventScroll:true}); return; }
    select(r,c);
    if(e.pointerType!=="touch"){ e.preventDefault(); SC.focus({preventScroll:true}); drag={moved:false, was}; SC.setPointerCapture(e.pointerId); }
    else drag={moved:false, was, touch:true};
  });
  clearInterval(autoT); autoT=setInterval(autoTick, 60);
  if(!window.__tabPE){ window.__tabPE=1; document.addEventListener("pointermove", e=>{ lastPE=e; }, {passive:true}); }
  SC.addEventListener("pointermove", e=>{ if(pt){ edgeScroll(e); const p=cellAt(e.clientX,e.clientY); if(p){ const t=(p.r===pt.r&&p.c===pt.c)?key(p.r,p.c):key(Math.min(p.r,pt.r),Math.min(p.c,pt.c))+":"+key(Math.max(p.r,pt.r),Math.max(p.c,pt.c)); replaceAt(pt.at, pt.len, t); pt.len=t.length; } return; }
    if(!drag || drag.touch) return; const p=cellAt(e.clientX,e.clientY); edgeScroll(e);
    if(p && (p.r!==sel.r2||p.c!==sel.c2)){ drag.moved=true; select(p.r,p.c,true); } });
  SC.addEventListener("pointerup", ()=>{ if(pt){ pt=null; return; } if(drag && drag.touch && !drag.moved && drag.was) startEdit(CELLS[key(sel.r,sel.c)]||""); drag=null; });
  SC.addEventListener("pointercancel", ()=>{ drag=null; });
  SC.addEventListener("dblclick", e=>{ if(e.target.closest("td.tc") && !editing) startEdit(CELLS[key(sel.r,sel.c)]||""); });
  SC.addEventListener("scroll", ()=>{ if(editing) place(); });
  /* poignée de recopie */
  const H=$("thandle");
  H.addEventListener("pointerdown", e=>{ e.preventDefault(); e.stopPropagation(); if(editing) commit(); fill={dr:0,dc:0}; H.setPointerCapture(e.pointerId); });
  H.addEventListener("pointermove", e=>{ if(!fill) return; lastPE=e; edgeScroll(e); const p=cellAt(e.clientX,e.clientY)||cellNear(e); if(p) fillTo(p.r,p.c); });
  H.addEventListener("pointerup", ()=>{ if(!fill) return; $("tfill").hidden=true; applyFill(); fill=null; SC.focus({preventScroll:true}); });
  H.addEventListener("pointercancel", ()=>{ fill=null; $("tfill").hidden=true; });
  /* clavier sur la feuille */
  SC.addEventListener("keydown", e=>{
    if(editing || e.target!==SC) return;
    const k=e.key, mod=e.ctrlKey||e.metaKey;
    if(mod && (k==="z"||k==="Z")){ e.preventDefault(); e.shiftKey?redo():undo(); return; }
    if(mod && (k==="y"||k==="Y")){ e.preventDefault(); redo(); return; }
    const mv={ArrowUp:[-1,0],ArrowDown:[1,0],ArrowLeft:[0,-1],ArrowRight:[0,1]}[k];
    if(mv){ e.preventDefault(); if(e.shiftKey) select(sel.r2+mv[0], sel.c2+mv[1], true); else select(sel.r+mv[0], sel.c+mv[1]); return; }
    if(k==="Enter"||k==="F2"){ e.preventDefault(); startEdit(CELLS[key(sel.r,sel.c)]||""); return; }
    if(k==="Tab"){ e.preventDefault(); select(sel.r, sel.c+(e.shiftKey?-1:1)); return; }
    if(k==="Delete"||k==="Backspace"){ e.preventDefault(); const g=rng(); change(()=>{ for(let r=g.r1;r<=g.r2;r++) for(let c=g.c1;c<=g.c2;c++) delete CELLS[key(r,c)]; }); return; }
    if(k.length===1 && !mod && !e.altKey){ e.preventDefault(); startEdit(k); }
  });
  /* zone de saisie dans la cellule et barre de formule */
  const E=$("tedit"), F=$("tfin");
  const onKey = e=>{
    if(e.key==="Enter"){ e.preventDefault(); commit(e.shiftKey?-1:1, 0); }
    else if(e.key==="Tab"){ e.preventDefault(); commit(0, e.shiftKey?-1:1); }
    else if(e.key==="Escape"){ e.preventDefault(); cancel(); }
  };
  E.addEventListener("keydown", onKey); F.addEventListener("keydown", onKey);
  E.addEventListener("input", ()=>{ F.value=E.value; highlight(); });
  F.addEventListener("input", ()=>{ E.value=F.value; highlight(); });
  F.addEventListener("focus", ()=>{ if(!editing) startEdit(CELLS[key(sel.r,sel.c)]||"", true, true); });
  const out = ()=>setTimeout(()=>{ const a=document.activeElement; if(editing && a!==E && a!==F) commit(); }, 0);
  E.addEventListener("blur", out); F.addEventListener("blur", out);
}

/* --- panneau des missions --- */
function done(i){ const M=MISSIONS[i]; return M.test()===true && (!M.q || !!S.ans[i] && M.q.ok(S.ans[i])); }
function panel(){
  const PN=$("tpanel"), i=S.m, M=MISSIONS[i];
  const steps=SUB.map((j,k)=>{ const m=MISSIONS[j]; return `<button class="tstep${j===i?" on":""}${S.done.includes(j)?" ok":""}${m.defi?" defi":""}" data-j="${j}" aria-label="Mission ${k+1}${m.defi?" (défi)":""}${S.done.includes(j)?" (réussie)":""}">${k+1}</button>`; }).join("");
  if(OPT.onChange) OPT.onChange(i, S.done.slice());
  let q="";
  if(M.q && M.q.choix) q=`<div class="tq"><span class="tqlab">${M.q.lab}</span>${M.q.choix.map(x=>`<button class="btn tchoice${S.ans[i]===x?" sel":""}" data-x="${x}">${x}</button>`).join("")}</div>`;
  else if(M.q) q=`<div class="tq"><label class="tqlab" for="tqin">${M.q.lab}</label><input id="tqin" class="tqin" autocomplete="off" value="${(S.ans[i]||"").replace(/"/g,"&quot;")}"></div>`;
  PN.innerHTML = `<div class="tsteps">${steps}</div>
    <h2>Mission ${numero(i)}${OPT.niv?" sur "+SUB.length:""}${M.defi?" · Défi":""}</h2><h3>${M.t.replace(/^Défi : /,"")}</h3>
    <div class="tconsigne">${M.h}${M.q&&!M.h2?q:""}${M.h2?q+M.h2:""}</div>
    <button class="btn primary" id="tcheck">Vérifier</button>
    <div class="tmsg" id="tmsg" hidden></div>
    <details class="lhelp"><summary>Besoin d'aide ?</summary><p>${M.aide}</p></details>
    ${allDone()?retenir():""}
    <p class="treset"><button class="linkbtn" id="treset">Recommencer la séance depuis le début</button></p>`;
  PN.querySelectorAll(".tstep").forEach(b=>b.onclick=()=>{ S.m=+b.dataset.j; save(); panel(); });
  PN.querySelectorAll(".tchoice").forEach(b=>b.onclick=()=>{ S.ans[i]=b.dataset.x; save(); panel(); check(false, true); });
  const qi=$("tqin"); if(qi){ qi.addEventListener("input", ()=>{ S.ans[i]=qi.value; save(); }); qi.addEventListener("keydown", e=>{ if(e.key==="Enter") check(false); }); }
  $("tcheck").onclick=()=>check(false);
  const rb=$("treset"); rb.onclick=()=>{ if(rb.dataset.sure){ S=fresh(); S.m=SUB[0]; CELLS=S.cells; UNDO=[]; REDO=[]; save(); recalc(); paint(); select(0,1); panel(); drawChart(); }
    else { rb.dataset.sure=1; rb.textContent="Tout sera effacé : clique encore pour confirmer."; } };
  if(S.done.includes(i)) msg(`<b>Mission réussie !</b> ${M.bravo}${nextBtn(i)}`, "ok");
  if(TB) paint();
}
const nextOf = i => SUB[SUB.indexOf(i)+1];
const nextBtn = i => nextOf(i)!==undefined ? `<br><button class="btn primary" id="tnext">Mission suivante →</button>` : OPT.onFin ? `<br><button class="btn primary" id="tfinb">${OPT.fin||"Terminer la séance"} →</button>` : "";
function retenir(){ return `<div class="tretenir"><h3>Ce qu'il faut retenir</h3><ul>${P.ret}</ul></div>`; }
function msg(h, kind){ const el=$("tmsg"); if(!el) return; el.hidden=!h; el.className="tmsg "+(kind||""); el.innerHTML=h;
  const n=$("tnext"); if(n) n.onclick=()=>{ S.m=nextOf(S.m); save(); panel(); };
  const fb=$("tfinb"); if(fb) fb.onclick=()=>OPT.onFin(S.done.slice()); }
/* auto : vérification silencieuse après chaque modification */
function check(auto, fromChoice){
  const i=S.m, M=MISSIONS[i];
  if(done(i)){
    const first=!S.done.includes(i), avant=allDone(); if(first){ S.done.push(i); save(); }
    if(first || !auto) panel();
    if(first && !avant && allDone() && OPT.onFin) OPT.onFin(S.done.slice());
    return;
  }
  if(auto) return;
  const t=M.test();
  if(t!==true){ msg(`<b>Pas encore !</b> ${t}`, "ko"); return; }
  if(M.q){ const a=S.ans[i]; msg(!a ? "<b>Presque !</b> Le tableau est juste : réponds maintenant à la question." : `<b>Ta réponse n'est pas la bonne.</b> ${fromChoice?"Relis la consigne, ":"Regarde bien le tableur, "}puis essaie encore.`, "ko"); }
}
function levels(pack){ return (PACKS[pack]||PACKS["6e"]).missions.map(M=>({t:M.t, defi:!!M.defi})); }
function destroy(){ OPT={}; clearInterval(autoT); autoT=null; lastPE=null; if(RO){ RO.disconnect(); RO=null; } R=null; SC=null; TB=null; editing=null; fill=null; drag=null; }
return {init, destroy, levels, PACKS, _t:{tokenize, parse, shift, setCells:c=>{ CELLS=c; recalc(); return VAL; }}};
})();
