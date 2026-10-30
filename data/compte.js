/* « Le compte est bon » (5e, chapitre « Enchaînement d'opérations ») :
   atteindre la cible avec les plaques et les 4 opérations, puis écrire le calcul en UNE SEULE expression,
   avec des parenthèses si besoin. Pas de nombres négatifs, les divisions doivent tomber juste. */
window.COMPTE = (function(){
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = l => l[Math.floor(Math.random()*l.length)];
const shuf = l => { l=l.slice(); for(let i=l.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [l[i],l[j]]=[l[j],l[i]]; } return l; };
const SIGN = {"+":"+","-":"−","*":"×","/":"÷"};
const PREC = {"+":1,"-":1,"*":2,"/":2};

/* --- combiner deux nombres (règles du jeu) --- */
function apply(a, op, b){
  if(op==="+") return a+b;
  if(op==="-") return a-b>=0 ? a-b : null;
  if(op==="*") return a*b;
  if(op==="/") return b!==0 && a%b===0 ? a/b : null;
}
/* un « élément » : {v valeur, s écriture, p priorité (3 = nombre seul), used: indices des plaques} */
function combine(x, op, y){
  const v=apply(x.v,op,y.v); if(v===null) return null; const p=PREC[op];
  const L = x.p<p ? `(${x.s})` : x.s;
  const R = (y.p<p || (y.p===p && (op==="-"||op==="/"))) ? `(${y.s})` : y.s;
  return {v, s:`${L} ${SIGN[op]} ${R}`, p, used:x.used.concat(y.used), step:{a:x, op, b:y}};
}
/* toutes les expressions possibles (petits tirages, ≤ 4 plaques) */
function allExpr(pl){
  const out=[];
  function rec(items){
    items.forEach(it=>out.push(it));
    for(let i=0;i<items.length;i++) for(let j=0;j<items.length;j++){ if(i===j) continue;
      const rest=items.filter((_,k)=>k!==i&&k!==j);
      for(const op of ["+","-","*","/"]){
        if((op==="+"||op==="*") && j<i) continue;
        const c=combine(items[i],op,items[j]); if(!c || c.v===items[i].v && (op==="*"||op==="/") ) continue;
        rec(rest.concat([c]));
      }
    }
  }
  rec(pl.map((v,i)=>({v, s:String(v), p:3, used:[i]})));
  return out;
}
const atom = (v,i) => ({v, s:String(v), p:3, used:[i]});

/* --- les niveaux --- */
const LEVELS = [
 {titre:"Pour commencer", n:3, aide:"Avec trois plaques. Pas besoin de parenthèses : pense aux priorités (× avant +).", gen:()=>gen3(false)},
 {titre:"Les parenthèses", n:3, aide:"Dans ce niveau, il faut des parenthèses pour écrire le calcul en une seule ligne.", gen:()=>gen3(true)},
 {titre:"Quatre plaques", n:4, aide:"Quatre plaques, une cible jusqu'à 150. Tu n'es pas obligé d'utiliser toutes les plaques.", gen:()=>genN({k:4, pool:[1,2,3,4,5,6,7,8,9,10], use:[3,4], ops:["+","-","*"], min:20, max:150})},
 {titre:"Avec la division", n:4, aide:"La solution proposée utilise une division : elle doit tomber juste.", gen:()=>genN({k:4, pool:[2,3,4,5,6,8,10,12,25], use:[3,4], ops:["+","-","*","/"], needDiv:true, min:10, max:120})},
 {titre:"Cinq plaques", n:5, aide:"Cinq plaques, une cible à 3 chiffres. Cherche d'abord un produit proche de la cible.", gen:()=>genN({k:5, pool:[1,2,3,4,5,6,7,8,9,10,25,50], use:[3,5], ops:["+","-","*","/"], min:100, max:500})},
 {titre:"Défi : comme à la télé", defi:true, n:6, aide:"Six plaques et une cible entre 101 et 999, comme dans l'émission. Il existe toujours au moins une solution !", gen:()=>genN({k:6, tele:true, use:[4,6], ops:["+","-","*","/"], min:101, max:999})}
];
const PAR_NIVEAU = 5;

function gen3(paren){
  for(let t=0;t<4000;t++){
    const pl=[rnd(2,10),rnd(2,10),rnd(2,12)];
    const ops=["+","-","*"]; const o1=pick(ops), o2=pick(ops);
    const [a,b,c]=shuf([0,1,2]).map(i=>atom(pl[i],i));
    let e = Math.random()<.5 ? combine(combine(a,o1,b)||a, o2, c) : combine(a, o1, combine(b,o2,c)||b);
    if(!e || e.used.length!==3) continue;
    const hasPar=e.s.includes("(");
    if(hasPar!==paren || e.v<10 || e.v>80 || pl.includes(e.v)) continue;
    if(!paren && !e.s.includes("×")) continue;                 /* niveau 1 : au moins une multiplication (priorités) */
    const sols=allExpr(pl).filter(x=>x.v===e.v);
    if(sols.some(x=>x.used.length<3)) continue;                 /* il faut bien les 3 plaques */
    if(paren && sols.some(x=>!x.s.includes("("))) continue;     /* les parenthèses sont indispensables */
    return {pl, cible:e.v, sol:e};
  }
}
function genN(o){
  for(let t=0;t<20000;t++){
    let pl;
    if(o.tele){ const petites=shuf([1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10]), grandes=shuf([25,50,75,100]); const ng=rnd(1,2); pl=shuf(grandes.slice(0,ng).concat(petites.slice(0,6-ng))); }
    else pl=Array.from({length:o.k},()=>pick(o.pool));
    let items=shuf(pl.map((v,i)=>atom(v,i))).slice(0, rnd(o.use[0],o.use[1]));
    let usedDiv=false;
    while(items.length>1){
      const i=rnd(0,items.length-1); let j=rnd(0,items.length-2); if(j>=i) j++;
      const op=pick(o.ops); const c=combine(items[i],op,items[j]);
      if(!c || c.v===0 || ((op==="*"||op==="/") && (items[i].v===1||items[j].v===1))) { if(Math.random()<.3) break; continue; }
      if(op==="/") usedDiv=true;
      items=items.filter((_,k)=>k!==i&&k!==j).concat([c]);
    }
    if(items.length!==1 || items[0].p===3) continue;
    const e=items[0];
    if(e.v<o.min || e.v>o.max || pl.includes(e.v) || (o.needDiv && !usedDiv)) continue;
    /* pas trop facile : la cible ne s'obtient pas avec un seul calcul de deux plaques */
    let trop=false; for(let a=0;a<pl.length&&!trop;a++) for(let b=0;b<pl.length&&!trop;b++) if(a!==b) for(const op of ["+","-","*","/"]) if(apply(pl[a],op,pl[b])===e.v){ trop=true; break; }
    if(trop) continue;
    return {pl, cible:e.v, sol:e};
  }
}
/* première étape de la solution (le calcul le plus « profond ») */
function firstStep(e){ let s=e; while(s.step && (s.step.a.step || s.step.b.step)) s = s.step.a.step ? s.step.a : s.step.b; return s.step ? `${s.step.a.v} ${SIGN[s.step.op]} ${s.step.b.v} = ${s.v}` : null; }
function stepsOf(e){ const l=[]; (function rec(x){ if(!x.step) return; rec(x.step.a); rec(x.step.b); l.push(`${x.step.a.v} ${SIGN[x.step.op]} ${x.step.b.v} = ${x.v}`); })(e); return l; }

/* --- lecture de l'expression écrite par l'élève --- */
function tokenize(str){
  const t=[]; let i=0; const s=str.replace(/\s+/g,"");
  while(i<s.length){ const c=s[i];
    if(/\d/.test(c)){ let j=i; while(j<s.length && /\d/.test(s[j])) j++; t.push({k:"n", v:+s.slice(i,j)}); i=j; continue; }
    if("+".includes(c)){ t.push({k:"+"}); i++; continue; }
    if("-−–".includes(c)){ t.push({k:"-"}); i++; continue; }
    if("*×xX·".includes(c)){ t.push({k:"*"}); i++; continue; }
    if("/÷:".includes(c)){ t.push({k:"/"}); i++; continue; }
    if(c==="("||c===")"){ t.push({k:c}); i++; continue; }
    if(c===","||c==="."){ throw {msg:"Pas de nombres à virgule dans ce jeu : utilise seulement les nombres des plaques."}; }
    throw {msg:`Le signe « ${c} » n'est pas permis. Utilise + − × ÷ et les parenthèses.`};
  }
  return t;
}
function parse(T){
  let p=0; const is=k=>T[p]&&T[p].k===k;
  const bad=()=>{ throw {msg:"Ton calcul est mal écrit : vérifie les signes et les parenthèses."}; };
  function expr(){ let a=term(); while(is("+")||is("-")){ const op=T[p++].k; a={op,a,b:term()}; } return a; }
  function term(){ let a=prim(); while(is("*")||is("/")){ const op=T[p++].k; a={op,a,b:prim()}; } return a; }
  function prim(){ if(is("n")) return {n:T[p++].v}; if(is("(")){ p++; const e=expr(); if(!is(")")) throw {msg:"Il manque une parenthèse fermante « ) »."}; p++; return e; }
    if(is("-")) throw {msg:"Dans ce jeu, pas de nombres négatifs."}; bad(); }
  if(!T.length) throw {msg:"Écris ton calcul."};
  const e=expr(); if(p<T.length){ if(is(")")) throw {msg:"Il y a une parenthèse fermante « ) » en trop."}; bad(); } return e;
}
function evalTree(n){
  if("n" in n) return n.n;
  const a=evalTree(n.a), b=evalTree(n.b), v=apply(a,n.op,b);
  if(v===null){
    if(n.op==="-") throw {msg:`Dans ce jeu, pas de nombres négatifs : ${a} − ${b} est impossible.`};
    if(n.op==="/") throw {msg: b===0 ? "On ne peut pas diviser par 0." : `La division ${a} ÷ ${b} ne tombe pas juste.`};
  }
  return v;
}
const numbers = n => "n" in n ? [n.n] : numbers(n.a).concat(numbers(n.b));
/* calcul « de gauche à droite » sans priorités, pour repérer l'erreur classique */
function leftToRight(T){ if(T.some(t=>t.k==="("||t.k===")")) return null; let v=T[0]&&T[0].k==="n"?T[0].v:null; for(let i=1;i+1<T.length;i+=2){ if(v===null||T[i+1].k!=="n") return null; v=apply(v,T[i].k,T[i+1].v); } return v; }
const pretty = s => s.replace(/\s+/g,"").replace(/[*xX·]/g,"×").replace(/[\/:]/g,"÷").replace(/[-–]/g,"−").replace(/([+−×÷])/g," $1 ");

/* --- état --- */
const KEY="staal-compte5-";
const store = { get(k){ try{ return localStorage.getItem(KEY+k); }catch(e){ return null; } }, set(k,v){ try{ localStorage.setItem(KEY+k,v); }catch(e){} } };
let R=null, lvl=0, cur=null, draft=null, sel=null;
function prog(){ try{ return JSON.parse(store.get("prog")||"{}"); }catch(e){ return {}; } }
function setProg(p){ store.set("prog", JSON.stringify(p)); }
const $ = id => R.querySelector("#"+id);

function init(root){
  R=root; lvl=+(store.get("niveau")||0); if(!(lvl>=0&&lvl<LEVELS.length)) lvl=0;
  R.innerHTML = `<div class="cpt">
    <div class="llevels" id="clevels"></div><p class="where" id="cleg">Le dernier niveau (en orange) est un <b>défi</b>.</p>
    <div class="cgrid">
      <div class="cmain">
        <h2 id="ctitre"></h2><p id="cconsigne" class="cconsigne"></p>
        <div class="cprog" id="cprog"></div>
        <div class="cboard"><div class="ccible"><span>Cible</span><b id="ccible"></b></div><div class="cplaques" id="cplaques"></div></div>
        <label class="clab" for="cin">Ton calcul, en <b>une seule ligne</b> :</label>
        <div class="cexpr"><input id="cin" class="cin" autocomplete="off" spellcheck="false" inputmode="none" aria-describedby="cres"><span class="cres" id="cres"></span></div>
        <div class="ckeys" id="ckeys"></div>
        <div class="cbtns"><button class="btn primary" id="cgo">Valider mon calcul</button><button class="btn" id="cnew">Changer de tirage</button></div>
        <div class="lmsg" id="cmsg" hidden></div>
        <details class="lhelp" id="chelp"><summary>Besoin d'aide ?</summary><p id="caide"></p><p id="cindice"></p><details class="lsolbox"><summary>Toujours bloqué ? Voir une solution possible</summary><div id="csol"></div></details></details>
      </div>
      <aside class="cside">
        <h3>Les règles</h3>
        <ul class="crules"><li>Tu peux utiliser chaque plaque <b>une seule fois</b>.</li><li>Tu n'es pas obligé d'utiliser toutes les plaques.</li><li>Opérations permises : <b>+ − × ÷</b>.</li><li>Pas de nombres négatifs, et les divisions doivent <b>tomber juste</b>.</li><li>À la fin, écris tout ton calcul <b>en une seule ligne</b>, avec des parenthèses si besoin.</li></ul>
        <h3>Brouillon</h3>
        <p class="where">Pour chercher, fais tes calculs ici étape par étape : clique sur une plaque, sur une opération, puis sur une autre plaque.</p>
        <div class="dplaques" id="dplaques"></div>
        <div class="dops" id="dops">${["+","-","*","/"].map(o=>`<button class="dop" data-o="${o}" aria-label="${SIGN[o]}">${SIGN[o]}</button>`).join("")}</div>
        <ol class="dsteps" id="dsteps"></ol>
        <div class="cbtns"><button class="btn" id="dundo">↶ Annuler l'étape</button><button class="btn" id="dreset">Effacer le brouillon</button></div>
      </aside>
    </div></div>`;
  const inp=$("cin");
  inp.addEventListener("input", live);
  inp.addEventListener("keydown", e=>{ if(e.key==="Enter"){ e.preventDefault(); valider(); } });
  $("cgo").onclick=valider;
  $("cnew").onclick=()=>{ nouveau(); };
  $("dundo").onclick=()=>{ if(draft.steps.length){ draft.steps.pop(); draft.items=draft.base.concat(draft.steps.map(s=>s.res)); sel=null; drawDraft(); } };
  $("dreset").onclick=()=>{ resetDraft(); drawDraft(); };
  R.querySelectorAll(".dop").forEach(b=>b.onclick=()=>{ if(!sel||sel.a===undefined) return; sel.op=b.dataset.o; drawDraft(); });
  load(lvl);
}
function levelsBar(){
  const p=prog();
  $("clevels").innerHTML = LEVELS.map((L,i)=>{ const n=p[i]||0, ok=n>=PAR_NIVEAU;
    return `<button class="lnum${i===lvl?" on":""}${ok?" ok":""}${L.defi?" defi":""}" data-i="${i}" aria-label="Niveau ${i+1}${L.defi?" (défi)":""}${ok?" (réussi)":""}">${i+1}</button>`; }).join("");
  R.querySelectorAll("#clevels .lnum").forEach(b=>b.onclick=()=>load(+b.dataset.i));
}
function load(i){
  lvl=i; store.set("niveau",i); levelsBar();
  const L=LEVELS[i];
  $("ctitre").textContent=`Niveau ${i+1}${L.defi?" · Défi":""} · ${L.titre.replace(/^Défi : /,"")}`;
  $("cconsigne").innerHTML=`Atteins la <b>cible</b> avec les ${L.n} plaques. ${L.aide}`;
  let saved=null; try{ saved=JSON.parse(store.get("tirage-"+i)||"null"); }catch(e){}
  if(saved && saved.pl && saved.sol) cur=saved; else nouveau(true);
  show();
}
function nouveau(silent){
  const t=LEVELS[lvl].gen();
  cur={pl:t.pl, cible:t.cible, sol:t.sol.s, steps:stepsOf(t.sol), first:firstStep(t.sol)};
  store.set("tirage-"+lvl, JSON.stringify(cur));
  if(!silent) show();
}
function progBar(enCours){
  const p=prog(), n=Math.min(p[lvl]||0, PAR_NIVEAU), t=enCours ? Math.min(n+1,PAR_NIVEAU) : Math.max(n,1);
  $("cprog").innerHTML = `Tirage ${t} sur ${PAR_NIVEAU} <span class="cdots">${Array.from({length:PAR_NIVEAU},(_,k)=>`<span class="${k<n?"on":""}"></span>`).join("")}</span>${n>=PAR_NIVEAU?" · niveau réussi, tu peux continuer à t'entraîner !":""}`;
}
function show(){
  progBar(true);
  $("ccible").textContent=cur.cible;
  $("cin").value=""; $("cres").textContent=""; msg("");
  $("caide").innerHTML=`Commence par chercher un calcul qui donne un nombre <b>proche de ${cur.cible}</b>, puis ajuste avec les autres plaques. Utilise le brouillon à droite pour essayer.`;
  $("cindice").innerHTML = cur.first ? `<b>Indice :</b> une solution commence par <b>${cur.first}</b>.` : "";
  $("csol").innerHTML=`<p><b>${cur.cible} = ${cur.sol}</b></p><p class="where">Étape par étape : ${cur.steps.join(" ; ")}. Il existe parfois d'autres solutions !</p>`;
  const h=$("chelp"); if(h) h.open=false; const sb=R.querySelector(".lsolbox"); if(sb) sb.open=false;
  keys(); resetDraft(); drawDraft(); plaques();
}
function plaques(used){
  used=used||[]; const left=used.slice();
  $("cplaques").innerHTML = cur.pl.map(v=>{ const k=left.indexOf(v); const u=k>=0; if(u) left.splice(k,1); return `<span class="cplaque${u?" used":""}">${v}</span>`; }).join("");
}
function keys(){
  const k=[...cur.pl.map(v=>({t:String(v), v:String(v), c:"knum"})), ...["+","-","*","/"].map(o=>({t:SIGN[o], v:` ${SIGN[o]} `, c:"kop"})), {t:"(",v:"(",c:"kop"}, {t:")",v:")",c:"kop"}, {t:"⌫",v:"BS",c:"kdel",l:"Effacer le dernier signe"}, {t:"Tout effacer",v:"CLR",c:"kdel"}];
  $("ckeys").innerHTML = k.map(x=>`<button class="ckey ${x.c}" data-v="${x.v}" ${x.l?`aria-label="${x.l}"`:""}>${x.t}</button>`).join("");
  R.querySelectorAll(".ckey").forEach(b=>b.onclick=()=>{ const inp=$("cin"), v=b.dataset.v;
    if(v==="CLR") inp.value=""; else if(v==="BS") inp.value=inp.value.replace(/\s+$/,"").slice(0,-1).replace(/\s+$/,"");
    else { const last=inp.value.trim().slice(-1); if(b.classList.contains("knum") && /\d/.test(last)) inp.value+=" "; inp.value+=v; }
    inp.value=inp.value.replace(/\s{2,}/g," "); live(); inp.focus({preventScroll:true}); const n=inp.value.length; inp.setSelectionRange(n,n); });
}
function analyse(str){
  const T=tokenize(str); const tree=parse(T); const nums=numbers(tree);
  const left=cur.pl.slice();
  for(const v of nums){ const k=left.indexOf(v);
    if(k<0){
      const fromDraft=draft && draft.steps.find(s=>s.res.v===v);
      if(cur.pl.includes(v)) throw {msg:`Tu as utilisé le ${v} plus de fois qu'il n'y a de plaques ${v}.`, nums};
      if(fromDraft) throw {msg:`${v} n'est pas une plaque : c'est un résultat de ton brouillon. Remplace-le par son calcul entre parenthèses : <b>(${fromDraft.txt})</b>.`, nums};
      throw {msg:`Le nombre ${v} n'est pas sur les plaques : tu ne peux utiliser que les nombres des plaques.`, nums};
    }
    left.splice(k,1);
  }
  return {T, tree, nums, v:evalTree(tree)};
}
function live(){
  const s=$("cin").value, el=$("cres"); let used=[];
  try{ if(!s.trim()){ el.textContent=""; el.className="cres"; plaques(); return; } const a=analyse(s); used=a.nums; el.textContent="= "+a.v; el.className="cres"+(a.v===cur.cible?" ok":""); }
  catch(e){ el.textContent="= …"; el.className="cres"; if(e.nums) used=e.nums; else { try{ used=numbers(parse(tokenize(s))); }catch(_){ used=(s.match(/\d+/g)||[]).map(Number); } } }
  plaques(used);
}
function valider(){
  const s=$("cin").value;
  let a; try{ a=analyse(s); }catch(e){ msg(`<b>Pas encore !</b> ${e.msg||"Ton calcul est mal écrit."}`, "ko"); return; }
  if(a.v!==cur.cible){
    const ltr=leftToRight(a.T);
    msg(`<b>Pas encore !</b> Ton calcul donne <b>${a.v}</b>, mais la cible est <b>${cur.cible}</b>.${ltr===cur.cible?` <br>Attention aux <b>priorités</b> : la multiplication et la division se font avant l'addition et la soustraction. Ajoute des parenthèses pour faire d'abord le calcul que tu veux.`:""}`, "ko"); return;
  }
  if(a.nums.length===1){ msg("<b>Pas encore !</b> Il faut faire au moins un calcul.", "ko"); return; }
  const p=prog(); p[lvl]=(p[lvl]||0)+1; setProg(p); levelsBar(); progBar(false);
  const fini=p[lvl]===PAR_NIVEAU;
  msg(`<b>Le compte est bon !</b> ${cur.cible} = ${pretty(s)}${fini?`<br><b>Bravo, tu as réussi les ${PAR_NIVEAU} tirages de ce niveau !</b>`:""}<br>
    <button class="btn primary" id="cnext">${fini && lvl<LEVELS.length-1?"Niveau suivant →":"Tirage suivant →"}</button>`, "ok");
  $("cnext").onclick=()=>{ if(fini && lvl<LEVELS.length-1) { nouveauNiveau(lvl+1); } else { nouveau(); } };
}
function nouveauNiveau(i){ try{ localStorage.removeItem(KEY+"tirage-"+i); }catch(e){} load(i); }
function msg(h,kind){ const el=$("cmsg"); el.hidden=!h; el.className="lmsg "+(kind||""); el.innerHTML=h; }

/* --- brouillon --- */
function resetDraft(){ draft={base:cur.pl.map((v,i)=>({v, id:"p"+i})), steps:[]}; draft.items=draft.base.slice(); sel=null; }
function usedIds(){ const u=new Set(); draft.steps.forEach(s=>{ u.add(s.a); u.add(s.b); }); return u; }
function drawDraft(){
  const U=usedIds();
  $("dplaques").innerHTML = draft.items.map(it=>`<button class="dplaque${U.has(it.id)?" used":""}${it.id[0]==="r"?" res":""}${sel&&sel.a===it.id?" sel":""}" data-id="${it.id}" ${U.has(it.id)?"disabled":""}>${it.v}</button>`).join("");
  R.querySelectorAll(".dop").forEach(b=>b.classList.toggle("sel", !!sel && sel.op===b.dataset.o));
  $("dsteps").innerHTML = draft.steps.map(s=>`<li>${s.txt} = <b>${s.res.v}</b>${s.res.v===cur.cible?" 🎯":""}</li>`).join("");
  R.querySelectorAll(".dplaque").forEach(b=>b.onclick=()=>{
    const id=b.dataset.id;
    if(!sel || !sel.op){ sel={a:id}; drawDraft(); return; }
    if(id===sel.a) { sel=null; drawDraft(); return; }
    const A=draft.items.find(x=>x.id===sel.a), B=draft.items.find(x=>x.id===id), v=apply(A.v, sel.op, B.v);
    if(v===null){ msg(sel.op==="-" ? `<b>Brouillon :</b> ${A.v} − ${B.v} donnerait un nombre négatif.` : `<b>Brouillon :</b> ${A.v} ÷ ${B.v} ne tombe pas juste.`, "ko"); sel=null; drawDraft(); return; }
    const txt=`${A.v} ${SIGN[sel.op]} ${B.v}`, res={v, id:"r"+draft.steps.length};
    draft.steps.push({a:A.id, b:B.id, txt, res}); draft.items.push(res); sel=null; drawDraft();
    if(v===cur.cible) msg(`<b>Tu as trouvé la cible au brouillon !</b> Il reste à écrire <b>tout ton calcul en une seule ligne</b> dans la case. Astuce : remplace chaque résultat intermédiaire par son calcul entre parenthèses.`, "");
  });
}
function destroy(){ R=null; }
return {init, destroy, LEVELS, _t:{allExpr, gen3, genN, tokenize, parse, evalTree, apply, stepsOf, firstStep}};
})();
