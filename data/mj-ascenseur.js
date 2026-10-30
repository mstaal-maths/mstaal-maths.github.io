/* L'ascenseur des relatifs (5e) : un ascenseur (ou un thermomètre) monte et descend ; l'élève prévoit où il arrive,
   puis l'animation joue le trajet pour vérifier. Additions puis soustractions de nombres relatifs. */
window.MJ_ASCENSEUR = (function(){
"use strict";
const KEY = "staal-mj-ascenseur5", M = "−", NQ = 8, NB = " ";
const reduced = () => { try{ return matchMedia("(prefers-reduced-motion: reduce)").matches; }catch(e){ return false; } };
const fmt = n => n<0 ? M+(-n) : String(n);                 /* −3 ; 0 ; 5 */
const sgn = n => n>0 ? "+"+n : n<0 ? M+(-n) : "0";          /* +5 ; −3 */
const par = n => n===0 ? "0" : "("+sgn(n)+")";             /* (+5) ; (−3) */
const ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const pl = (n, mot) => n + NB + mot + (n>1 ? "s" : "");

/* ---------- Niveaux ---------- */
const LV = [
 {t:"Monter ou descendre", d:"Un seul trajet dans un petit immeuble.", view:"imm", min:-3, max:6, kind:"story", n:[1,1], vmax:6},
 {t:"Deux trajets", d:"L'ascenseur monte, puis descend… ou l'inverse.", view:"imm", min:-5, max:8, kind:"story", n:[2,2], vmax:7},
 {t:"Les calculs", d:"Le trajet est écrit comme une addition de nombres relatifs.", view:"imm", min:-6, max:9, kind:"calc", n:[1,2], vmax:8, sub:0, cap:true},
 {t:"Retirer un trajet", d:"Retirer une descente : on monte ou on descend ?", view:"imm", min:-6, max:9, kind:"calc", n:[1,1], vmax:7, sub:1, cap:true},
 {t:"Enchaînements", d:"Additions et soustractions à la suite, sans aide.", view:"imm", min:-7, max:9, kind:"calc", n:[3,4], vmax:7, sub:.5},
 {t:"D'où part-il ?", d:"On connaît l'arrivée : retrouve l'étage de départ.", view:"imm", min:-6, max:9, kind:"inv", n:[1,2], vmax:7},
 {t:"Le thermomètre", d:"La température monte ou baisse : prévois-la.", view:"thermo", min:-15, max:15, kind:"story", n:[1,2], vmax:12},
 {t:"Thermomètre : les calculs", d:"Additions et soustractions de relatifs, en degrés.", view:"thermo", min:-20, max:20, kind:"calc", n:[2,3], vmax:12, sub:.5}
];

/* ---------- Énoncés ---------- */
/* q = {lv, view, min, max, kind, start, ops:[{s:+1|-1, v}], pos:[…], ans} ; trajet effectif d'une opération : s*v */
function positions(start, ops){ const p=[start]; ops.forEach(o=>p.push(p[p.length-1] + o.s*o.v)); return p; }
function valid(L, q){
  if(q.ops.some(o=>!o.v)) return false;
  if(q.pos.some(p=>p<L.min || p>L.max)) return false;
  if(L.kind==="calc" && q.start===0) return false;
  if(q.ops.some(o=>Math.abs(o.v)>L.vmax)) return false;
  /* on veut des relatifs : un étage (ou une température) négatif, ou un nombre négatif dans le calcul */
  if(!q.pos.some(p=>p<0) && !q.ops.some(o=>o.v<0)) return false;
  if(L.kind!=="calc" && !q.pos.some(p=>p<0)) return false;
  if(L.kind==="calc" && L.sub>0 && L.sub<1 && !q.ops.some(o=>o.s<0)) return false;
  return true;
}
function gen(lv){
  const L = LV[lv];
  for(let k=0;k<5000;k++){
    const n = ri(L.n[0], L.n[1]), start = ri(L.min, L.max), ops=[];
    for(let i=0;i<n;i++){
      let s = 1, v = ri(1, L.vmax) * (Math.random()<.5 ? -1 : 1);
      if(L.kind==="calc"){
        if(L.sub===1) { s = -1; v = ri(1, L.vmax) * (Math.random()<.6 ? -1 : 1); }
        else if(L.sub>0 && Math.random()<L.sub) s = -1;
      }
      ops.push({s, v});
    }
    /* deux trajets d'un récit : en sens contraires, c'est plus intéressant */
    if(L.kind!=="calc" && n===2 && Math.sign(ops[0].v)===Math.sign(ops[1].v) && Math.random()<.7) continue;
    const q = {lv, view:L.view, min:L.min, max:L.max, kind:L.kind, start, ops};
    q.pos = positions(start, ops);
    q.ans = L.kind==="inv" ? start : q.pos[q.pos.length-1];
    if(valid(L, q)) return q;
  }
  throw new Error("énoncé introuvable");
}
const qkey = q => q.start+":"+q.ops.map(o=>o.s+"/"+o.v).join(",");

const isT = q => q.view==="thermo";
const unit = q => isT(q) ? NB+"°C" : "";
const where = f => f===0 ? "au rez-de-chaussée (étage 0)" : "à l'étage "+fmt(f);
function moveText(q, d, i){
  const a = Math.abs(d);
  if(isT(q)) return (i===0 ? "Ensuite, la température " : "Puis elle ") + (d>0 ? "monte" : "baisse") + " de " + a + NB + "°C.";
  return (i===0 ? "Il " : "Puis il ") + (d>0 ? "monte" : "descend") + " de " + pl(a, "étage") + ".";
}
function story(q){
  const ds = q.ops.map(o=>o.s*o.v), fin = q.pos[q.pos.length-1];
  if(q.kind==="story" && isT(q)) return [`À ${pick(["6","7","8"])}${NB}h, il fait ${fmt(q.start)}${NB}°C.`, ...ds.map((d,i)=>moveText(q,d,i)), "Quelle température fait-il à la fin ?"];
  if(q.kind==="story") return [`L'ascenseur est ${where(q.start)}.`, ...ds.map((d,i)=>moveText(q,d,i)), "À quel étage arrive-t-il ?"];
  if(q.kind==="inv") return ["L'ascenseur part d'un étage mystère.", ...ds.map((d,i)=>moveText(q,d,i)), `Il arrive ${where(fin)}.`, "De quel étage est-il parti ?"];
  return isT(q) ? ["Le premier nombre est la température de départ. Suis le calcul sur le thermomètre.", "Quel est le résultat ?"]
                : ["Le premier nombre est l'étage de départ. Suis le calcul avec l'ascenseur.", "À quel étage arrive-t-il ?"];
}
/* écriture du calcul (le premier nombre est le départ) */
const expr = q => par(q.start) + q.ops.map(o=>" "+(o.s>0?"+":M)+" "+par(o.v)).join("");
function caption(q, o){
  const a = Math.abs(o.v), T = isT(q);
  if(o.s>0) return T ? (o.v>0 ? "monter de "+a+NB+"°C" : "baisser de "+a+NB+"°C") : (o.v>0 ? "monter de "+a : "descendre de "+a);
  return T ? (o.v>0 ? "retirer une hausse de "+a+NB+"°C" : "retirer une baisse de "+a+NB+"°C") : (o.v>0 ? "retirer une montée de "+a : "retirer une descente de "+a);
}
function effText(q, d){ const a=Math.abs(d); return isT(q) ? (d>0 ? "donc monter de "+a+NB+"°C" : "donc baisser de "+a+NB+"°C") : (d>0 ? "donc monter de "+a : "donc descendre de "+a); }
/* une ligne de calcul par trajet */
function calcLines(q){
  return q.ops.map((o,i)=>{ const p=q.pos[i], r=q.pos[i+1];
    return o.s>0 ? `${par(p)} + ${par(o.v)} = ${fmt(r)}` : `${par(p)} ${M} ${par(o.v)} = ${par(p)} + ${par(-o.v)} = ${fmt(r)}`; });
}
/* calcul « à l'envers » pour retrouver le départ */
function invLines(q){
  const L=[]; for(let i=q.ops.length-1;i>=0;i--){ const d=q.ops[i].s*q.ops[i].v, r=q.pos[i+1];
    L.push(`${par(r)} ${M} ${par(d)} = ${par(r)} + ${par(-d)} = ${fmt(q.pos[i])}`); }
  return L;
}
/* erreurs fréquentes : explication ciblée */
function diagnose(q, g){
  const ans=q.ans, msgs=[], T=isT(q);
  if(q.kind==="inv"){
    const fwd = q.pos[q.pos.length-1] + q.ops.reduce((s,o)=>s+o.s*o.v,0);
    if(g===fwd) msgs.push("Tu as refait le trajet vers l'avant. Pour retrouver le départ, il faut le <b>défaire</b>&nbsp;: on part de l'arrivée et on fait l'inverse de chaque trajet, en commençant par le dernier.");
  }
  if(q.ops.some(o=>o.s<0)){
    const wrong = positions(q.start, q.ops.map(o=>({s:1, v:o.v}))).pop();
    if(g===wrong) msgs.push(T ? "Retirer une baisse de température, c'est la faire <b>monter</b>. Soustraire un nombre, c'est ajouter son opposé."
                              : "Retirer une descente, c'est <b>monter</b> (et retirer une montée, c'est descendre). Soustraire un nombre, c'est ajouter son opposé.");
  }
  if(ans!==0 && g===-ans) msgs.push(`Attention au signe&nbsp;: ${T ? "la température finale est "+(ans>0?"au-dessus":"au-dessous")+" de 0" : (q.kind==="inv" ? "l'étage de départ est " : "l'ascenseur arrive ")+(ans>0?"au-dessus":"au-dessous")+" du rez-de-chaussée"}, donc le résultat est ${ans>0?"positif":"négatif"}.`);
  if(Math.abs(g-ans)===1 && q.kind!=="inv"){
    /* premier trajet qui passe par 0 : on compte les étages un par un */
    for(let i=0;i<q.ops.length;i++){ const a=q.pos[i], b=q.pos[i+1];
      if(Math.min(a,b)<0 && Math.max(a,b)>0 && Math.abs(b-a)<=9){
        const st=[]; for(let x=a; x!==b; x+= b>a?1:-1) st.push(fmt(x)); st.push(fmt(b));
        msgs.push(`Tu y étais presque&nbsp;! N'oublie pas ${T?"0"+NB+"°C":"le rez-de-chaussée (étage 0)"} quand tu comptes&nbsp;: ${st.join(" → ")}.`); break; } }
  }
  return msgs;
}
function parse(s){
  s = String(s||"").trim().toLowerCase().replace(/[−–—]/g,"-").replace(/\s+/g,"").replace(/°c?$/,"");
  if(s==="rdc") return 0;
  return /^[+-]?\d{1,3}$/.test(s) ? parseInt(s,10) : null;
}

/* ---------- Mémoire (record) ---------- */
function load(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
function save(d){ try{ localStorage.setItem(KEY, JSON.stringify(d)); }catch(e){} }
const starsFor = ok => ok>=8 ? 3 : ok>=6 ? 2 : ok>=4 ? 1 : 0;
const STAR = on => `<svg class="mj-asc-star${on?" on":""}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.2l-5.8 3.2 1.2-6.5L2.6 9.4l6.5-.8z"/></svg>`;
const STARS = n => `<span class="mj-asc-stars" aria-label="${n} étoile${n>1?"s":""} sur 3">${STAR(n>=1)}${STAR(n>=2)}${STAR(n>=3)}</span>`;

/* ---------- Style ---------- */
const CSS = `
.mj-asc{line-height:1.5;--ok2:#1f9d55;--ko2:#d64545;position:relative;font-family:var(--f-body);color:var(--ink);max-width:1180px;margin:0 auto}
.mj-asc *{box-sizing:border-box}
.mj-asc .btn{font-size:1rem}
.mj-asc-help{background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:4px 16px;margin:0 0 14px}
.mj-asc-help summary{cursor:pointer;font-weight:700;padding:8px 0}
.mj-asc-help ul{margin:2px 0 10px;padding-left:1.2em;line-height:1.55}
.mj-asc-help li{margin:3px 0}
.mj-asc-levels{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.mj-asc-lv{font:inherit;text-align:left;color:var(--ink);background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:12px 14px;cursor:pointer;display:flex;flex-direction:column;gap:4px;min-height:132px;transition:border-color .15s,transform .15s}
.mj-asc-lv:hover,.mj-asc-lv:focus-visible{border-color:var(--c);transform:translateY(-2px)}
.mj-asc-lv .mj-asc-n{display:flex;align-items:center;justify-content:space-between;gap:6px}
.mj-asc-lv .mj-asc-n b{width:32px;height:32px;border-radius:10px;background:var(--c);color:var(--paper);display:grid;place-items:center;font-size:1rem}
.mj-asc-lv .mj-asc-tt{font-weight:700;font-size:1.02rem;line-height:1.3}
.mj-asc-lv .mj-asc-dd{font-size:.9rem;color:var(--muted);line-height:1.35}
.mj-asc-lv .mj-asc-rec{font-size:.85rem;color:var(--muted);margin-top:auto}
.mj-asc-stars{display:inline-flex;gap:2px}
.mj-asc-star{width:18px;height:18px;fill:none;stroke:var(--muted);stroke-width:1.6;opacity:.6}
.mj-asc-star.on{fill:#f5b301;stroke:#b07d00;opacity:1}
.mj-asc-menuhead{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;flex-wrap:wrap}
.mj-asc-menuhead h2{font-family:var(--f-display);font-size:1.35rem;margin:0}
.mj-asc-tot{font-weight:600;color:var(--muted)}
.mj-asc-top{display:flex;align-items:center;gap:10px 16px;flex-wrap:wrap;margin:0 0 10px;min-height:48px}
.mj-asc-top .mj-asc-lvname{font-weight:700;font-size:1.05rem;margin-right:auto}
.mj-asc-top .mj-asc-lvname span{color:var(--c)}
.mj-asc-dots{display:flex;gap:5px}
.mj-asc-dots i{width:14px;height:14px;border-radius:50%;border:2px solid var(--line);background:var(--surface)}
.mj-asc-dots i.cur{border-color:var(--ink)}
.mj-asc-dots i.ok{background:var(--ok2);border-color:var(--ok2)}
.mj-asc-dots i.ko{background:var(--ko2);border-color:var(--ko2)}
.mj-asc-score{font-weight:700;font-variant-numeric:tabular-nums;background:var(--surface);border:2px solid var(--line);border-radius:999px;padding:4px 14px}
.mj-asc-streak{font-weight:700;color:#b45309;background:#fff1d6;border-radius:999px;padding:4px 12px}
.mj-asc-streak[hidden]{display:none}
.mj-asc-top details{position:relative;margin:0;border:0;padding:0}
.mj-asc-top details summary{list-style:none;cursor:pointer;font-weight:600;border:2px solid var(--line);border-radius:999px;padding:5px 14px;background:var(--surface)}
.mj-asc-top details summary::-webkit-details-marker{display:none}
.mj-asc-top details .mj-asc-pop{position:absolute;right:0;top:calc(100% + 8px);z-index:20;width:min(460px,90vw);background:var(--surface);border:2px solid var(--line);border-radius:14px;padding:6px 18px;box-shadow:0 12px 30px rgba(0,0,0,.18)}
.mj-asc-main{display:grid;grid-template-columns:400px minmax(0,1fr);gap:18px;align-items:stretch}
.mj-asc-scene{background:#dff0ff;border:2px solid var(--line);border-radius:16px;overflow:hidden;height:min(600px,calc(100vh - 92px));min-height:430px}
.mj-asc-scene svg{display:block;width:100%;height:100%;touch-action:manipulation}
.mj-asc-scene .hit{fill:transparent;cursor:pointer}
.mj-asc-scene .hit:hover{fill:rgba(37,99,235,.13)}
.mj-asc-scene.lock .hit{cursor:default;pointer-events:none}
.mj-asc-panel{background:var(--surface);border:2px solid var(--line);border-radius:16px;padding:18px 22px;display:flex;flex-direction:column;gap:14px;min-width:0}
.mj-asc-qnum{font-size:.9rem;font-weight:700;color:var(--c);text-transform:uppercase;letter-spacing:.04em}
.mj-asc-story{font-size:1.15rem;line-height:1.5}
.mj-asc-story p{margin:0 0 4px}
.mj-asc-story p.mj-asc-ask{font-weight:700;margin-top:6px}
.mj-asc-chips{display:flex;flex-wrap:wrap;align-items:flex-start;gap:8px 6px}
.mj-asc-chip{display:flex;flex-direction:column;align-items:center;gap:3px}
.mj-asc-chip .v{font-size:1.5rem;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap;padding:6px 12px;border-radius:12px;border:2px solid var(--line);background:var(--paper);transition:background .3s,border-color .3s,transform .3s}
.mj-asc-chip .c{font-size:.82rem;color:var(--muted);text-align:center;max-width:12em;line-height:1.25;min-height:1.1em}
.mj-asc-chip.up .v{border-color:#2f9e5b}
.mj-asc-chip.dn .v{border-color:#d0573f}
.mj-asc-chip.cur .v{background:#fff3c4;color:#15213b;border-color:#e0a800;transform:translateY(-3px)}
.mj-asc-chip.flip .c{color:var(--ink);font-weight:700}
.mj-asc-chip.done .v{opacity:.65}
.mj-asc-chiplab{font-size:.85rem;color:var(--muted);font-weight:600;width:100%}
.mj-asc-ans{display:flex;align-items:center;flex-wrap:wrap;gap:10px 12px;margin-top:2px}
.mj-asc-ans label{font-weight:700;font-size:1.05rem}
.mj-asc-ans input{font:inherit;font-size:1.4rem;font-weight:700;width:5.2em;text-align:center;padding:8px 10px;border-radius:12px;border:2px solid var(--line);background:var(--paper);color:var(--ink);font-variant-numeric:tabular-nums}
.mj-asc-ans input:focus{outline:3px solid color-mix(in srgb,var(--c) 45%,transparent);border-color:var(--c)}
.mj-asc-tip{font-size:.92rem;color:var(--muted);margin:-6px 0 0}
.mj-asc-warn{color:var(--ko);font-weight:600;font-size:.95rem;min-height:1.2em;margin:-6px 0 0}
.mj-asc-live{font-size:1.6rem;font-weight:800;font-variant-numeric:tabular-nums;color:var(--ink)}
.mj-asc-live small{font-size:1rem;font-weight:600;color:var(--muted)}
.mj-asc-fb{border-radius:14px;padding:12px 16px;border:2px solid var(--line)}
.mj-asc-fb.ok{background:var(--okbg);border-color:var(--ok)}
.mj-asc-fb.ko{background:var(--kobg);border-color:var(--ko)}
.mj-asc-fb .mj-asc-verdict{font-weight:800;font-size:1.15rem;margin:0 0 4px}
.mj-asc-fb.ok .mj-asc-verdict{color:var(--ok)} .mj-asc-fb.ko .mj-asc-verdict{color:var(--ko)}
.mj-asc-fb p{margin:4px 0;line-height:1.45}
.mj-asc-fb .mj-asc-calc{font-variant-numeric:tabular-nums;font-weight:600;font-size:1.05rem;margin:2px 0}
.mj-asc-fb .mj-asc-calc b{font-weight:800}
.mj-asc-fb .mj-asc-pts{font-weight:700}
.mj-asc-next{align-self:flex-start;margin-top:12px}
.mj-asc-end{position:absolute;inset:0;z-index:30;display:grid;place-items:center;background:color-mix(in srgb,var(--paper) 72%,transparent);backdrop-filter:blur(2px);border-radius:16px}
.mj-asc-endbox{background:var(--surface);border:2px solid var(--line);border-radius:18px;padding:24px 30px;text-align:center;max-width:520px;box-shadow:0 16px 40px rgba(0,0,0,.2)}
.mj-asc-endbox h3{font-family:var(--f-display);font-size:1.6rem;margin:0 0 6px}
.mj-asc-endbox .mj-asc-big .mj-asc-star{width:46px;height:46px}
.mj-asc-endbox p{margin:8px 0}
.mj-asc-endbox .mj-asc-rec{color:var(--ok);font-weight:800}
.mj-asc-endbox .mj-asc-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:14px}
@keyframes mj-asc-pop{0%{transform:scale(.6);opacity:0}70%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
.mj-asc-endbox .mj-asc-big .mj-asc-star.on{animation:mj-asc-pop .5s both}
.mj-asc-endbox .mj-asc-big .mj-asc-star.on:nth-child(2){animation-delay:.2s}
.mj-asc-endbox .mj-asc-big .mj-asc-star.on:nth-child(3){animation-delay:.4s}
@media (prefers-reduced-motion: reduce){ .mj-asc *{transition:none!important;animation:none!important} }
@media (max-width:900px){ .mj-asc-main{grid-template-columns:1fr} .mj-asc-levels{grid-template-columns:repeat(2,minmax(0,1fr))} .mj-asc-scene{height:520px} }
html.fs-1 .mj-asc-qnum, html.fs-2 .mj-asc-qnum{display:none}
html.fs-1 .mj-asc-panel, html.fs-2 .mj-asc-panel{gap:10px;padding-top:14px}
html.fs-1 .mj-asc-scene, html.fs-2 .mj-asc-scene{height:min(560px,calc(100vh/1.12 - 96px))}
`;

/* ---------- Dessins ---------- */
const SW = 400, SH = 600;
function sceneGeom(q){
  const n = q.max - q.min + 1, top = isT(q) ? 58 : 34, bot = isT(q) ? 70 : 12;
  const fh = (SH - top - bot) / n;
  return {n, top, fh, yc: v => top + (q.max - v)*fh + fh/2};
}
function person(h){
  const s = h/34;
  return `<g transform="scale(${s.toFixed(3)})"><circle cx="0" cy="-22" r="6" fill="#f2c39b" stroke="#7a4a2a" stroke-width="1.2"/>
    <path d="M-6 -25c2-6 10-6 12 0" fill="#5a3b1c"/><circle cx="-2" cy="-22" r=".9" fill="#1b2a44"/><circle cx="2.2" cy="-22" r=".9" fill="#1b2a44"/>
    <path d="M-7 2v-10a7 7 0 0 1 14 0v10z" fill="#e8413c" stroke="#9b2420" stroke-width="1.2"/></g>`;
}
function drawBuilding(q){
  const G = sceneGeom(q), {fh, yc} = G, x0=86, x1=318, shL=176, shR=232, fs=Math.min(19, fh*.62);
  const yTop = v => yc(v) - fh/2, ground = yTop(0) + fh;
  let s = `<rect width="${SW}" height="${ground}" fill="#cfe8ff"/><rect y="${ground}" width="${SW}" height="${SH-ground}" fill="#8a6a4a"/>`;
  s += `<circle cx="352" cy="44" r="18" fill="#ffd34d" opacity=".9"/>`;
  s += `<path d="M24 ${ground}q8-26 16 0zM340 ${ground}q10-34 20 0z" fill="#58a55c"/>`;
  /* toit */
  s += `<rect x="${x0-8}" y="${yTop(q.max)-12}" width="${x1-x0+16}" height="12" rx="3" fill="#7b5b48"/><path d="M${x1-30} ${yTop(q.max)-12}v-14" stroke="#555" stroke-width="2"/><circle cx="${x1-30}" cy="${yTop(q.max)-28}" r="3" fill="#e8413c"/>`;
  for(let v=q.min; v<=q.max; v++){
    const y = yTop(v), up = v>=0;
    s += `<rect x="${x0}" y="${y}" width="${x1-x0}" height="${fh}" fill="${up ? (v%2 ? "#f6dfba" : "#f1d5a9") : (v%2 ? "#6b7385" : "#646c7e")}"/>`;
    s += `<path d="M${x0} ${y+fh}H${x1}" stroke="${up?"#c9a46f":"#4b5263"}" stroke-width="1.5"/>`;
    if(up && v>0){ const wh=Math.max(4,fh*.48), wy=y+(fh-wh)/2;
      [x0+14, x0+50, shR+16, shR+52].forEach(wx=>{ s += `<rect x="${wx}" y="${wy}" width="24" height="${wh}" rx="2" fill="#a8d4f5" stroke="#7a5b3a" stroke-width="1.2"/>`; }); }
    if(v===0){ const dh=fh*.78; s += `<rect x="${x0+20}" y="${y+fh-dh}" width="${Math.min(30,dh*.8)}" height="${dh}" rx="2" fill="#8b5a2b" stroke="#5a3b1c"/>`;
      s += `<text x="${shR+44}" y="${y+fh/2}" dy=".35em" text-anchor="middle" style="font:700 ${Math.min(13,fh*.5)}px Arial,sans-serif" fill="#7a4a1a">RDC</text>`; }
    if(v<0) s += `<text x="${shR+44}" y="${y+fh/2}" dy=".35em" text-anchor="middle" style="font:700 ${Math.min(12,fh*.45)}px Arial,sans-serif" fill="#cfd5e3">${v===-1?"Parking":"Sous-sol"}</text>`;
    s += `<text x="${x0-12}" y="${yc(v)}" dy=".35em" text-anchor="end" style="font:${v===0?800:700} ${fs}px Arial,sans-serif" fill="${up?"#15213b":"#f4efe6"}">${fmt(v)}</text>`;
  }
  s += `<path d="M0 ${ground}H${SW}" stroke="#3f7d3a" stroke-width="4"/>`;
  s += `<rect x="${shL}" y="${yTop(q.max)}" width="${shR-shL}" height="${(q.max-q.min+1)*fh}" fill="#3a4152" opacity=".85"/>`;
  s += `<path d="M${(shL+shR)/2} ${yTop(q.max)}V${yTop(q.min)+fh*(q.max-q.min+1)}" stroke="#9aa3b5" stroke-width="1" stroke-dasharray="3 4"/>`;
  /* zones cliquables, marqueurs */
  s += `<g class="marks"></g>`;
  const ch = fh-4;
  s += `<g class="cab" style="display:none"><rect x="${shL+3}" y="${-ch/2}" width="${shR-shL-6}" height="${ch}" rx="4" fill="#ffd166" stroke="#a87a00" stroke-width="2"/>
        <g transform="translate(${(shL+shR)/2} ${ch/2-1})">${person(Math.max(10, ch-4))}</g></g>`;
  for(let v=q.min; v<=q.max; v++) s += `<rect class="hit" data-v="${v}" x="0" y="${yTop(v)}" width="${SW}" height="${fh}"><title>Étage ${fmt(v)}</title></rect>`;
  return s;
}
function drawThermo(q){
  const G = sceneGeom(q), {fh, yc} = G, cx = 170, tw = 22, step = (q.max-q.min)>30 ? 5 : 5;
  const yT = yc(q.max) - fh/2 - 10, yB = yc(q.min) + fh/2 + 10;
  let s = `<rect width="${SW}" height="${SH}" fill="#eef6ff"/>`;
  s += `<rect width="${SW}" height="${yc(0)}" fill="#fff4e0" opacity=".9"/><rect y="${yc(0)}" width="${SW}" height="${SH-yc(0)}" fill="#e3f0ff"/>`;
  /* soleil et flocon */
  s += `<g transform="translate(62 70)"><circle r="16" fill="#ffc94d"/>${[...Array(8)].map((_,i)=>{ const a=i*Math.PI/4; return `<path d="M${(22*Math.cos(a)).toFixed(1)} ${(22*Math.sin(a)).toFixed(1)}L${(30*Math.cos(a)).toFixed(1)} ${(30*Math.sin(a)).toFixed(1)}" stroke="#f0a400" stroke-width="3" stroke-linecap="round"/>`; }).join("")}</g>`;
  s += `<g transform="translate(62 ${SH-110})" stroke="#5aa0e6" stroke-width="3" stroke-linecap="round">${[0,60,120].map(a=>`<path d="M0 -20V20" transform="rotate(${a})"/><path d="M-6 -14L0 -20L6 -14M-6 14L0 20L6 14" fill="none" transform="rotate(${a})"/>`).join("")}</g>`;
  s += `<rect x="${cx-tw/2-6}" y="${yT-6}" width="${tw+12}" height="${yB-yT+12}" rx="${(tw+12)/2}" fill="#fff" stroke="#9aa6bd" stroke-width="2"/>`;
  s += `<circle cx="${cx}" cy="${yB+30}" r="26" fill="#fff" stroke="#9aa6bd" stroke-width="2"/><circle cx="${cx}" cy="${yB+30}" r="19" fill="#e23b3b"/>`;
  s += `<rect class="liq" x="${cx-tw/2+3}" width="${tw-6}" fill="#e23b3b" y="${yB}" height="40"/>`;
  s += `<g class="marks"></g>`;
  for(let v=q.min; v<=q.max; v++){
    const y = yc(v), big = v%step===0;
    s += `<path d="M${cx+tw/2+8} ${y}h${big?20:10}" stroke="#2f3a52" stroke-width="${v===0?3:big?2:1.2}"/>`;
    if(big) s += `<text x="${cx+tw/2+34}" y="${y}" dy=".35em" style="font:${v===0?800:700} ${v===0?18:16}px Arial,sans-serif" fill="#15213b">${fmt(v)}</text>`;
  }
  s += `<path d="M${cx-tw/2-30} ${yc(0)}H${cx-tw/2-8}" stroke="#2f3a52" stroke-width="2" stroke-dasharray="3 3"/>`;
  s += `<text x="${cx}" y="${yT-16}" text-anchor="middle" style="font:700 15px Arial,sans-serif" fill="#56627d">°C</text>`;
  s += `<g class="tval" style="display:none"><rect x="14" y="${SH/2-26}" width="104" height="52" rx="12" fill="#fff" stroke="#e23b3b" stroke-width="2.5"/><text class="tv" x="66" y="${SH/2}" dy=".36em" text-anchor="middle" style="font:800 24px Arial,sans-serif" fill="#15213b"></text></g>`;
  for(let v=q.min; v<=q.max; v++) s += `<rect class="hit" data-v="${v}" x="0" y="${yc(v)-fh/2}" width="${SW}" height="${fh}"><title>${fmt(v)} °C</title></rect>`;
  return s;
}

/* ---------- Le jeu ---------- */
function init(root){
  if(!document.getElementById("mj-asc-css")){ const st=document.createElement("style"); st.id="mj-asc-css"; st.textContent=CSS; document.head.appendChild(st); }
  const data = load(); data.best = data.best || {}; data.stars = data.stars || {};
  root.innerHTML = `<div class="mj-asc"><div class="mj-asc-menu"></div><div class="mj-asc-game" hidden></div></div>`;
  const W = root.querySelector(".mj-asc"), MENU = W.querySelector(".mj-asc-menu"), GAME = W.querySelector(".mj-asc-game");
  let S = null, anim = null;
  const alive = () => root.isConnected && W.isConnected;
  const HELP = `<ul>
      <li>Lis le trajet de l'ascenseur (ou du thermomètre).</li>
      <li><b>Prévois</b> où il arrive&nbsp;: clique sur l'étage (ou la graduation), ou écris le nombre puis appuie sur <b>Entrée</b>.</li>
      <li>L'ascenseur fait alors le trajet sous tes yeux&nbsp;: tu vois si tu avais raison, avec le calcul.</li>
      <li>8 questions par niveau. Réponse juste&nbsp;: 100 points, plus un bonus si tu enchaînes les bonnes réponses.</li></ul>`;

  function menu(){
    stopAnim(); S = null; GAME.hidden = true; MENU.hidden = false;
    const tot = LV.reduce((s,_,i)=>s+(data.stars[i]||0),0), first = !Object.keys(data.best).length;
    MENU.innerHTML = `<details class="mj-asc-help"${first?" open":""}><summary>Comment jouer&nbsp;?</summary>${HELP}</details>
      <div class="mj-asc-menuhead"><h2>Choisis un niveau</h2><span class="mj-asc-tot">${tot} étoile${tot>1?"s":""} sur ${LV.length*3}</span></div>
      <div class="mj-asc-levels">${LV.map((L,i)=>`<button class="mj-asc-lv" data-l="${i}">
        <span class="mj-asc-n"><b>${i+1}</b>${STARS(data.stars[i]||0)}</span><span class="mj-asc-tt">${L.t}</span><span class="mj-asc-dd">${L.d}</span>
        <span class="mj-asc-rec">${data.best[i] ? "Record : "+data.best[i]+" points" : "Pas encore joué"}</span></button>`).join("")}</div>`;
    MENU.querySelectorAll(".mj-asc-lv").forEach(b=>b.onclick=()=>start(+b.dataset.l));
  }
  function start(lv){
    stopAnim();
    const seen = new Set(), qs = [];
    while(qs.length<NQ){ const q=gen(lv), k=qkey(q); if(seen.has(k)) continue; seen.add(k); qs.push(q); }
    S = {lv, qs, i:0, score:0, streak:0, ok:0, res:[]};
    MENU.hidden = true; GAME.hidden = false;
    GAME.innerHTML = `<div class="mj-asc-top">
        <button class="btn mj-asc-back">← Niveaux</button>
        <span class="mj-asc-lvname"><span>Niveau ${lv+1}</span> · ${LV[lv].t}</span>
        <span class="mj-asc-dots" aria-hidden="true">${qs.map(()=>"<i></i>").join("")}</span>
        <span class="mj-asc-streak" hidden></span>
        <span class="mj-asc-score" aria-live="polite">0 point</span>
        <details><summary>Aide</summary><div class="mj-asc-pop">${HELP}</div></details></div>
      <div class="mj-asc-main"><div class="mj-asc-scene"></div><div class="mj-asc-panel"></div></div>`;
    GAME.querySelector(".mj-asc-back").onclick = menu;
    requestAnimationFrame(()=>{ const t=GAME.querySelector(".mj-asc-top"); if(t && Math.abs(t.getBoundingClientRect().top-8)>20){ t.scrollIntoView({block:"start"}); window.scrollBy(0,-8); } });
    question();
  }
  const $ = s => GAME.querySelector(s);
  function topbar(){
    $(".mj-asc-score").textContent = S.score + (S.score>1 ? " points" : " point");
    const st = $(".mj-asc-streak"); st.hidden = S.streak<2; st.textContent = "Série ×"+S.streak;
    GAME.querySelectorAll(".mj-asc-dots i").forEach((d,i)=>{ d.className = S.res[i]===true ? "ok" : S.res[i]===false ? "ko" : i===S.i ? "cur" : ""; });
  }
  /* ----- scène ----- */
  let svg=null, geo=null, cabPos=0;
  function scene(q){
    const box = $(".mj-asc-scene"); box.classList.remove("lock");
    box.innerHTML = `<svg viewBox="0 0 ${SW} ${SH}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${isT(q)?"Thermomètre gradué de "+fmt(q.min)+" à "+fmt(q.max)+" degrés":"Immeuble de l'étage "+fmt(q.min)+" à l'étage "+fmt(q.max)}">${isT(q)?drawThermo(q):drawBuilding(q)}</svg>`;
    svg = box.querySelector("svg"); geo = sceneGeom(q);
    svg.querySelectorAll(".hit").forEach(h=>h.addEventListener("click",()=>{ if(S && S.phase==="ask"){ setGuess(+h.dataset.v); const inp=$(".mj-asc-ans input"); if(inp){ inp.value=fmt(+h.dataset.v); inp.focus(); } } }));
  }
  function setPos(v){
    cabPos = v; if(!svg) return;
    const q = S.qs[S.i];
    if(isT(q)){ const liq=svg.querySelector(".liq"), yB = geo.yc(q.min)+geo.fh/2+10, y = geo.yc(v);
      liq.setAttribute("y", y); liq.setAttribute("height", Math.max(0, yB - y + 30));
      const tv=svg.querySelector(".tval"); tv.style.display=""; tv.querySelector(".tv").textContent = fmt(Math.round(v))+" °C";
      tv.querySelector("rect").setAttribute("y", y-26); tv.querySelector(".tv").setAttribute("y", y); }
    else { const c=svg.querySelector(".cab"); c.style.display=""; c.setAttribute("transform", `translate(0 ${geo.yc(v)})`); }
  }
  function hidePos(){ if(!svg) return; const c=svg.querySelector(".cab"); if(c) c.style.display="none"; const t=svg.querySelector(".tval"); if(t) t.style.display="none";
    const l=svg.querySelector(".liq"); if(l) l.setAttribute("height",0); }
  /* repères : pari de l'élève, arrivée connue, bonne réponse */
  let marks = {};
  function drawMarks(){
    if(!svg) return; const q=S.qs[S.i], g=svg.querySelector(".marks"), T=isT(q); let s="";
    const band = (v,col,fill) => T ? `<rect x="196" y="${geo.yc(v)-Math.max(9,geo.fh/2)}" width="120" height="${Math.max(18,geo.fh)}" rx="7" fill="${fill}" stroke="${col}" stroke-width="2.5"/>`
                                   : `<rect x="84" y="${geo.yc(v)-geo.fh/2+1}" width="236" height="${geo.fh-2}" fill="${fill}" stroke="${col}" stroke-width="3"/>`;
    const tag = (v,col,txt,dx=0) => { const x = T ? 322 : 326, y = geo.yc(v); const w = 64;
      return `<g transform="translate(${x+dx} ${y})"><path d="M-6 0l10 -11h${w}a4 4 0 0 1 4 4v14a4 4 0 0 1 -4 4h-${w}z" fill="${col}"/><text x="${4+w/2+2}" y="0" dy=".35em" text-anchor="middle" style="font:700 12px Arial,sans-serif" fill="#fff">${txt}</text></g>`; };
    if(marks.arr!=null) s += band(marks.arr,"#1b2a44","rgba(27,42,68,.10)") + tag(marks.arr,"#1b2a44","Arrivée");
    if(marks.good!=null) s += band(marks.good,"#1f9d55","rgba(31,157,85,.22)");
    if(marks.guess!=null) s += band(marks.guess, marks.res===false ? "#d64545" : marks.res===true ? "#1f9d55" : "#2563eb", marks.res===false ? "rgba(214,69,69,.16)" : "rgba(37,99,235,.14)")
                              + tag(marks.guess, marks.res===false ? "#d64545" : marks.res===true ? "#1f9d55" : "#2563eb", "Ton pari", marks.arr===marks.guess ? 0 : 0);
    if(marks.good!=null && marks.good!==marks.guess) s += tag(marks.good,"#1f9d55", q.kind==="inv" ? "Départ" : "Arrivée");
    g.innerHTML = s;
  }
  function setGuess(v){ const q=S.qs[S.i]; marks.guess = (v!=null && v>=q.min && v<=q.max) ? v : null; drawMarks(); }

  /* ----- une question ----- */
  function question(){
    const q = S.qs[S.i], L = LV[S.lv]; S.phase = "ask"; marks = {};
    topbar(); scene(q);
    if(q.kind==="inv"){ hidePos(); marks.arr = q.pos[q.pos.length-1]; } else setPos(q.start);
    drawMarks();
    const lines = story(q);
    const chips = `<div class="mj-asc-chips">${q.kind==="calc" ? "" : `<span class="mj-asc-chiplab">En calcul${q.kind==="inv"?" (le départ est inconnu)":""}&nbsp;:</span>`}
       <div class="mj-asc-chip mj-asc-st"><span class="v">${q.kind==="inv" ? "?" : par(q.start)}</span><span class="c">départ</span></div>
       ${q.ops.map((o,i)=>`<div class="mj-asc-chip ${o.v>0?"up":"dn"}" data-i="${i}"><span class="v">${o.s>0?"+":M} ${par(o.v)}</span><span class="c">${L.cap ? caption(q,o) : ""}</span></div>`).join("")}</div>`;
    const lab = q.kind==="inv" ? "Étage de départ" : isT(q) ? "Température finale" : "Étage d'arrivée";
    $(".mj-asc-panel").innerHTML = `<div class="mj-asc-qnum">Question ${S.i+1} sur ${NQ}</div>
      <div class="mj-asc-story">${lines.map((l,i)=>`<p${i===lines.length-1?' class="mj-asc-ask"':""}>${l}</p>`).join("")}</div>
      ${chips}
      <div class="mj-asc-zone">
        <div class="mj-asc-ans"><label for="mj-asc-in">${lab}&nbsp;:</label><input id="mj-asc-in" type="text" inputmode="text" autocomplete="off" spellcheck="false" placeholder="?" aria-describedby="mj-asc-tip">${isT(q)?"<span>°C</span>":""}
          <button class="btn primary mj-asc-go">${isT(q) ? "Vérifier sur le thermomètre" : q.kind==="inv" ? "Vérifier le trajet" : "Lancer l'ascenseur"}</button></div>
        <p class="mj-asc-tip" id="mj-asc-tip">${isT(q) ? "Clique sur une graduation" : "Clique sur un étage"} ou écris le nombre (avec ${M} s'il est négatif), puis Entrée.</p>
        <p class="mj-asc-warn" role="alert"></p>
      </div>`;
    const inp = $(".mj-asc-ans input");
    inp.addEventListener("input", ()=>{ const v=parse(inp.value); setGuess(v); $(".mj-asc-warn").textContent=""; });
    inp.addEventListener("keydown", e=>{
      if(e.key==="Enter"){ e.preventDefault(); validate(); }
      else if(e.key==="ArrowUp" || e.key==="ArrowDown"){ e.preventDefault(); let v=parse(inp.value); if(v==null) v = q.kind==="inv" ? marks.arr : q.start;
        else v += e.key==="ArrowUp" ? 1 : -1; v=Math.max(q.min, Math.min(q.max, v)); inp.value=fmt(v); setGuess(v); } });
    $(".mj-asc-go").onclick = validate;
    inp.focus({preventScroll:true});
  }
  function validate(){
    if(!S || S.phase!=="ask") return;
    const q=S.qs[S.i], inp=$(".mj-asc-ans input"), g=parse(inp.value), w=$(".mj-asc-warn");
    if(g==null){ w.textContent = `Écris un nombre entier, par exemple ${M}3 ou 5${isT(q)?"":" (ou clique sur un étage)"}.`; inp.focus(); return; }
    if(g<q.min || g>q.max){ w.textContent = isT(q) ? `Ce thermomètre va de ${fmt(q.min)} °C à ${fmt(q.max)} °C.` : `Cet immeuble va de l'étage ${fmt(q.min)} à l'étage ${fmt(q.max)}.`; inp.focus(); return; }
    S.phase = "anim"; S.guess = g; setGuess(g);
    $(".mj-asc-scene").classList.add("lock");
    $(".mj-asc-zone").innerHTML = `<div class="mj-asc-live" aria-live="off"></div>`;
    play(q, ()=>result(q, g));
  }
  function stopAnim(){ if(anim){ anim.stop=true; anim=null; } }
  const wait = ms => new Promise(r=>setTimeout(r, ms));
  function tween(from, to, ms){
    return new Promise(res=>{ const a = {stop:false}; anim = a; const t0 = performance.now();
      const step = now => { if(a.stop || !alive()) return; const k=Math.min(1,(now-t0)/ms), e = k<.5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
        const v = from + (to-from)*e; setPos(v); live(Math.round(v)); if(k<1) requestAnimationFrame(step); else res(); };
      requestAnimationFrame(step); });
  }
  function live(v){ const q=S && S.qs[S.i], el=$(".mj-asc-live"); if(!el||!q) return;
    el.innerHTML = isT(q) ? `<small>Température&nbsp;:</small> ${fmt(v)}${NB}°C` : `<small>Étage&nbsp;:</small> ${fmt(v)}`; }
  async function play(q, done){
    const R = reduced(), me = S;
    const ok = () => alive() && S===me;
    if(q.kind==="inv"){ setPos(q.start); live(q.start); const st=$(".mj-asc-chip.mj-asc-st .v"); if(st) st.textContent=par(q.start); await wait(R?500:700); if(!ok()) return; }
    else live(q.start);
    for(let i=0;i<q.ops.length;i++){
      const o=q.ops[i], d=o.s*o.v, chip=GAME.querySelector(`.mj-asc-chip[data-i="${i}"]`);
      if(chip){ chip.classList.add("cur"); }
      if(o.s<0 && chip){ await wait(R?250:450); if(!ok()) return; chip.classList.add("flip"); chip.querySelector(".c").textContent = LV[S.lv].cap ? caption(q,o)+", "+effText(q,d) : effText(q,d).replace("donc ","");
        chip.classList.remove("up","dn"); chip.classList.add(d>0?"up":"dn"); await wait(R?600:900); if(!ok()) return; }
      else if(chip && !LV[S.lv].cap && q.kind==="calc"){ chip.querySelector(".c").textContent = effText(q,d).replace("donc ",""); }
      const a=q.pos[i], b=q.pos[i+1];
      if(R){ setPos(b); live(b); await wait(450); }
      else await tween(a, b, Math.max(450, Math.min(2600, 230*Math.abs(d))));
      if(!ok()) return;
      if(chip){ chip.classList.remove("cur"); chip.classList.add("done"); }
      await wait(R?150:300); if(!ok()) return;
    }
    done();
  }
  function result(q, g){
    const good = g===q.ans; S.phase="res";
    S.res[S.i] = good;
    let pts = 0;
    if(good){ S.streak++; S.ok++; pts = 100 + 20*Math.min(Math.max(S.streak-1,0),5); S.score += pts; } else S.streak = 0;
    marks.res = good; if(!good) marks.good = q.ans; drawMarks(); topbar();
    const T=isT(q), fin=q.pos[q.pos.length-1];
    const ansTxt = q.kind==="inv" ? `L'ascenseur est parti ${where(q.ans)}.` : T ? `Il fait ${fmt(fin)}${NB}°C à la fin.` : `L'ascenseur arrive ${where(fin)}.`;
    let html = `<p class="mj-asc-verdict">${good ? pick(["Bravo, bien prévu !","Exact !","Parfait !","Dans le mille !"]) : "Pas tout à fait…"}</p>`;
    if(!good) html += `<p>Tu avais prévu <b>${fmt(g)}${unit(q)}</b>. ${ansTxt}</p>`;
    else html += `<p>${ansTxt} <span class="mj-asc-pts">+${pts} points</span></p>`;
    if(q.kind==="inv"){ html += `<p>On part de l'arrivée et on défait les trajets&nbsp;:</p>` + invLines(q).map(l=>`<p class="mj-asc-calc">${l}</p>`).join(""); }
    else { if(q.ops.length>1 && q.ops.some(o=>o.s<0)) html += `<p class="mj-asc-calc">${expr(q)} = <b>${fmt(fin)}</b></p>`;
           html += calcLines(q).map(l=>`<p class="mj-asc-calc">${l}</p>`).join(""); }
    if(!good) diagnose(q, g).forEach(m=>html += `<p>${m}</p>`);
    const last = S.i===NQ-1;
    $(".mj-asc-zone").innerHTML = `<div class="mj-asc-fb ${good?"ok":"ko"}" role="status">${html}</div>
      <button class="btn primary mj-asc-next">${last ? "Voir mon résultat" : "Question suivante →"}</button>`;
    const nx = $(".mj-asc-next"); nx.onclick = ()=>{ if(last) end(); else { S.i++; question(); } }; nx.focus({preventScroll:true});
  }
  function end(){
    const lv=S.lv, st=starsFor(S.ok), rec = S.score > (data.best[lv]||0);
    if(rec) data.best[lv] = S.score; data.stars[lv] = Math.max(data.stars[lv]||0, st); save(data);
    S.phase="end";
    const box = document.createElement("div"); box.className="mj-asc-end";
    box.innerHTML = `<div class="mj-asc-endbox" role="dialog" aria-label="Résultat du niveau"><h3>${st===3?"Champion des relatifs !":st===2?"Très bien !":st===1?"C'est un bon début !":"Courage, recommence !"}</h3>
      <div class="mj-asc-big">${STARS(st)}</div>
      <p><b>${S.ok}</b> bonne${S.ok>1?"s":""} réponse${S.ok>1?"s":""} sur ${NQ} · <b>${S.score}</b> points</p>
      ${rec && S.score>0 ? `<p class="mj-asc-rec">Nouveau record&nbsp;!</p>` : `<p>Record&nbsp;: ${data.best[lv]||0} points</p>`}
      <p style="color:var(--muted);font-size:.95rem">${st<3 ? "3 étoiles : 8 bonnes réponses sur 8. 2 étoiles : 6 sur 8." : "Tu as toutes les étoiles de ce niveau."}</p>
      <div class="mj-asc-row"><button class="btn mj-asc-again">Rejouer ce niveau</button>${lv<LV.length-1?`<button class="btn primary mj-asc-nextlv">Niveau suivant →</button>`:""}<button class="btn mj-asc-menu-b">Tous les niveaux</button></div></div>`;
    GAME.appendChild(box);
    box.querySelector(".mj-asc-again").onclick = ()=>start(lv);
    const n=box.querySelector(".mj-asc-nextlv"); if(n) n.onclick = ()=>start(lv+1);
    box.querySelector(".mj-asc-menu-b").onclick = menu;
    (n || box.querySelector(".mj-asc-again")).focus({preventScroll:true});
  }
  menu();
}
return {init, _t:{LV, gen, positions, expr, story, calcLines, invLines, diagnose, parse, caption, fmt, par}};
})();
