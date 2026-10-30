/* 6e · chapitre 7 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres horaires */
TRAIN["6e-7"] = function(){
const {ri, pick, shuf, sp, distinct, items} = TR;
const {tl, H, DU, p2} = window.FIG7;
const hm = m => `${Math.floor(m/60)} h ${p2(m%60)} min`;
const ms = s => `${Math.floor(s/60)} min ${s%60} s`;
/* calculs détaillés : ajouter une durée ; retirer (avec une heure transformée en 60 min si besoin) */
const plus = (a,d,R=H(a+d)) => { const m=(a%60)+(d%60), h=Math.floor(a/60)+Math.floor(d/60); return m>=60 ? `H = ${H(a)} + ${DU(d)}<br>H = ${h} h ${m}<br>H = ${R}` : `${H(a)} + ${DU(d)} = ${R}`; };
/* nmd : dans un bloc de calcul, même un calcul sans retenue s'écrit en chaîne nommée */
const nmd = (c,nm) => c.includes("<br>") ? c : `${nm} = ${c.replace(" = ",`<br>${nm} = `)}`;
/* nm : nom de la grandeur cherchée (H pour un horaire, t pour une durée) */
const moins = (b,x,X,R,nm) => b%60<x%60 ? `${nm} = ${H(b)} − ${X}<br>${nm} = ${Math.floor(b/60)-1} h ${60+b%60} − ${X}<br>${nm} = ${R}` : `${H(b)} − ${X} = ${R}`;

/* ---------- A. Convertir ---------- */
const c1 = shuf([["h",ri(2,9)],["hm",ri(1,7)*60+ri(5,55)],["s",60*ri(2,12)],["hm",ri(1,5)*60+ri(1,9)]]);
const c2 = shuf([["m",ri(2,9)],["ms",ri(2,9)*60+ri(10,55)],["m",ri(11,30)],["ms",ri(1,5)*60+ri(1,9)]]);
const c3 = distinct(4, ()=>ri(2,20)*60+ri(1,59), x=>x);
const t4 = ri(1,9)*3600+ri(1,59)*60+ri(1,59);
const e5 = distinct(4, ()=>[ri(1,10), ri(61,150)], x=>x.join());
const secA = {t:"Convertir des durées", e:[
  {n:"Exercice 1", t:"Convertir en minutes", w:"Sur ton cahier", h:`<p>${items(c1.map(([k,v])=>k==="h"?`${v} h`:k==="hm"?hm(v):`${v} s`),"  ·  ",true)}</p>`,
   c:items(c1.map(([k,v])=>k==="h"?`${v} × 60 = ${60*v} min`:k==="hm"?`${Math.floor(v/60)} × 60 + ${v%60} = ${v} min`:`${v} ÷ 60 = ${v/60} min`),"  ·  ",true)},
  {n:"Exercice 2", t:"Convertir en secondes", w:"Sur ton cahier", h:`<p>${items(c2.map(([k,v])=>k==="m"?`${v} min`:ms(v)),"  ·  ",true)}</p>`,
   c:items(c2.map(([k,v])=>k==="m"?`${v} × 60 = ${sp(60*v)} s`:`${Math.floor(v/60)} × 60 + ${v%60} = ${v} s`),"  ·  ",true)},
  {n:"Exercice 3", t:"Convertir en minutes et secondes", w:"Sur ton cahier", h:`<p>${items(c3.map(v=>`${sp(v)} s`),"  ·  ",true)}</p>`,
   c:items(c3.map(v=>`${sp(v)} = ${Math.floor(v/60)} × 60 + ${v%60} : ${ms(v)}`),"  ·  ",true)},
  {n:"Exercice 4", t:"Convertir en heures, minutes et secondes", w:"Sur ton cahier", h:`<p>Convertis ${sp(t4)} s en heures, minutes et secondes (d'abord en minutes et secondes, puis les minutes en heures et minutes).</p>`,
   c:`<p>${sp(t4)} = ${Math.floor(t4/60)} × 60 + ${t4%60}, donc ${sp(t4)} s = ${Math.floor(t4/60)} min ${t4%60} s.</p><p>${Math.floor(t4/60)} = ${Math.floor(t4/3600)} × 60 + ${Math.floor(t4/60)%60}, donc ${Math.floor(t4/60)} min = ${Math.floor(t4/3600)} h ${Math.floor(t4/60)%60} min.</p><p>Finalement : <b>${sp(t4)} s = ${Math.floor(t4/3600)} h ${p2(Math.floor(t4/60)%60)} min ${p2(t4%60)} s</b>.</p>`},
  {n:"Exercice 5", t:"Écrire correctement une durée", w:"Sur ton cahier", h:`<p>Écris correctement (moins de 60 minutes) : ${items(e5.map(([h,m])=>`${h} h ${m} min`),"  ·  ",true)}</p>`,
   c:items(e5.map(([h,m])=>`${m} min = ${Math.floor(m/60)} h ${m%60} min, donc ${h} h ${m} min = <b>${hm(60*h+m)}</b>`),"  ·  ",true)},
  {n:"Exercice 6", t:"Vrai ou faux ?", w:"Sur ton cahier", h:`<p>${items(["2,5 h, c'est 2 h 50 min.","Un quart d'heure dure 15 minutes.","0,75 h, c'est 45 min.","120 minutes, c'est 1 h 20 min."],"  ·  ",true)}</p>`,
   c:items(["<b>Faux</b> : 2,5 h = 2 h 30 min.","<b>Vrai</b> : 60 ÷ 4 = 15 min.","<b>Vrai</b> : trois quarts d'heure, 3 × 15 = 45 min.","<b>Faux</b> : 120 min = 2 × 60 min = 2 h."],"  ·  ",true)}
]};

/* ---------- B. Horaires et durées ---------- */
const noms = shuf(["Lina","Tom","Inès","Yanis","Zoé","Adam","Maëlys","Noé"]);
const IL = n => ["Lina","Inès","Zoé","Maëlys"].includes(n) ? "elle" : "il";
const sansRet = () => { const a=ri(7,17)*60+ri(0,25), d=ri(1,3)*60+ri(5,30); return [a,d]; };
const avecRet = () => { let a,d; do{ a=ri(7,17)*60+ri(30,55); d=ri(1,3)*60+ri(20,55); }while((a%60)+(d%60)<60); return [a,d]; };
const [a1,d1]=sansRet(), [a2,d2]=avecRet();
let b3,d3; do{ b3=ri(9,19)*60+ri(0,20); d3=ri(25,55); }while(b3%60>=d3);
let a4,b4; do{ a4=ri(7,10)*60+ri(30,55); b4=a4+ri(2,4)*60+ri(10,50); }while(b4%60>=a4%60);
const rows = shuf([0,0,0,1,1,2,2,0]).map(t=>{ const [a,d]=Math.random()<.5?sansRet():avecRet(); return {a,d,b:a+d,t}; });
const cell = (r,k) => k===r.t ? "……" : k===0 ? H(r.a) : k===1 ? DU(r.d) : H(r.b);
const sol = r => r.t===0 ? H(r.b) : r.t===1 ? H(r.a) : DU(r.d);
const rows2 = rows.map(r=>({...r, t: r.t===0?2: r.t===1?0:1}));   /* t : 0 départ inconnu, 1 durée inconnue, 2 arrivée inconnue */
const cel2 = (r,k) => (k===0&&r.t===0)||(k===1&&r.t===1)||(k===2&&r.t===2) ? "……" : k===0?H(r.a):k===1?DU(r.d):H(r.b);
const sol2 = r => r.t===0?H(r.a):r.t===1?DU(r.d):H(r.b);
let [a8,d8]=avecRet(); let b8b,a8b; do{ a8b=ri(8,10)*60+ri(10,40); b8b=a8b+ri(1,3)*60+ri(5,45); }while(false);
let b8c,d8c; do{ b8c=ri(15,19)*60+ri(0,25); d8c=ri(1,2)*60+ri(30,55); }while(b8c%60>=d8c%60);
const n8=ri(18,30), k8=pick([10,12,15]), s8=pick([16,17,18])*60;
const secB = {t:"Calculer un horaire ou une durée", note:"<b>Rappel :</b> fais d'abord une frise pour voir ce que tu cherches.", e:[
  {n:"Activité 2", t:"Trouver l'horaire d'arrivée", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> ${noms[0]} part à ${H(a1)} pour un trajet de ${DU(d1)}. À quelle heure arrive-t-${IL(noms[0])} ?</p><p><b>Problème 2 :</b> ${noms[1]} commence un jeu à ${H(a2)} et y joue ${DU(d2)}. À quelle heure s'arrête-t-${IL(noms[1])} ?</p>`,
   c:`<p><b>Problème 1 :</b></p>${tl(a1,a1+d1,"b")}<p class="calc">${hm(a1)} + ${DU(d1)} = <b>${H(a1+d1)}</b></p><p><b>Problème 2 :</b></p>${tl(a2,a2+d2,"b")}<p class="calc">H = ${hm(a2)} + ${DU(d2)}<br>H = ${Math.floor(a2/60)+Math.floor(d2/60)} h ${(a2%60)+(d2%60)} min<br>H = <b>${H(a2+d2)}</b></p>`},
  {n:"Activité 3", t:"Trouver l'horaire de départ ou la durée", w:"Sur ton cahier", h:`<p><b>Problème 1 :</b> un gâteau sort du four à ${H(b3)}, après ${d3} min de cuisson. À quelle heure a-t-il été mis au four ?</p><p><b>Problème 2 :</b> une famille part à ${H(a4)} et arrive à ${H(b4)}. Combien de temps a duré le trajet ?</p>`,
   c:`<p><b>Problème 1 :</b></p>${tl(b3-d3,b3,"a")}<p class="calc">H = ${H(b3)} − ${d3} min<br>H = ${Math.floor(b3/60)-1} h ${60+b3%60} min − ${d3} min<br>H = <b>${H(b3-d3)}</b></p><p><b>Problème 2 :</b></p>${tl(a4,b4,"d")}<p class="calc">t = ${H(b4)} − ${hm(a4)}<br>t = ${Math.floor(b4/60)-1} h ${60+b4%60} min − ${hm(a4)}<br>t = <b>${DU(b4-a4)}</b></p>`},
  {n:"Exercice 7", t:"Compléter un tableau", w:"Sur ton cahier", h:`<div class="scroll"><table class="std"><thead><tr><th>Horaire de départ</th><th>Durée</th><th>Horaire d'arrivée</th></tr></thead><tbody>${rows2.map(r=>`<tr>${[0,1,2].map(k=>`<td>${cel2(r,k)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`,
   c:`<div class="scroll"><table class="std"><thead><tr><th>Départ</th><th>Durée</th><th>Arrivée</th><th>Calcul</th></tr></thead><tbody>${rows2.map(r=>`<tr>${[0,1,2].map(k=>`<td>${k===r.t?`<b>${sol2(r)}</b>`:cel2(r,k)}</td>`).join("")}<td>${r.t===2?plus(r.a,r.d):r.t===0?moins(r.b,r.d,DU(r.d),H(r.a),"H"):moins(r.b,r.a,H(r.a),DU(r.d),"t")}</td></tr>`).join("")}</tbody></table></div>`},
  {n:"Exercice 8", t:"Des problèmes à résoudre", w:"Sur ton cahier", h:`<p>1) Une famille part à ${H(a8)} ; le trajet dure ${DU(d8)}. À quelle heure arrive-t-elle ?</p><p>2) Une randonneuse part à ${H(a8b)} et rentre à ${H(b8b)}. Combien de temps a-t-elle marché ?</p><p>3) J'ai rendez-vous à ${H(b8c)}. Le trajet dure ${DU(d8c)}. À quelle heure dois-je partir ?</p><p>4) Un professeur reçoit ${n8} familles, ${k8} min chacune, à partir de ${H(s8)}. À quelle heure aura-t-il terminé ?</p>`,
   c:`<p>1) L'horaire d'arrivée H :</p><p class="calc">${nmd(plus(a8,d8),"H")}</p><p>Elle arrive à <b>${H(a8+d8)}</b>.</p><p>2) La durée t de la marche :</p><p class="calc">${nmd(moins(b8b,a8b,H(a8b),DU(b8b-a8b),"t"),"t")}</p><p>Elle a marché <b>${DU(b8b-a8b)}</b>.</p><p>3) L'horaire de départ H :</p><p class="calc">${nmd(moins(b8c,d8c,DU(d8c),H(b8c-d8c),"H"),"H")}</p><p>Je dois partir à <b>${H(b8c-d8c)}</b>.</p><p>4) ${n8} × ${k8} = ${n8*k8} min = ${DU(n8*k8)} ; ${H(s8)} + ${DU(n8*k8)} = <b>${H(s8+n8*k8)}</b></p>`}
]};

/* ---------- C. Tableau d'horaires ---------- */
const gares = ["Nantes","Clisson","Cholet"];
const tr = [0,1,2].map(()=>{ const d=ri(6,15)*60+ri(0,59), t1=ri(25,45), t2=ri(20,35); return [d, d+t1, d+t1+t2]; }).sort((x,y)=>x[0]-y[0]);
const tot = tr.map(t=>t[2]-t[0]); const best = tot.indexOf(Math.min(...tot));
const lim = tr[1][2]+ri(5,30), ok = tr.filter(t=>t[2]<lim).length, ret = ri(5,20);
const fast = tot.filter(x=>x===tot[best]).length===1;
const secC = {t:"Lire un tableau d'horaires", e:[
  {n:"Exercice 9", t:"Les trains", w:"Sur ton cahier", h:`<div class="scroll"><table class="std"><thead><tr><th>Gare</th><th>Train A</th><th>Train B</th><th>Train C</th></tr></thead><tbody>${gares.map((g,i)=>`<tr><th>${g}</th>${tr.map(t=>`<td>${H(t[i])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
   <p>1) Combien de temps dure le trajet Nantes — Cholet avec le train A ? 2) Nantes — Clisson avec le train B ? 3) Je dois être à Cholet avant ${H(lim)}. Quels trains puis-je prendre ? 4) Le train C arrive à Cholet avec ${ret} min de retard. À quelle heure arrive-t-il ? 5) Quel est le train le plus rapide entre Nantes et Cholet ?</p>`,
   c:`<p>1) Nantes — Cholet, train A :</p><p class="calc">${nmd(moins(tr[0][2],tr[0][0],H(tr[0][0]),`<b>${DU(tot[0])}</b>`,"t"),"t")}</p><p>2) Nantes — Clisson, train B :</p><p class="calc">${nmd(moins(tr[1][1],tr[1][0],H(tr[1][0]),`<b>${DU(tr[1][1]-tr[1][0])}</b>`,"t"),"t")}</p><p>3) <b>${(L=>L.length===0?"aucun train":L.length===1?"le train "+L[0]:"les trains "+L.slice(0,-1).join(", ")+" et "+L[L.length-1])(tr.map((t,i)=>t[2]<lim?"ABC"[i]:null).filter(Boolean))}</b> (arrivée avant ${H(lim)}) · 4) ${H(tr[2][2])} + ${ret} min = <b>${H(tr[2][2]+ret)}</b></p><p>5) Durées :</p>${tr.map((t,i)=>`<p>Train ${"ABC"[i]} :</p><p class="calc">${nmd(moins(t[2],t[0],H(t[0]),DU(tot[i]),"t"),"t")}</p>`).join("")}<p>${fast?`Le plus rapide est le <b>train ${"ABC"[best]}</b>.`:`Plusieurs trains mettent le même temps (${DU(tot[best])}).`}</p>`}
]};
return [secA, secB, secC];
};
