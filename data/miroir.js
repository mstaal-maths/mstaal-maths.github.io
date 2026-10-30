/* Le miroir (6e, chapitre Symétrie axiale) : compléter une figure sur quadrillage pour qu'elle soit symétrique
   par rapport à l'axe rouge. Axe vertical, horizontal, sur une colonne de cases, puis en diagonale ; défi à deux axes. */
window.MIROIR = (function(){
const COUL = {a:"#2c7be5", b:"#f5b301", c:"#e8413c", d:"#2e9d5b", e:"#7a3fd0", f:"#f7a8c4", g:"#9a6a44", h:"#1f1f1f", i:"#f28c1e", j:"#b9c3cf", k:"#d6457a", l:"#ecd3a3"};
/* figures : '.' vide, lettre = couleur ; la grille entière est donnée, l'élève ne voit que la partie « donnée » */
const LV = [
 {titre:"Le sapin", groupe:"Premières figures", axe:{t:"v"}, aide:"Chaque case colorée a une case jumelle de l'autre côté de l'axe, à la même distance de l'axe et sur la même ligne.",
  m:["....dd....","...dddd...","..dddddd..","...dddd...","..dddddd..",".dddddddd.","....bb....","....bb...."]},
 {titre:"La fusée", axe:{t:"v"}, aide:"Compte les cases entre la case colorée et l'axe : la jumelle est à la même distance, de l'autre côté.",
  m:["....cc....","...caac...","...aaaa...","...abba...","...aaaa...","..caaaac..",".cc.aa.cc.","....cc...."]},
 {titre:"Le papillon", axe:{t:"v"}, aide:"Attention aux cases éloignées de l'axe : compte bien les carreaux.",
  m:["e........e","ee.e..e.ee","eebe..ebee","eebbaabbee",".eeeaaeee.","..eeaaee..",".eee..eee.","ee......ee"]},
 {titre:"Axe horizontal", axe:{t:"h"}, aide:"L'axe est horizontal : la case jumelle est sur la même colonne, à la même distance de l'axe, mais de l'autre côté (en dessous).",
  m:["..aaaaaa..",".a......a.","a..b..b..a","a........a","a..cccc..a",".a.c..c.a.","..aaaaaa..","..aaaaaa..",".a.c..c.a.","a..cccc..a","a........a","a..b..b..a",".a......a.","..aaaaaa.."].slice(0,14), moitie:7},
 {titre:"Le bateau", axe:{t:"h"}, aide:"Le reflet dans l'eau : chaque case a sa jumelle de l'autre côté de l'axe, sur la même colonne.",
  m:["....c.......",".....c......","....ccc.....","....b.......","....b.......","bbbbbbbbbbb.",".aaaaaaaaa..","..aaaaaaa...","..aaaaaaa...",".aaaaaaaaa..","bbbbbbbbbbb.","....b.......","....b.......","....ccc.....",".....c......","....c......."], moitie:8},
 {titre:"L'axe passe sur des cases", axe:{t:"vc"}, aide:"Ici, l'axe passe au milieu d'une colonne de cases : les cases de cette colonne sont leur propre symétrique, elles ne bougent pas.",
  m:[".....b.....","....bab....","...bbabb...","..b..a..b..","....aaa....","...aaaaa...","..d..a..d..",".ddd.a.ddd."]},
 {titre:"Le visage", axe:{t:"vc"}, aide:"Les cases sur l'axe restent en place ; pour les autres, compte la distance jusqu'à la colonne de l'axe.",
  m:["...bbbbb...","..b.....b..",".b.aa.aa.b.",".b.......b.",".b...c...b.",".b.e...e.b.","..b.eee.b..","...bbbbb..."]},
 {titre:"Axe en diagonale", axe:{t:"d"}, aide:"L'axe est en diagonale. Une case située 2 carreaux à droite de l'axe et 1 carreau au-dessus a sa jumelle… 2 carreaux en dessous et 1 à gauche. Plus simple : la case (ligne, colonne) devient la case (colonne, ligne).",
  m:["aaaa....","a..ab...","a..ab...","aaaa.c..",".bb..c..","....cc.d","......dd",".......d"]},
 {titre:"Diagonale : la flèche", axe:{t:"d"}, aide:"Pour chaque case colorée, trace dans ta tête la perpendiculaire à l'axe : la jumelle est sur cette ligne, à la même distance de l'axe.",
  m:["a.cccc..",".a.bb.c.","..a.bb.c","...a.bb.","....a.b.",".....a..","......a.",".......a"]},
 {titre:"L'axolotl", groupe:"Grands dessins", axe:{t:"v"}, aide:"Le dessin est plus grand : avance ligne par ligne. Pour chaque case colorée, compte le nombre de carreaux jusqu'à l'axe, puis reporte-le de l'autre côté.",
  m:['k.k......k.k', '.kk......kk.', 'kkkffffffkkk', '..ffffffff..', '.fhhffffhhf.', '.fhhffffhhf.', '.kffffffffk.', '..ffhffhff..', '...ffhhff...', '....ffff....']},
 {titre:"Le capybara et sa clémentine", axe:{t:"vc"}, aide:"L'axe passe au milieu d'une colonne : les cases de cette colonne ne bougent pas. Pour les autres, compte les carreaux jusqu'à la colonne de l'axe.",
  m:['......d......', '.....iii.....', '....iiiii....', '.....iii.....', '.gg.ggggg.gg.', '.ggggggggggg.', '.gghggggghgg.', '.ggggggggggg.', '..ggggggggg..', '..ggghghggg..', '...ggggggg...']},
 {titre:"Le panda", axe:{t:"v"}, aide:"Les cases blanches comptent aussi : une case vide a une jumelle vide. Vérifie bien les taches noires autour des yeux, ligne par ligne.",
  m:['.hh......hh.', 'hhhjjjjjjhhh', '.hj......jh.', '.j.hh..hh.j.', 'j.hhh..hhh.j', 'j.hh....hh.j', 'j..........j', 'j...hhhh...j', '.j..h..h..j.', '..j......j..', '...jjjjjj...']},
 {titre:"Le reflet du champignon", axe:{t:"h"}, aide:"L'axe est la surface de l'eau : le reflet est à l'envers. La ligne juste au-dessus de l'axe se retrouve juste en dessous, la deuxième ligne au-dessus se retrouve deuxième en dessous, etc.",
  m:['....cccc....', '..cc.ccccc..', '.cccccc..cc.', 'cc..cccccccc', 'cccccccc..cc', '....llll....', 'dd..llll..dd', 'dd..llll..dd', '....llll....', 'cccccccc..cc', 'cc..cccccccc', '.cccccc..cc.', '..cc.ccccc..', '....cccc....']},
 {titre:"Défi : deux axes", defi:true, axe:{t:"vh"}, aide:"La figure est symétrique par rapport aux DEUX axes. Complète d'abord avec l'axe vertical, puis avec l'axe horizontal.",
  m:["a..........a",".a...bb...a.","..a.b..b.a..","...cbccbc...","..bcceeccb..",".b.ceddec.b.",".b.ceddec.b.","..bcceeccb..","...cbccbc...","..a.b..b.a..",".a...bb...a.","a..........a"]}
];
/* moitié montrée selon l'axe */
function montre(L, r, c){ const h=L.m.length, w=L.m[0].length, a=L.axe.t;
  if(a==="v") return c < w/2;
  if(a==="vc") return c <= (w-1)/2;
  if(a==="h") return r < (L.moitie||h/2);
  if(a==="d") return c >= r;            /* au-dessus de la diagonale (et sur la diagonale) */
  if(a==="vh") return c < w/2 && r < h/2;
}
/* case « miroir » d'une case cachée (dans la partie montrée) */
function image(L,r,c){ const h=L.m.length, w=L.m[0].length, a=L.axe.t;
  if(a==="v"||a==="vc") return [r, w-1-c];
  if(a==="h"){ const k=L.moitie||h/2; return [2*k-1-r, c]; }
  if(a==="d") return [c, r];
  if(a==="vh") return [r<h/2?r:h-1-r, c<w/2?c:w-1-c];
}
/* figure complète attendue : la partie montrée + son symétrique (calculé, donc toujours juste) */
function complete(L){ return L.m.map((row,r)=>[...row].map((ch,c)=>{ if(montre(L,r,c)) return ch; const [i,j]=image(L,r,c); return L.m[i][j]; }).join("")); }
let R0=null, cur=0, grid=null, couleur="a", done=[], peint=false, shown=false;
const KEY="staal-miroir6-";
const store={ get(k){ try{ return localStorage.getItem(KEY+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(KEY+k,v); }catch(e){} } };
const $ = id => R0.querySelector("#"+id);
function init(root){
  R0=root; try{ done=JSON.parse(store.get("done")||"[]"); }catch(e){ done=[]; }
  root.innerHTML=`<div class="mir">
    <div class="glevels" id="mlevels"></div>
    <div class="ggrid">
      <div class="gmain"><div class="mpal" id="mpal"></div><div class="mboard" id="mboard"></div></div>
      <aside class="gside"><h2 id="mtitre"></h2><p class="gcons" id="mcons"></p>
        <button class="btn primary" id="mok">Vérifier ma figure</button> <button class="btn" id="mclear">Tout effacer</button>
        <div class="lmsg" id="mmsg" hidden></div>
        <details class="lhelp" id="mhelp"><summary>Besoin d'aide ?</summary><p id="maide"></p></details></aside>
    </div></div>`;
  $("mok").onclick=()=>verifier(true);
  $("mclear").onclick=()=>{ const L=LV[cur]; grid=L.m.map((row,r)=>[...row].map((ch,c)=>montre(L,r,c)?ch:".")); shown=false; draw(); msg(""); };
  document.addEventListener("pointerup", up);
  let st=+(store.get("niveau")||0); if(!(st>=0&&st<LV.length)) st=0; load(st);
}
function up(){ if(peint){ peint=false; verifier(false); } }
function load(i){
  cur=i; store.set("niveau",i); const L=LV[i]; shown=false; if(!L.full) L.full=complete(L);
  grid=L.m.map((row,r)=>[...row].map((ch,c)=>montre(L,r,c)?ch:"."));
  const cols=[...new Set(L.m.join("").replace(/\./g,""))].sort(); couleur=cols[0];
  $("mlevels").innerHTML = LV.map((l,j)=>(l.defi?`<span class="ggroupe">Défi</span>`:"")+`<button class="lnum${j===i?" on":""}${done.includes(j)?" ok":""}${l.defi?" defi":""}" data-i="${j}" aria-label="Niveau ${j+1}">${j+1}</button>`).join("");
  R0.querySelectorAll("#mlevels .lnum").forEach(b=>b.onclick=()=>load(+b.dataset.i));
  $("mtitre").textContent=`Niveau ${i+1} · ${L.titre.replace(/^Défi : /,"Défi · ")}`;
  const ax={v:"l'axe rouge (vertical)", vc:"l'axe rouge (il passe au milieu d'une colonne de cases)", h:"l'axe rouge (horizontal)", d:"l'axe rouge (en diagonale)", vh:"les deux axes rouges"}[L.axe.t];
  $("mcons").innerHTML=`Colorie les cases pour que la figure soit <b>symétrique</b> par rapport à ${ax}. Choisis la couleur en haut, puis clique sur les cases (clique de nouveau pour effacer).`;
  $("maide").innerHTML=L.aide;
  $("mpal").innerHTML = cols.map(c=>`<button class="mcol${c===couleur?" on":""}" data-c="${c}" style="background:${COUL[c]}" aria-label="Couleur"></button>`).join("") + `<button class="mcol gomme${couleur==="."?" on":""}" data-c="." aria-label="Gomme">⌫</button>`;
  R0.querySelectorAll(".mcol").forEach(b=>b.onclick=()=>{ couleur=b.dataset.c; R0.querySelectorAll(".mcol").forEach(x=>x.classList.toggle("on",x===b)); });
  const h=$("mhelp"); if(h) h.open=false; msg(""); draw();
}
function draw(){
  const L=LV[cur], h=L.m.length, w=L.m[0].length, S=1;
  let g=`<svg viewBox="-0.2 -0.2 ${w+0.4} ${h+0.4}" class="msvg" role="img" aria-label="Quadrillage">`;
  for(let r=0;r<h;r++) for(let c=0;c<w;c++){ const v=grid[r][c], fixe=montre(L,r,c) && L.m[r][c]!==".";
    let cls="mc"+(fixe?" fixe":""); if(shown){ const want=L.full[r][c]; if(v!==want) cls+= v==="." ? " manque" : " faux"; }
    g+=`<rect x="${c}" y="${r}" width="${S}" height="${S}" data-r="${r}" data-c="${c}" class="${cls}" fill="${v==="."?"#fff":COUL[v]}"/>`;
    if(shown && v!==L.full[r][c] && v!==".") g+=`<path d="M${c+.25} ${r+.25}L${c+.75} ${r+.75}M${c+.75} ${r+.25}L${c+.25} ${r+.75}" class="mx"/>`; }
  const a=L.axe.t;
  if(a==="v"||a==="vh") g+=`<line x1="${w/2}" y1="-0.2" x2="${w/2}" y2="${h+0.2}" class="maxe"/>`;
  if(a==="vc") g+=`<line x1="${w/2}" y1="-0.2" x2="${w/2}" y2="${h+0.2}" class="maxe"/>`;
  if(a==="h") g+=`<line x1="-0.2" y1="${L.moitie||h/2}" x2="${w+0.2}" y2="${L.moitie||h/2}" class="maxe"/>`;
  if(a==="vh") g+=`<line x1="-0.2" y1="${h/2}" x2="${w+0.2}" y2="${h/2}" class="maxe"/>`;
  if(a==="d") g+=`<line x1="-0.2" y1="-0.2" x2="${w+0.2}" y2="${h+0.2}" class="maxe"/>`;
  $("mboard").innerHTML=g+"</svg>";
  R0.querySelectorAll(".mc").forEach(el=>{ el.onpointerdown=e=>{ e.preventDefault(); if(e.pointerType!=="mouse" && el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); peint=true; paint(el); }; el.onpointerenter=()=>{ if(peint) paint(el); }; });
}
function paint(el){
  const L=LV[cur], r=+el.dataset.r, c=+el.dataset.c; if(montre(L,r,c)){ msg("Cette partie est déjà faite : colorie de l'<b>autre côté</b> de l'axe.", ""); return; }
  grid[r][c] = grid[r][c]===couleur ? "." : couleur; shown=false;
  el.setAttribute("fill", grid[r][c]==="."?"#fff":COUL[grid[r][c]]);
}
function verifier(manuel){
  const L=LV[cur]; let manque=0, faux=0;
  L.full.forEach((row,r)=>[...row].forEach((ch,c)=>{ const v=grid[r][c]; if(v!==ch){ if(v===".") manque++; else faux++; } }));
  if(!manque && !faux){ shown=false; draw();
    if(!done.includes(cur)){ done.push(cur); store.set("done", JSON.stringify(done)); }
    R0.querySelector(`#mlevels .lnum[data-i="${cur}"]`).classList.add("ok");
    msg(`<b>Bravo, la figure est symétrique !</b> Si on pliait le quadrillage le long de l'axe, les deux moitiés se superposeraient exactement.${cur<LV.length-1?`<br><button class="btn primary" id="mnext">Niveau suivant →</button>`:"<br>Tu as terminé tous les niveaux !"}`, "ok");
    const n=$("mnext"); if(n) n.onclick=()=>load(cur+1); return; }
  if(!manuel) return;
  shown=true; draw();
  msg(`<b>Pas encore !</b> ${manque?`Il manque ${manque} case${manque>1?"s":""} (entourée${manque>1?"s":""} en pointillés). `:""}${faux?`${faux} case${faux>1?"s sont":" est"} en trop ou de la mauvaise couleur (marquée${faux>1?"s":""} d'une croix).`:""}`, "ko");
}
function msg(h,k){ const el=$("mmsg"); if(!el) return; el.hidden=!h; el.className="lmsg "+(k||""); el.innerHTML=h; }
function destroy(){ document.removeEventListener("pointerup", up); R0=null; }
return {init, destroy, LV, montre, complete};
})();
