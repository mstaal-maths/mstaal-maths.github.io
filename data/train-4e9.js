/* 4e · chapitre 9 — fiche d'entraînement : les exercices de la fiche de M. Staal, avec d'autres nombres. */
TRAIN["4e-9"] = function(){
const {ri, pick, shuf, distinct} = TR;
const {ptab, N, F, ap, exact, rd, hm, hms, m2, M3} = window.P49;
const L="abcde";

/* ===== durées ===== */
const D1 = distinct(3, ()=>{ const m=pick([3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57]); return [ri(1,9), m]; });      /* h décimal → h min */
const D2 = distinct(3, ()=>pick([3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57]), x=>x);                            /* min → h */
const D3 = distinct(3, ()=>[ri(1,9), pick([3,6,9,12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57])]);                     /* h min → h */
const D4 = distinct(5, ()=>ri(61,1439), x=>x).sort((a,b)=>a-b);                                                           /* min → h min */
const D5 = distinct(3, ()=>ri(3601,35999), x=>x).sort((a,b)=>a-b);                                                        /* s → h min s */
const dec = (h,m) => N(h+m/60);
const E = x => { const v=rd(x,2); return Number.isInteger(v)?N(v):N(v,2).replace(/,(\d)$/,(m,d)=>","+d+"0"); };

/* ===== prix au kilo et débits ===== */
const K = (()=>{ const k=pick([2,3,4,5]), u=ri(120,450)/100; return {k, u, p:rd(k*u,2)}; })();
const RV = (()=>{ const s=pick([2,3,4,5,6]), d=pick([150,200,250,300,450,500]); return {s, v:s*d, d}; })();
const AQ = pick([0.25,0.3,0.35,0.4,0.45,0.5,0.55,0.6]);
const DB = [pick([0.42,0.53,0.57,0.67,0.71,0.85]), pick([0.38,0.47,0.57,0.62,0.74,0.93]), pick([1200,1800,2400,3000,3180,3600,4200])];

/* ===== vitesses ===== */
const V4a = (()=>{ let v; do{ v=ri(30,130); }while(exact(v/3.6)); return v; })(), V4b = ri(5,40);
const V5 = [pick([18,36,54,72,90,108,126,144]), (()=>{ let v; do{ v=ri(20,130); }while(exact(v/3.6)); return v; })(), ri(10,60), ri(10,60)];
const C5 = (()=>{ const o=[]; for(const [unit] of [["ms"],["kmh"],["ms"],["kmh"]]){ let d,m,v; do{ d=ri(3,25); m=Math.max(15,Math.round(d*60/(ri(80,160)/10))); v=unit==="ms"?d*1000/(m*60):d*60/m; }while(exact(v)); o.push({unit,d,m,v}); } return o; })();
const LU = (()=>{ const v=pick([8,9,10,12,15]); let m; do{ m=pick([12,18,20,24,30,36,40,45,48]); }while(!exact(v*m/60)); let d; do{ d=ri(10,45); }while(!Number.isInteger(d*60/v)); return {v,m,d,T:d*60/v}; })();
const dur = m => m>=60 ? `${Math.floor(m/60)} h ${m2(m%60)} min` : `${m} min`;

return [
 {t:"Conversions de durées", e:[
  {n:"Exercice sur les durées", t:"Convertir des durées", w:"Sur ton cahier", h:`<p>Écris tes calculs à côté de chaque conversion.</p>
   <p><b>1) Convertis en heures et minutes :</b> ${D1.map(([h,m],i)=>`<b>${L[i]})</b> ${dec(h,m)} h`).join(" · ")}</p>
   <p><b>2) Convertis en heures :</b> ${D2.map((m,i)=>`<b>${L[i]})</b> ${m} min`).join(" · ")}</p>
   <p><b>3) Convertis en heures :</b> ${D3.map(([h,m],i)=>`<b>${L[i]})</b> ${h} h ${m2(m)}`).join(" · ")}</p>
   <p><b>4) Convertis en heures et minutes :</b> ${D4.map((m,i)=>`<b>${L[i]})</b> ${N(m)} min`).join(" · ")}</p>
   <p><b>5) Convertis en heures, minutes et secondes :</b> ${D5.map((s,i)=>`<b>${L[i]})</b> ${N(s)} s`).join(" · ")}</p>`,
   c:`<p><b>1)</b> ${D1.map(([h,m],i)=>`<b>${L[i]})</b> ${N(m/60)} × 60 = ${m} : <b>${h} h ${m} min</b>`).join(" · ")}</p>
   <p><b>2)</b> ${D2.map((m,i)=>`<b>${L[i]})</b> ${m} ÷ 60 = <b>${N(m/60)} h</b>`).join(" · ")}</p>
   <p><b>3)</b> ${D3.map(([h,m],i)=>`<b>${L[i]})</b> ${m} ÷ 60 = ${N(m/60)} : <b>${dec(h,m)} h</b>`).join(" · ")}</p>
   <p><b>4)</b> ${D4.map((m,i)=>`<b>${L[i]})</b> ${N(m)} = ${Math.floor(m/60)} × 60 + ${m%60} : <b>${hm(m)}</b>`).join(" · ")}</p>
   ${D5.map((s,i)=>`<p><b>${i?"":"5) "}${L[i]})</b> ${N(s)} = ${Math.floor(s/3600)} × 3 600 + ${N(s%3600)} et ${N(s%3600)} = ${Math.floor(s%3600/60)} × 60 + ${s%60} : <b>${hms(s)}</b></p>`).join("")}`}
 ]},
 {t:"Prix au kilo et débits", e:[
  {n:"Activité 1", t:"Le prix des courgettes", w:"Sur ton cahier", h:`<p>J'ai acheté ${K.k} kilos de courgettes à ${E(K.p)} €.</p><p><b>a)</b> Quel est le prix d'un kilo de courgettes ?</p><p><b>b)</b> Comment appelle-t-on ce prix, affiché dans les supermarchés ?</p>`,
   c:`<p><b>a)</b> ${E(K.p)} ÷ ${K.k} = ${E(K.u)} : un kilo coûte <b>${E(K.u)} €</b>.</p><p><b>b)</b> C'est le <b>prix au kilo</b> (en €/kg) : une grandeur quotient.</p>`},
  {n:"Exercice 1", t:"Le débit d'une rivière", w:"Sur ton cahier", h:`<p>En ${RV.s} s, une rivière a fait couler ${N(RV.v)} ${M3} d'eau.</p><p><b>a)</b> La quantité d'eau qui coule en 1 s définit le débit. Quel est le débit de cette rivière ?</p><p><b>b)</b> Quelle est l'unité qui permet d'exprimer ce débit ?</p>`,
   c:`<p><b>a)</b> ${N(RV.v)} ÷ ${RV.s} = ${N(RV.d)} : le débit est de <b>${N(RV.d)} ${M3}</b> par seconde.</p><p><b>b)</b> On l'exprime en <b>${M3}/s</b>.</p>`},
  {n:"Exercice 2", t:"Le débit d'un aqueduc", w:"Sur ton cahier", h:`<p>Un aqueduc avait un débit de ${N(AQ*3600)} ${M3}/h. Exprime ce débit en ${M3}/s.</p>`,
   c:`<p class="calc"><i>D</i> = ${N(AQ*3600)} ${M3}/h<br><i>D</i> = ${F(N(AQ*3600)+" "+M3,"3 600 s")}<br><i>D</i> = ${N(AQ)} ${M3}/s</p><p>Le débit était de <b>${N(AQ)} ${M3}/s</b>.</p>`},
  {n:"Exercice 3", t:"Convertir des débits", w:"Sur ton cahier", h:`<p>Convertis :</p><p><b>a)</b> ${N(DB[0]*3600)} ${M3}/h en ${M3}/s.</p><p><b>b)</b> ${N(DB[1]*3600)} ${M3}/h en ${M3}/s, puis en L/s.</p><p><b>c)</b> ${N(DB[2])} ${M3}/h en L/min.</p>`,
   c:`<p><b>a)</b> ${F(N(DB[0]*3600)+" "+M3,"3 600 s")} = <b>${N(DB[0])} ${M3}/s</b></p><p><b>b)</b> (1 ${M3} = 1 000 L)</p><p class="calc"><i>D</i> = ${F(N(DB[1]*3600)+" "+M3,"3 600 s")}<br><i>D</i> = <b>${N(DB[1])} ${M3}/s</b><br><i>D</i> = <b>${N(DB[1]*1000)} L/s</b></p>
   <p><b>c)</b> ${N(DB[2])} ${M3} = ${N(DB[2]*1000)} L et 1 h = 60 min : ${F(N(DB[2]*1000)+" L","60 min")} = <b>${N(DB[2]*1000/60)} L/min</b></p>`}
 ]},
 {t:"Vitesses", e:[
  {n:"Exercice 4", t:"La vitesse d'une voiture", w:"Sur ton cahier", h:`<p><b>a)</b> Une voiture roule à ${V4a} km/h. Quelle est sa vitesse en m/s ? Arrondis au centième près.</p><p><b>b)</b> Une voiture roule à ${V4b} m/s. Quelle est sa vitesse en km/h ?</p>`,
   c:`<p><b>a)</b></p><p class="calc"><i>v</i> = ${V4a} km/h<br><i>v</i> = ${F(N(V4a*1000)+" m","3 600 s")}<br><i>v</i> ≈ <b>${N(V4a/3.6,2)} m/s</b></p><p><b>b)</b></p><p class="calc"><i>v</i> = ${V4b} m/s<br><i>v</i> = ${F(`${V4b} × 3 600 m`,"3 600 s")}<br><i>v</i> = ${F(N(V4b*3600)+" m","1 h")}<br><i>v</i> = <b>${N(V4b*3.6)} km/h</b></p>`},
  {n:"Exercice 5", t:"Convertir des vitesses", w:"Sur ton cahier", h:`<p>Convertis :</p><p><b>a)</b> ${V5[0]} km/h en m/s.</p><p><b>b)</b> ${V5[1]} km/h en m/s (arrondi au centième).</p><p><b>c)</b> ${V5[2]} m/s en km/h.</p><p><b>d)</b> ${V5[3]} m/s en km/h.</p>`,
   c:`<p><b>a)</b></p><p class="calc"><i>v</i> = ${V5[0]} km/h<br><i>v</i> = ${F(N(V5[0]*1000)+" m","3 600 s")}<br><i>v</i> = <b>${N(V5[0]/3.6)} m/s</b></p><p><b>b)</b></p><p class="calc"><i>v</i> = ${V5[1]} km/h<br><i>v</i> = ${F(N(V5[1]*1000)+" m","3 600 s")}<br><i>v</i> ≈ <b>${N(V5[1]/3.6,2)} m/s</b></p><p><b>c)</b> ${V5[2]} m/s : ${V5[2]} × 3 600 = ${N(V5[2]*3600)} m en 1 h, soit <b>${N(V5[2]*3.6)} km/h</b></p><p><b>d)</b> ${V5[3]} m/s : ${V5[3]} × 3 600 = ${N(V5[3]*3600)} m en 1 h, soit <b>${N(V5[3]*3.6)} km/h</b></p>`},
  {n:"Exercice 5 bis", t:"Course à pied", w:"Sur ton cahier", h:`<p>Arrondis chaque résultat au centième.</p>${C5.map((c,i)=>`<p><b>${L[i]})</b> Course de ${c.d} km en ${dur(c.m)}. Vitesse moyenne en ${c.unit==="ms"?"m/s":"km/h"} ?</p>`).join("")}`,
   c:C5.map((c,i)=>c.unit==="ms"
     ? `<p><b>${L[i]})</b> ${c.d} km = ${N(c.d*1000)} m et ${dur(c.m)} = ${N(c.m*60)} s :</p><p class="calc"><i>v</i> = ${F(N(c.d*1000)+" m",N(c.m*60)+" s")}<br><i>v</i> ≈ <b>${N(c.v,2)} m/s</b></p>`
     : `<p><b>${L[i]})</b>${c.m>=60?`</p><p class="calc"><i>t</i> = ${dur(c.m)}<br><i>t</i> = ${c.m} min<br><i>t</i> = ${F(c.m,60)} h</p>`:` ${c.m} min = ${F(c.m,60)} h :</p>`}<p class="calc"><i>v</i> = ${F(`${c.d} × 60`,c.m)}<br><i>v</i> ≈ <b>${N(c.v,2)} km/h</b></p>`).join("")},
  {n:"Exercice 6", t:"Course à pied", w:"Sur ton cahier", h:`<p>Ludivine court en moyenne à ${LU.v} km/h.</p><p><b>a)</b> Quelle distance parcourra-t-elle en ${LU.m} min ?</p><p><b>b)</b> Combien de temps mettra-t-elle, en heures et minutes, pour parcourir ${LU.d} km ?</p>`,
   c:`<p><b>a)</b> ${exact(LU.m/60)?`La durée :</p><p class="calc"><i>t</i> = ${LU.m} min<br><i>t</i> = ${LU.m} ÷ 60 h<br><i>t</i> = ${N(LU.m/60)} h</p><p>Distance : ${LU.v} × ${N(LU.m/60)} = <b>${N(LU.v*LU.m/60)} km</b>.`:`${LU.m} min = ${F(LU.m,60)} h. La distance <i>d</i> :</p><p class="calc"><i>d</i> = ${LU.v} × ${F(LU.m,60)}<br><i>d</i> = ${F(`${LU.v} × ${LU.m}`,60)}<br><i>d</i> = <b>${N(LU.v*LU.m/60)} km</b>`}</p><p><b>b)</b> ${exact(LU.d/LU.v)?`${LU.d} ÷ ${LU.v} = ${N(LU.d/LU.v)} h${Number.isInteger(LU.d/LU.v)?"":` et ${N(LU.d/LU.v-Math.floor(LU.d/LU.v))} × 60 = ${LU.T%60} min`}.`:`La durée :</p><p class="calc"><i>t</i> = ${LU.d} ÷ ${LU.v} h<br><i>t</i> = ${F(`${LU.d} × 60`,LU.v)} min<br><i>t</i> = ${LU.T} min</p><p>`} Elle mettra <b>${LU.T%60?hm(LU.T):Math.floor(LU.T/60)+" h"}</b>.</p>`}
 ]}
];
};
