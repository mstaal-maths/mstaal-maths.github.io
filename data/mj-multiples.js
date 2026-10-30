/* Chasse aux multiples (6e, critères de divisibilité par 2, 3, 4, 5, 9 et 10) : une grille de nombres,
   cliquer sur tous les multiples demandés avant la fin du chrono. Chaque erreur est expliquée avec le critère. */
window.MJ_MULTIPLES = (function(){
const KEY = "staal-mj-multiples6", NB = 20, MANCHES = 3;
const rnd = (a,b) => a + Math.floor(Math.random()*(b-a+1));
const pick = a => a[Math.floor(Math.random()*a.length)];
const melange = a => { for(let i = a.length-1; i > 0; i--){ const j = Math.floor(Math.random()*(i+1)); [a[i],a[j]] = [a[j],a[i]]; } return a; };
const sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");      // 12345 → « 12 345 »
const chiffres = n => String(n).split("").map(Number);
const somme = n => chiffres(n).reduce((a,b) => a+b, 0);
const pgcd = (a,b) => b ? pgcd(b, a%b) : a;
const ppcm = l => l.reduce((a,b) => a*b/pgcd(a,b), 1);
const estM = (n, crit) => crit.every(d => n % d === 0);

/* ---------- les critères ---------- */
const REGLE = {
  2:"Un multiple de 2 se termine par 0, 2, 4, 6 ou 8.",
  5:"Un multiple de 5 se termine par 0 ou par 5.",
  10:"Un multiple de 10 se termine par 0.",
  3:"Un multiple de 3 : la somme de ses chiffres est dans la table de 3.",
  9:"Un multiple de 9 : la somme de ses chiffres est dans la table de 9.",
  4:"Un multiple de 4 : le nombre formé par ses deux derniers chiffres est dans la table de 4."
};
const nomCrit = crit => crit.length === 1 ? `multiples de ${crit[0]}` : `multiples de ${crit[0]} et de ${crit[1]}`;
/* « 13 n'est pas dans la table de 3 (4 × 3 = 12 ; 5 × 3 = 15) » ou « 12 = 4 × 3 » */
function table(s, d){
  if(s % d === 0) return {ok:true, txt:`${s} = ${s/d} × ${d}`};
  const q = Math.floor(s/d);
  if(q === 0) return {ok:false, txt:`${s} n'est pas dans la table de ${d} (${s} est plus petit que ${d})`};
  return {ok:false, txt:`${s} n'est pas dans la table de ${d} (${q} × ${d} = ${q*d} ; ${q+1} × ${d} = ${(q+1)*d})`};
}
/* une explication courte pour un critère : {ok, txt} (ok : n est multiple de d) */
function critere(n, d){
  const u = n % 10, N = sp(n);
  if(d === 2 || d === 5 || d === 10){
    const ok = n % d === 0;
    return {ok, txt:`${N} se termine par ${u}`};
  }
  if(d === 3 || d === 9){
    const s = somme(n), T = table(s, d);
    return {ok:T.ok, txt:`${chiffres(n).join(" + ")} = ${s}, et ${T.txt}`};
  }
  /* d = 4 */
  if(n < 100){ const T = table(n, 4); return {ok:T.ok, txt:T.txt}; }
  const D = n % 100, ds = String(n).slice(-2);
  if(D === 0) return {ok:true, txt:`${N} se termine par 00, et 0 est dans la table de 4 (0 × 4 = 0)`};
  const T = table(D, 4);
  return {ok:T.ok, txt:`les deux derniers chiffres de ${N} forment ${ds}${ds[0]==="0" ? ", c'est-à-dire " + D : ""}, et ${T.txt}`};
}
/* l'explication complète affichée à l'élève (texte simple) */
function explique(n, crit){
  const N = sp(n);
  if(crit.length === 1){
    const d = crit[0], C = critere(n, d), u = n % 10;
    if(d === 2) return C.ok ? `${C.txt} : il est pair, c'est un multiple de 2.` : `${C.txt} : il est impair, ce n'est pas un multiple de 2.`;
    if(d === 5) return C.ok ? `${C.txt} : c'est un multiple de 5.` : `${C.txt} (ni 0, ni 5) : ce n'est pas un multiple de 5.`;
    if(d === 10) return C.ok ? `${C.txt} : c'est un multiple de 10.` : u === 5 ? `${C.txt}, pas par 0 : ce n'est pas un multiple de 10 (mais c'est un multiple de 5).` : `${C.txt}, pas par 0 : ce n'est pas un multiple de 10.`;
    if(d === 3) return C.ok ? `${N} : ${C.txt}. C'est un multiple de 3.`
      : `${N} : ${C.txt}. Ce n'est pas un multiple de 3.` + ([3,6,9].includes(u) ? ` Le dernier chiffre ne suffit pas : pour 3, on additionne les chiffres.` : "");
    if(d === 9) return C.ok ? `${N} : ${C.txt}. C'est un multiple de 9.`
      : `${N} : ${C.txt}. Ce n'est pas un multiple de 9.` + (n % 3 === 0 ? ` C'est un multiple de 3, mais pas de 9.` : "");
    /* 4 */
    const ph = C.txt.charAt(0).toUpperCase() + C.txt.slice(1);
    return C.ok ? `${ph}. C'est un multiple de 4.` : `${ph}. Ce n'est pas un multiple de 4.` + (n % 2 === 0 && u === 4 ? ` Se terminer par 4 ne suffit pas !` : n % 2 === 0 ? ` Il est pair, mais ça ne suffit pas.` : "");
  }
  const parts = crit.map(d => { const C = critere(n, d);
    const court = (d === 2 || d === 5 || d === 10) ? `il se termine par ${n % 10}` : (d === 4 && n >= 100) ? C.txt.replace(` de ${N}`, "") : C.txt;
    return {ok:C.ok, d, txt:`${court} → ${C.ok ? "" : "pas "}multiple de ${d}`}; });
  const ok = parts.every(p => p.ok);
  return `${N} : ${parts.map(p => p.txt).join(" ; ")}. ` + (ok ? `C'est bien un multiple de ${crit[0]} et de ${crit[1]}.`
    : parts.some(p => p.ok) ? `Il faut les deux à la fois : ${N} n'est pas un multiple de ${crit[0]} et de ${crit[1]}.` : `Ce n'est ni un multiple de ${crit[0]}, ni un multiple de ${crit[1]}.`);
}

/* ---------- les niveaux ---------- */
const SIMPLES = [2,3,4,5,9,10], DOUBLES = [[2,3],[2,5],[3,5],[2,9],[3,4],[5,9]];
const LV = [
  {titre:"Multiples de 2", desc:"Les nombres pairs.", m:()=>[[2],[2],[2]], lo:10, hi:199, t:35},
  {titre:"Multiples de 5 et de 10", desc:"Regarde le dernier chiffre.", m:()=>melange([[5],[10],[pick([5,10])]]), lo:10, hi:999, t:40},
  {titre:"Multiples de 3", desc:"Additionne les chiffres.", m:()=>[[3],[3],[3]], lo:10, hi:299, t:55},
  {titre:"Multiples de 9", desc:"Additionne les chiffres… attention aux multiples de 3 !", m:()=>[[9],[9],[9]], lo:100, hi:999, t:60},
  {titre:"3 ou 9 ? Grands nombres", desc:"Des nombres à 4 chiffres.", m:()=>melange([[3],[9],[pick([3,9])]]), lo:1000, hi:9999, t:70},
  {titre:"Multiples de 4", desc:"Regarde les deux derniers chiffres.", m:()=>[[4],[4],[4]], lo:10, hi:999, t:60},
  {titre:"Le grand mélange", desc:"Un critère différent à chaque grille, sans rappel de la règle.", m:()=>melange(SIMPLES.slice()).slice(0,3).map(d=>[d]), lo:100, hi:99999, t:60, defi:true},
  {titre:"De 2 ET de 3", desc:"Les deux critères doivent être vrais.", m:()=>[[2,3],[2,3],[2,3]], lo:100, hi:999, t:70},
  {titre:"Doubles critères", desc:"De 3 et de 5, de 2 et de 9…", m:()=>melange(DOUBLES.slice(1)).slice(0,3), lo:100, hi:9999, t:75},
  {titre:"Défi final", desc:"Très grands nombres, critères simples ou doubles, sans rappel.", m:()=>melange([[pick(SIMPLES)],[pick([3,9,4])],pick(DOUBLES)]), lo:1000, hi:999999, t:75, defi:true}
];

/* ---------- fabrication d'une grille ---------- */
/* pièges « justes » : des nombres qui ressemblent à des multiples mais n'en sont pas */
function piege(crit){
  if(crit.length === 2) return n => crit.some(d => n % d === 0);           // multiple d'un seul des deux
  const d = crit[0];
  if(d === 2) return n => Math.floor(n/10) % 2 === 0;                       // impair, avec un chiffre des dizaines pair
  if(d === 5) return n => /[05]/.test(String(n).slice(0,-1));                // un 0 ou un 5 ailleurs qu'à la fin
  if(d === 10) return n => n % 5 === 0 || /0/.test(String(n).slice(0,-1));  // se termine par 5, ou un 0 ailleurs
  if(d === 3) return n => [3,6,9].includes(n % 10);                          // se termine par 3, 6 ou 9
  if(d === 9) return n => n % 3 === 0 || n % 10 === 9;                       // multiple de 3 seulement, ou finit par 9
  if(d === 4) return n => n % 2 === 0 || n % 100 % 10 === 4;                 // pair, ou finit par 4
  return () => true;
}
function grille(crit, lo, hi){
  const L = ppcm(crit), nM = rnd(7, 9), vus = new Set(), M = [], X = [];
  let k = 0;
  while(M.length < nM && k++ < 5000){ const n = (Math.ceil(lo/L) + rnd(0, Math.floor(hi/L) - Math.ceil(lo/L))) * L; if(!vus.has(n)){ vus.add(n); M.push(n); } }
  const P = piege(crit), nP = Math.round((NB - nM) * .6);
  k = 0;
  while(X.length < nP && k++ < 20000){ const n = rnd(lo, hi); if(!vus.has(n) && !estM(n, crit) && P(n)){ vus.add(n); X.push(n); } }
  k = 0;
  while(M.length + X.length < NB && k++ < 20000){ const n = rnd(lo, hi); if(!vus.has(n) && !estM(n, crit)){ vus.add(n); X.push(n); } }
  return melange(M.concat(X)).map(n => ({n, m:estM(n, crit)}));
}
function etoiles(trouves, total, err){
  const r = total ? trouves / total : 0;
  return r === 1 && err <= 1 ? 3 : r >= .8 && err <= 2 ? 2 : r >= .5 ? 1 : 0;
}

/* ---------- record ---------- */
function lire(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
function ecrire(r){ try{ localStorage.setItem(KEY, JSON.stringify(r)); }catch(e){} }

/* ---------- style ---------- */
const CSS = `
.mj-multiples{--mu-gold:#e8a200;color:var(--ink)}
.mj-multiples-top{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:0 0 10px}
.mj-multiples-lv{min-width:52px;height:52px;border-radius:12px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font:inherit;font-weight:700;font-size:1rem;line-height:1;cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;padding:4px 6px}
.mj-multiples-lv small{font-size:.72rem;letter-spacing:1px;color:var(--mu-gold);font-weight:700}
.mj-multiples-lv small i{font-style:normal;color:color-mix(in srgb,var(--muted) 40%,transparent)}
.mj-multiples-lv.on{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}
.mj-multiples-opt{margin-left:auto;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.mj-multiples-tps{font:inherit;font-size:.92rem;font-weight:600;border:2px solid var(--line);background:var(--surface);color:var(--ink);padding:6px 12px;border-radius:999px;cursor:pointer}
.mj-multiples-tps[aria-pressed="true"]{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.mj-multiples-rec{font-weight:600;color:var(--muted);font-size:.92rem}
.mj-multiples-card{border:2px solid var(--line);border-radius:18px;background:var(--surface);padding:14px 18px 16px}
.mj-multiples-head{display:flex;align-items:flex-start;gap:20px;flex-wrap:wrap;justify-content:space-between}
.mj-multiples-lvt{font-family:var(--f-display);font-weight:800;font-size:1.05rem;color:var(--muted)}
.mj-multiples-quoi{font-family:var(--f-display);font-weight:800;font-size:1.6rem;line-height:1.15;margin:2px 0}
.mj-multiples-quoi b{color:var(--c)}
.mj-multiples-regle{font-size:.98rem;color:var(--muted);line-height:1.45}
.mj-multiples-hud{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
.mj-multiples-stat{display:flex;flex-direction:column;line-height:1.2;min-width:62px}
.mj-multiples-stat b{font-family:var(--f-display);font-size:1.45rem}
.mj-multiples-stat span{font-size:.82rem;color:var(--muted);font-weight:600}
.mj-multiples-stat.serie b{color:var(--mu-gold)}
.mj-multiples-chrono{display:flex;align-items:center;gap:10px;margin:10px 0 10px}
.mj-multiples-chrono .bar{flex:1;height:12px;border-radius:99px;background:color-mix(in srgb,var(--ink) 10%,transparent);overflow:hidden}
.mj-multiples-chrono .bar i{display:block;height:100%;width:100%;background:var(--c);border-radius:99px;transform-origin:left;transition:background .3s}
.mj-multiples-chrono .bar i.urg{background:#d93025}
.mj-multiples-chrono b{font-family:var(--f-display);font-size:1.15rem;min-width:3.6em;text-align:right}
.mj-multiples-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
.mj-multiples-cell{position:relative;height:66px;border-radius:14px;border:2px solid var(--line);background:var(--surface);color:var(--ink);font-family:var(--f-display);font-weight:800;font-size:1.55rem;cursor:pointer;font-variant-numeric:tabular-nums;transition:transform .12s,border-color .12s,background .2s;padding:0 6px;white-space:nowrap}
.mj-multiples-cell:hover:not(:disabled){border-color:var(--c);transform:translateY(-2px)}
.mj-multiples-cell:disabled{cursor:default}
.mj-multiples-cell.cache{color:transparent;background:color-mix(in srgb,var(--ink) 6%,var(--surface))}
.mj-multiples-cell.cache::after{content:"?";position:absolute;inset:0;display:grid;place-items:center;color:var(--muted)}
.mj-multiples-cell.ok{background:var(--okbg);border-color:var(--ok);color:var(--ok)}
.mj-multiples-cell.ko{background:var(--kobg);border-color:var(--ko);color:var(--ko);text-decoration:line-through;text-decoration-thickness:2px}
.mj-multiples-cell.oubli{border:3px dashed var(--mu-gold);background:var(--warnbg)}
.mj-multiples-cell.fin{cursor:help}
.mj-multiples-cell .fx{position:absolute;right:8px;top:4px;font-size:.95rem;font-family:var(--f-body);pointer-events:none;color:var(--ok)}
.mj-multiples-cell .fx.moins{color:var(--ko)}
@keyframes mjMuUp{from{transform:none;opacity:1}to{transform:translateY(-22px);opacity:0}}
@keyframes mjMuShake{0%,100%{transform:none}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
@keyframes mjMuPop{0%{transform:scale(1)}50%{transform:scale(1.08)}100%{transform:scale(1)}}
.mj-multiples-cell .fx{animation:mjMuUp .9s ease-out forwards}
.mj-multiples-cell.shake{animation:mjMuShake .3s}
.mj-multiples-cell.pop{animation:mjMuPop .25s}
@media (prefers-reduced-motion:reduce){.mj-multiples-cell .fx{animation:none;opacity:0}.mj-multiples-cell.shake,.mj-multiples-cell.pop{animation:none}.mj-multiples-cell{transition:none}}
.mj-multiples-fb{display:flex;align-items:center;gap:16px;margin-top:12px;min-height:70px}
.mj-multiples-msg{flex:1;border-radius:12px;padding:10px 14px;background:color-mix(in srgb,var(--c) 8%,var(--surface));border:1.5px solid var(--line);line-height:1.5;font-size:1rem}
.mj-multiples-msg.ok{border-color:var(--ok);background:var(--okbg)}
.mj-multiples-msg.ko{border-color:var(--ko);background:var(--kobg)}
.mj-multiples-msg .vd{font-family:var(--f-display);font-weight:800;font-size:1.1rem;margin-right:6px}
.mj-multiples-fb .btn{white-space:nowrap}
.mj-multiples-end .big{font-family:var(--f-display);font-weight:800;font-size:1.25rem}
.mj-multiples-end .st{color:var(--mu-gold);font-size:1.45rem;letter-spacing:3px}
.mj-multiples-end .st i{font-style:normal;color:color-mix(in srgb,var(--muted) 40%,transparent)}
.mj-multiples-end .acts{display:flex;gap:10px;flex-wrap:wrap;margin-top:6px}
.mj-multiples-help{margin:0 0 10px;border:2px dashed color-mix(in srgb,var(--c) 45%,var(--line));border-radius:14px;padding:8px 16px;background:var(--surface)}
.mj-multiples-help ul{margin:0;padding-left:1.2em;line-height:1.6}
.mj-multiples-aideb{font:inherit;font-size:.92rem;font-weight:700;border:2px solid var(--c);color:var(--c);background:var(--surface);padding:6px 14px;border-radius:999px;cursor:pointer}
.mj-multiples-voir{font:inherit;font-size:.9rem;font-weight:600;background:none;border:0;color:var(--c);text-decoration:underline;cursor:pointer;padding:0}
html.ls-1 .mj-multiples-cell{letter-spacing:.02em}
`;

/* ---------- le jeu ---------- */
function init(root){
  if(!document.getElementById("mj-multiples-css")){ const st = document.createElement("style"); st.id = "mj-multiples-css"; st.textContent = CSS; document.head.appendChild(st); }
  const rec = lire(); rec.lv = rec.lv || {};
  let lv = Math.min(LV.length-1, Math.max(0, +rec.dernier || 0));
  let G = null, M = null;  // G : niveau en cours ; M : manche en cours
  root.innerHTML = `<div class="mj-multiples">
    <div class="mj-multiples-top"><span class="mj-multiples-lvs" role="group" aria-label="Niveaux" style="display:contents"></span>
      <span class="mj-multiples-opt"><button class="mj-multiples-tps" aria-pressed="${rec.temps ? "true" : "false"}" title="Le chrono dure une fois et demie plus longtemps">Plus de temps</button><span class="mj-multiples-rec"></span><button class="mj-multiples-aideb" aria-controls="mj-multiples-aide"></button></span></div>
    <div class="mj-multiples-help" id="mj-multiples-aide"${Object.keys(rec.lv).length ? " hidden" : ""}><ul>
      <li>Clique sur <b>tous les multiples</b> demandés avant la fin du chrono. Une erreur coûte 5 points et elle est expliquée.</li>
      <li>Bonne réponse : 10 points, plus un <b>bonus de série</b> si tu enchaînes sans erreur. Grille finie avant la fin : bonus de temps.</li>
      <li>3 grilles par niveau. 3 étoiles : tous les multiples trouvés, avec au plus une erreur.</li>
      <li>Besoin de plus de temps pour lire ? Active « Plus de temps », en haut.</li>
    </ul></div>
    <div class="mj-multiples-card">
      <div class="mj-multiples-head">
        <div><div class="mj-multiples-lvt"></div><div class="mj-multiples-quoi"></div><div class="mj-multiples-regle"></div></div>
        <div class="mj-multiples-hud">
          <div class="mj-multiples-stat"><span>Grille</span><b class="k-m"></b></div>
          <div class="mj-multiples-stat"><span>Trouvés</span><b class="k-t"></b></div>
          <div class="mj-multiples-stat"><span>Erreurs</span><b class="k-e"></b></div>
          <div class="mj-multiples-stat serie"><span>Série</span><b class="k-s"></b></div>
          <div class="mj-multiples-stat"><span>Score</span><b class="k-sc"></b></div>
        </div>
      </div>
      <div class="mj-multiples-chrono" aria-hidden="true"><span class="bar"><i></i></span><b></b></div>
      <div class="mj-multiples-grid"></div>
      <div class="mj-multiples-fb"><div class="mj-multiples-msg" aria-live="polite"></div><button class="btn primary mj-multiples-go"></button></div>
    </div>
</div>`;
  const $ = s => root.querySelector(s);
  const lvs = $(".mj-multiples-lvs"), grid = $(".mj-multiples-grid"), msg = $(".mj-multiples-msg"), go = $(".mj-multiples-go"),
        bar = $(".mj-multiples-chrono .bar i"), sec = $(".mj-multiples-chrono b"), tps = $(".mj-multiples-tps"),
        aide = $(".mj-multiples-help"), aideb = $(".mj-multiples-aideb");
  const aideMaj = () => { aideb.textContent = aide.hidden ? "Comment jouer ?" : "Fermer l'aide"; aideb.setAttribute("aria-expanded", !aide.hidden); };
  aideb.onclick = () => { aide.hidden = !aide.hidden; aideMaj(); }; aideMaj();
  const reduit = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  tps.onclick = () => { rec.temps = !rec.temps; tps.setAttribute("aria-pressed", rec.temps ? "true" : "false"); ecrire(rec);
    if(M && M.etat === "pret"){ M.duree = duree(); chrono(); } };
  const duree = () => Math.round(LV[lv].t * (rec.temps ? 1.5 : 1));

  function barre(){
    lvs.innerHTML = LV.map((l,i)=>{ const e = (rec.lv[i]||{}).e || 0;
      return `<button class="mj-multiples-lv${i===lv?" on":""}" data-i="${i}" title="Niveau ${i+1} : ${l.titre}" aria-label="Niveau ${i+1} : ${l.titre}, ${e} étoile${e>1?"s":""}">${i+1}<small>${"★".repeat(e)}<i>${"★".repeat(3-e)}</i></small></button>`; }).join("");
    lvs.querySelectorAll("button").forEach(b => b.onclick = () => { lv = +b.dataset.i; niveau(); });
    const r = (rec.lv[lv]||{}).best;
    $(".mj-multiples-rec").textContent = r !== undefined ? `Record : ${r} points` : "Pas encore de record";
  }
  function hud(){
    $(".k-m").textContent = `${G.i+1} / ${MANCHES}`;
    $(".k-t").textContent = M ? `${M.trouves} / ${M.total}` : "–";
    $(".k-e").textContent = M ? M.err : 0;
    $(".k-s").textContent = M && M.serie > 1 ? "×" + M.serie : "–";
    $(".k-sc").textContent = G.score;
  }
  function chrono(){
    const r = M ? Math.max(0, M.duree - M.ecoule) : duree(), f = M ? r / M.duree : 1;
    bar.style.transform = `scaleX(${f})`; bar.classList.toggle("urg", r <= 10 && M && M.etat === "jeu");
    sec.textContent = Math.ceil(r) + " s";
  }
  function niveau(){
    stop();
    rec.dernier = lv; ecrire(rec);
    G = {lv, i:0, score:0, crits:LV[lv].m(), trouves:0, total:0, err:0};
    barre(); manche();
  }
  function manche(){
    stop();
    const crit = G.crits[G.i], L = LV[lv];
    M = {crit, cases:grille(crit, L.lo, L.hi), trouves:0, err:0, serie:0, duree:duree(), ecoule:0, etat:"pret", pts:0};
    M.total = M.cases.filter(c => c.m).length;
    $(".mj-multiples-lvt").textContent = `Niveau ${lv+1} · ${L.titre}`;
    $(".mj-multiples-quoi").innerHTML = `Clique sur tous les <b>${crit.length === 1 ? "multiples de " + crit[0] : `multiples de ${crit[0]} ET de ${crit[1]}`}</b>`;
    $(".mj-multiples-regle").innerHTML = L.defi ? `<button class="mj-multiples-voir">Voir la règle</button>` : crit.map(d => REGLE[d]).join("<br>");
    const v = $(".mj-multiples-voir"); if(v) v.onclick = () => { $(".mj-multiples-regle").innerHTML = crit.map(d => REGLE[d]).join("<br>"); };
    grid.innerHTML = M.cases.map((c,i) => `<button class="mj-multiples-cell cache" data-i="${i}" disabled aria-label="Nombre caché">${sp(c.n)}</button>`).join("");
    grid.querySelectorAll("button").forEach(b => b.onclick = () => clic(+b.dataset.i, b));
    msg.className = "mj-multiples-msg";
    msg.innerHTML = `Grille ${G.i+1} sur ${MANCHES} : trouve les <b>${M.total}</b> ${nomCrit(crit)} cachés parmi ${NB} nombres. Le chrono démarre quand tu cliques sur « C'est parti ! ».`;
    go.hidden = false; go.textContent = "C'est parti !"; go.onclick = depart;
    hud(); chrono();
    if(root.contains(document.activeElement) || !document.activeElement || document.activeElement === document.body) go.focus({preventScroll:true});
    voir();
  }
  let raf = 0, t0 = 0;
  function stop(){ cancelAnimationFrame(raf); raf = 0; }
  function depart(){
    M.etat = "jeu"; go.hidden = true;
    grid.querySelectorAll("button").forEach((b,i) => { b.classList.remove("cache"); b.disabled = false; b.setAttribute("aria-label", sp(M.cases[i].n)); });
    msg.className = "mj-multiples-msg"; msg.innerHTML = "À toi de jouer !";
    if(root.contains(document.activeElement) || document.activeElement === document.body) grid.querySelector("button").focus({preventScroll:true});
    t0 = performance.now();
    const M0 = M;
    const pas = now => {
      if(M !== M0 || M.etat !== "jeu") return;
      if(!root.isConnected){ return; }
      const dt = Math.min(250, now - t0); t0 = now;
      if(!document.hidden) M.ecoule += dt / 1000;
      chrono();
      if(M.ecoule >= M.duree){ finManche(false); return; }
      raf = requestAnimationFrame(pas);
    };
    raf = requestAnimationFrame(pas);
  }
  function fx(b, txt, moins){
    if(reduit()) return;
    const s = document.createElement("span"); s.className = "fx" + (moins ? " moins" : ""); s.textContent = txt; b.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
  function anim(b, cl){ b.classList.remove(cl); void b.offsetWidth; b.classList.add(cl); }
  function clic(i, b){
    const c = M.cases[i];
    if(M.etat === "fin"){ msg.className = "mj-multiples-msg " + (c.m ? "ok" : ""); msg.textContent = explique(c.n, M.crit); return; }
    if(M.etat !== "jeu" || c.f) return;
    c.f = true; b.disabled = true;
    if(c.m){
      M.trouves++; M.serie++;
      const bonus = Math.min(M.serie - 1, 5) * 2, p = 10 + bonus;
      M.pts += p; G.score += p;
      b.classList.add("ok"); anim(b, "pop"); fx(b, "+" + p);
      msg.className = "mj-multiples-msg ok";
      msg.innerHTML = `<span class="vd">Oui !</span>${explique(c.n, M.crit)}${bonus ? ` <b>Série ×${M.serie} : +${bonus}</b>` : ""}`;
      hud();
      if(M.trouves === M.total) finManche(true);
    } else {
      M.err++; M.serie = 0;
      const p = Math.min(5, G.score); G.score -= p; M.pts -= p;
      b.classList.add("ko"); anim(b, "shake"); fx(b, "−5", true);
      msg.className = "mj-multiples-msg ko";
      msg.innerHTML = `<span class="vd">Non !</span>${explique(c.n, M.crit)}`;
      hud();
    }
  }
  function finManche(complet){
    stop(); M.etat = "fin";
    G.trouves += M.trouves; G.total += M.total; G.err += M.err;
    let bonus = 0;
    if(complet){ bonus = Math.floor(M.duree - M.ecoule); G.score += bonus; M.pts += bonus; }
    const oubli = [];
    grid.querySelectorAll("button").forEach((b,i) => { const c = M.cases[i]; b.disabled = false; b.classList.add("fin");
      if(c.m && !c.f){ b.classList.add("oubli"); oubli.push(c.n); } });
    hud(); chrono();
    msg.className = "mj-multiples-msg " + (complet ? "ok" : "");
    msg.innerHTML = complet
      ? `<span class="vd">Grille terminée !</span>Il restait ${Math.floor(M.duree - M.ecoule)} s : <b>+${bonus} points</b> de bonus. Clique sur un nombre pour revoir pourquoi.`
      : `<span class="vd">Temps écoulé !</span>${oubli.length === 1 ? "Il manquait 1 multiple, entouré en orange" : `Il manquait ${oubli.length} multiples, entourés en orange`}. Clique dessus pour comprendre.`;
    go.hidden = false;
    go.textContent = G.i < MANCHES - 1 ? "Grille suivante" : "Voir le bilan";
    go.onclick = () => { if(G.i < MANCHES - 1){ G.i++; manche(); } else bilan(); };
    if(root.contains(document.activeElement) || document.activeElement === document.body) go.focus({preventScroll:true});
  }
  function bilan(){
    M = null;
    const e = etoiles(G.trouves, G.total, G.err), r = rec.lv[lv] || {}, nouveau = r.best === undefined || G.score > r.best;
    if(nouveau) r.best = G.score; r.e = Math.max(r.e || 0, e); rec.lv[lv] = r; ecrire(rec);
    barre(); hud();
    $(".k-m").textContent = `${MANCHES} / ${MANCHES}`;
    grid.querySelectorAll("button").forEach(b => { b.disabled = true; });
    msg.className = "mj-multiples-msg " + (e >= 2 ? "ok" : "");
    msg.innerHTML = `<div class="mj-multiples-end"><span class="big">Niveau terminé : ${G.score} points <span class="st" aria-label="${e} étoile${e>1?"s":""}">${"★".repeat(e)}<i>${"★".repeat(3-e)}</i></span></span><br>
      ${G.trouves} multiples trouvés sur ${G.total}, ${G.err} erreur${G.err>1?"s":""}.${nouveau ? " <b>Nouveau record !</b>" : ` Record : ${r.best} points.`}
      ${e < 3 ? `<br>Pour 3 étoiles : trouve tous les multiples avec au plus une erreur.` : ""}
      <div class="acts"><button class="btn primary" data-a="re">Rejouer ce niveau</button>${lv < LV.length-1 ? `<button class="btn" data-a="nx">Niveau suivant</button>` : ""}</div></div>`;
    go.hidden = true;
    msg.querySelector('[data-a="re"]').onclick = () => niveau();
    const nx = msg.querySelector('[data-a="nx"]'); if(nx) nx.onclick = () => { lv++; niveau(); };
    if(root.contains(document.activeElement) || document.activeElement === document.body) msg.querySelector('[data-a="re"]').focus({preventScroll:true});
  }
  let vu = false;
  function voir(){ if(vu) return; vu = true; const c = $(".mj-multiples-card"), r = c.getBoundingClientRect();
    if(r.bottom > innerHeight && r.top > 0) window.scrollBy({top: Math.min(r.top - 8, r.bottom - innerHeight + 12), behavior: reduit() ? "auto" : "smooth"}); }
  /* lecture seule, pour les tests automatiques */
  root._mjEtat = () => ({lv, i:G && G.i, score:G && G.score, etat:M && M.etat, crit:M && M.crit, cases:M && M.cases.map(c => ({n:c.n, m:c.m, f:!!c.f})), restant:M && (M.duree - M.ecoule)});
  niveau();
}
return {init, _t:{LV, grille, explique, critere, estM, sp, somme, ppcm, etoiles, REGLE, NB}};
})();
