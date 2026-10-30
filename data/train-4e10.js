/* 4e · chapitre 10 — fiche d'entraînement : les exercices de M. Staal (conversions, révisions, pyramide et cône),
   avec d'autres nombres. Les figures et les corrections sont calculées à partir des mêmes valeurs (outils window.VOL10). */
TRAIN["4e-10"] = function(){
const {ri, pick, shuf, distinct, items} = TR;
const {sol, pyrRect, tetraA, cone, tour, tronc, piscine, cuve, N, rd, fig} = window.VOL10;
const PI=Math.PI;
const half=(a,b)=>ri(a*2,b*2)/2, dec=(a,b)=>ri(a*10,b*10)/10;
const eq=x=>Math.abs(rd(x,2)-x)<1e-9?"=":"≈";

/* ---------- conversions ---------- */
const PW={"km³":9,"hm³":6,"dam³":3,"m³":0,"dm³":-3,"cm³":-6,"mm³":-9,"kL":0,"hL":-1,"daL":-2,"L":-3,"dL":-4,"cL":-5,"mL":-6};
const conv=(v,a,b)=>rd(v*10**(PW[a]-PW[b]),9);
const VALS=[45,3.1,500,0.0053,48.5,5.67,78,0.00024,86,63,7854,3000,12.5,0.73,25,4,0.6,250,1.8,0.045,920,36];
function convList(units,n){
  return distinct(n, ()=>{ for(let g=0;g<300;g++){ const [a,b]=shuf(units).slice(0,2), v=pick(VALS), r=conv(v,a,b); if(PW[a]===PW[b]||Math.abs(PW[a]-PW[b])>6||r>=1e7||r<0.001) continue; return [v,a,b,r]; } return [2,"m³","dm³",2000]; }, x=>x[0]+x[1]+x[2]);
}
const P1=convList(["m³","dm³","cm³","mm³","dam³"],6), P2=convList(["m³","dm³","cm³","L","dL","cL","mL","hL"],6);
const cl=(L,ans)=>ans ? `<p>${items(L.map(([v,a,b,r])=>`${N(v,6)} ${a} = <b>${N(r,6)}</b> ${b} (${PW[a]>PW[b]?"× ":"÷ "}${N(10**Math.abs(PW[a]-PW[b]))})`)," · ",true)}</p>` : L.map(([v,a,b],i)=>`<p>${TR.L[i]}) ${N(v,6)} ${a} = ………… ${b}</p>`).join("");

/* ---------- Activité 1 : poubelle ---------- */
const A1=(()=>{ const h=ri(40,70), d=pick([20,22,24,26,28,30,32,34]), r=d/2, V=PI*r*r*h, L=V/1000, near=Math.max(10,Math.round(L/5)*5);
  return {h,d,r,V,L,sz:[Math.max(5,near-20),near,near+20],near}; })();

/* ---------- Exercice 2 : intrus ---------- */
const E2=(()=>{ const v=pick([380,45,72,1.2,6,250]); const ok=shuf([[v*1000,"dm³"],[v*10000,"dL"],[v/1000,"dam³"],[v,"m³"],[v*1000,"L"],[v*1e6,"cm³"],[v*10,"hL"]]).slice(0,5);
  const bad=pick([[v*1e5,"cm³"],[v*100,"L"],[v*100,"dm³"],[v/100,"dam³"],[v*1000,"dL"]]); return {v, list:shuf([...ok,bad]), bad}; })();
const toM3=([x,u])=>rd(x*10**PW[u],9);

/* ---------- Exercice 3 : grandeurs égales ---------- */
const E3=(()=>{ const v=pick([72,45,18,36,250]); /* en dm³ */
  const good=shuf([[v,"L"],[v/1000,"m³"],[v*10,"dL"],[v*1000,"mL"],[v*1000,"cm³"],[v*100,"cL"]]).slice(0,4);
  const bad=shuf([[v/100,"m³"],[v,"dL"],[v*10,"cL"],[v,"cm³"],[v*100,"mL"],[v/10,"L"]]).slice(0,3);
  return {v, list:shuf([...good.map(x=>[...x,1]),...bad.map(x=>[...x,0])])}; })();
const toL=([x,u])=>rd(x*10**(PW[u]+3),9);

/* ---------- Exercice 4 : casserole ---------- */
const E4=(()=>{ const d=pick([14,16,18,20,22,24]), h=ri(6,12), r=d/2, V=PI*r*r*h, L=V/1000, ok=Math.random()<0.5;
  const near=Math.max(0.5,Math.round(L*2)/2), claim = ok ? near : near+pick([1.5,2,2.5]);
  return {d,h,r,V,L,claim,ok}; })();

/* ---------- Révisions ---------- */
const E5={L:dec(8,14), l:dec(4,8), h:ri(2,6)};
const E6={b:pick([1.2,1.4,1.5,1.6,1.8,2]), t:pick([0.8,0.9,1,1.2,1.4]), L:pick([2,2.1,2.2,2.4,2.5,3])};
const prism=(b,t,L)=>sol({V:{A:[0,0,0],B:[b,0,0],C:[b/2,0,t],D:[0,L,0],E:[b,L,0],F:[b/2,L,t]}, k:Math.min(70,190/(b+L*0.5)), F:[["A","B","C"]],
  E:[["A","B"],["B","C"],["C","A"],["D","E",1],["E","F"],["F","D"],["A","D",1],["B","E"],["C","F"]], hgt:[["C",[b/2,0,0]]], right:[[[b/2,0,0],"B","C"]],
  txt:[[[b/2,0,0],N(b)+" m",0,24],[[b/2,0,t/2],N(t)+" m",-30,0],[[b,L/2,0],N(L)+" m",32,14]], alt:"Tente en forme de prisme droit à base triangulaire"});
const E7={d:pick([4,5,6,7,8,9,10]), h:ri(15,35)};
const E8=(()=>{ const L=ri(8,14), l=ri(4,7), a=pick([1,1.5,2,2.5]), b=pick([1,1.5,2].filter(x=>2*x<l)), p=pick([1.2,1.4,1.5,1.6,1.8,2]); return {L,l,a,b,p,A:L*l-a*b,V:(L*l-a*b)*p}; })();

/* ---------- Pyramide et cône ---------- */
const E9=(()=>{ for(let g=0;g<500;g++){ const d=pick([10,11,12,13,14]), c=pick([9,10,11,12]), h=ri(11,16), vc=PI*d*d/4*h/3, vp=c*c*h/3; if(Math.abs(vc-vp)/vp<0.03) continue; return {d,c,h,vc,vp}; } return {d:12,c:11,h:13,vc:156*PI,vp:1573/3}; })();
const E10={a:half(2,5), c:dec(3,7), h:ri(6,12)};
const E11=(()=>{ const a=pick([4,5,6]), h=pick([3,4,5,6]), V=a*a*h/3; return {a,h,V,n:Math.floor(1000/V+1e-9)}; })();
const E12={r:pick([2,2.5,3,3.5,4]), h1:ri(8,16), h2:ri(3,6)};
const E13=(()=>{ const [H,e,f]=pick([[12,4,2/3],[10,5,1/2],[9,3,2/3],[12,6,1/2]]), R=pick([3,3.6,4.5,3.75,4.2]), r=rd(R*f,3), n=pick([6,9,12]), P=pick([0.5,0.8,1,1.2,1.5]);
  const v1=PI*R*R*H/3, v2=PI*r*r*(H-e)/3; return {H,e,R,r,n,P,v1,v2,v:v1-v2,tot:n*(v1-v2)}; })();
const E14=(()=>{ for(let g=0;g<500;g++){ const l=pick([2.2,2.3,2.4,2.5]), L=pick([6,6.5,7,7.5,8]), h=pick([1.8,2,2.1,2.2]), n=ri(8,16), r=pick([3,3.5,4,4.5]), hc=ri(6,10), hk=pick([2,2.5,3]);
  const vb=l*L*h*n, vs=PI*r*r*hc+PI*r*r*hk/3; if(Math.abs(vb-vs)/vs<0.01) continue; return {l,L,h,n,r,hc,hk,vb,vs}; } return {l:2.2,L:7.5,h:2.1,n:13,r:4,hc:8,hk:2.5,vb:450.45,vs:128*PI+40*PI/3}; })();
const E15=(()=>{ let B,h; do{ B=pick([84,96,100,120,150,210,250,300,450,894]); h=ri(8,40); }while((B*h)%3); const B2=ri(10,60), h2=pick([3,6,9,12,15]);
  return {B,h,V:B*h/3,B2,h2,V2:B2*h2/3}; })();

/* ---------- Pour les plus rapides ---------- */
const E16=pick([4,6,8,10,12]);
const rdx=x=>Math.round(x*1e6)/1e6;   /* « = » si la valeur affichée (3 décimales) est exacte, sinon « ≈ » */
const E17=(()=>{ const c=pick([2,2.5,3]), h=pick([1.5,3]), e=rd(ri(2,Math.round(c*10)-2)/10,1), vc=c**3, vp=c*c*h/3, W=rd((vc+vp-c*c*e)*1000,3); return {c,h,e,vc,vp,W}; })();

return [
 {t:"Rappels : unités de volume et conversions", e:[
  {n:"Activité 1", t:"Différentes tailles de sac poubelle", w:"Sur ton cahier", h:`<p>Mathilde vient d'acheter une poubelle de forme cylindrique.</p><p>Sa hauteur est ${A1.h} cm et son diamètre est ${A1.d} cm.</p><p>Doit-elle choisir des sacs de ${A1.sz.map(x=>x+" L").join(", ").replace(/, ([^,]*)$/," ou $1")} ?</p>`,
   c:`<p>Rayon : ${A1.d} ÷ 2 = ${A1.r} cm.</p><p class="calc">V = π × ${A1.r}² × ${A1.h}<br>V ≈ ${N(A1.V,0)} cm³<br>V ≈ ${N(A1.L,1)} L</p><p>Elle doit choisir des <b>sacs de ${A1.near} L</b> (la capacité la plus proche).</p>`},
  {n:"Exercice 1", t:"Conversions", w:"Sur ton cahier", h:`<p><b>Partie 1</b></p>${cl(P1,false)}<p><b>Partie 2</b></p>${cl(P2,false)}`,
   c:`<p><b>Partie 1</b></p>${cl(P1,true)}<p><b>Partie 2</b></p>${cl(P2,true)}`},
  {n:"Exercice 2", t:"Un intrus", w:"Sur ton cahier", h:`<p>Parmi la liste de volumes suivante, il y a un intrus ! Retrouve-le.</p><p class="calc">${E2.list.map(([x,u])=>N(x,6)+" "+u).join(" &nbsp;·&nbsp; ")}</p>`,
   c:`<p>On convertit tout en m³ :</p><p>${E2.list.map(x=>`${N(x[0],6)} ${x[1]} = ${N(toM3(x),6)} m³`).join(" · ")}</p><p>L'intrus est <b>${N(E2.bad[0],6)} ${E2.bad[1]}</b> (les autres valent ${N(E2.v)} m³).</p>`},
  {n:"Exercice 3", t:"Grandeurs égales", w:"Sur ton cahier", h:`<p>Parmi ces grandeurs, lesquelles sont égales à <b>${N(E3.v)} dm³</b> ?</p><p class="calc">${E3.list.map(([x,u])=>N(x,6)+" "+u).join(" &nbsp;·&nbsp; ")}</p>`,
   c:`<p>${N(E3.v)} dm³ = ${N(E3.v)} L. On convertit tout en litres :</p><p>${E3.list.map(x=>`${N(x[0],6)} ${x[1]} = ${N(toL(x),6)} L ${x[2]?"✔":"✘"}`).join(" · ")}</p><p>Grandeurs égales : <b>${E3.list.filter(x=>x[2]).map(([x,u])=>N(x,6)+" "+u).join(" ; ")}</b>.</p>`},
  {n:"Exercice 4", t:"Capacité d'une casserole", w:"Sur ton cahier", h:`<p>Une casserole cylindrique porte l'étiquette : « Diamètre : ${E4.d} cm · Hauteur : ${E4.h} cm · Contenance : ${N(E4.claim)} L ».</p><p>Ces indications sont-elles cohérentes ?</p>`,
   c:`<p>Rayon : ${E4.d} ÷ 2 = ${E4.r} cm.</p><p class="calc">V = π × ${E4.r}² × ${E4.h}<br>V ≈ ${N(E4.V,1)} cm³<br>V ≈ ${N(E4.L,2)} L</p><p>${E4.ok?`La casserole contient environ ${N(E4.L,2)} L, ce qui est proche de ${N(E4.claim)} L : les indications sont <b>cohérentes</b>.`:`${N(E4.L,2)} L est très différent de ${N(E4.claim)} L : les indications <b>ne sont pas cohérentes</b>.`}</p>`}
 ]},
 {t:"Révisions : pavé droit, prisme droit et cylindre", e:[
  {n:"Exercice 5", t:"Une plaquette de beurre", w:"Sur ton cahier", h:`<p>Une plaquette de beurre a pour longueur ${N(E5.L)} cm, pour largeur ${N(E5.l)} cm et pour hauteur ${E5.h} cm.</p><p>Quel est son volume en cm³ ?</p>`,
   c:`<p class="calc">V = ${N(E5.L)} × ${N(E5.l)} × ${E5.h}<br>V = <b>${N(E5.L*E5.l*E5.h)} cm³</b></p>`},
  {n:"Exercice 6", t:"Une tente", w:"Sur ton cahier", h:`${prism(E6.b,E6.t,E6.L)}<p>Cette tente a la forme d'un prisme droit. Sa base est un triangle de base ${N(E6.b)} m et de hauteur ${N(E6.t)} m. Sa longueur est ${N(E6.L)} m.</p><p>Calcule son volume.</p>`,
   c:`<p class="calc">B = ${N(E6.b)} × ${N(E6.t)} ÷ 2<br>B = ${N(E6.b*E6.t/2)} m²</p><p class="calc">V = ${N(E6.b*E6.t/2)} × ${N(E6.L)}<br>V = <b>${N(E6.b*E6.t/2*E6.L,4)} m³</b></p>`},
  {n:"Exercice 7", t:"Un château d'eau", w:"Sur ton cahier", h:`<p>Un château d'eau est assimilé à un cylindre de diamètre ${E7.d} m et de hauteur ${E7.h} m.</p><p>Combien de litres d'eau peut-il contenir ? Arrondis au centième près.</p>`,
   c:`<p>Rayon : ${E7.d} ÷ 2 = ${N(E7.d/2)} m.</p><p class="calc">V = π × ${N(E7.d/2)}² × ${E7.h}<br>V ≈ ${N(PI*E7.d*E7.d/4*E7.h,5)} m³</p><p>1 m³ = 1 000 L : il peut contenir environ <b>${N(PI*E7.d*E7.d/4*E7.h*1000,2)} L</b>.</p>`},
  {n:"Exercice 8", t:"La piscine", w:"Sur ton cahier", h:`${piscine(E8.L,E8.l,E8.a,E8.b)}<p>La piscine vue de haut est la partie colorée. Elle a la même profondeur partout.</p><p><b>Données :</b> ACFH est un rectangle ; AC = ${E8.L} m ; AH = ${E8.l} m ; BC = GF = ${N(E8.a)} m ; CD = EF = ${N(E8.b)} m.</p><p>Combien de litres d'eau faut-il pour une hauteur d'eau de ${N(E8.p)} m ?</p>`,
   c:`<p class="calc">Aire de ACFH : ${E8.L} × ${E8.l} = ${E8.L*E8.l} m²<br>Aire d'un triangle : ${N(E8.a)} × ${N(E8.b)} ÷ 2 = ${N(E8.a*E8.b/2)} m²<br>Aire de la base : ${E8.L*E8.l} − 2 × ${N(E8.a*E8.b/2)} = ${N(E8.A)} m²</p><p class="calc">V = ${N(E8.A)} × ${N(E8.p)}<br>V = ${N(E8.V)} m³</p><p>Il faut <b>${N(E8.V*1000)} L</b> d'eau.</p>`}
 ]},
 {t:"Volumes de la pyramide et du cône", e:[
  {n:"Exercice 9", t:"Baraque à frites", w:"Sur ton cahier", h:`<div class="figs">${fig("Chez Michel",cone(E9.d/2,E9.h,"Ø "+E9.d+" cm",E9.h+" cm",{w:190}))}${fig("Chez Léon",pyrRect(E9.c,E9.c,E9.h,{la:E9.c+" cm",lh:E9.h+" cm",k:13}))}</div>
   <p>Chez Michel, le cornet de frites est un cône de diamètre ${E9.d} cm et de hauteur ${E9.h} cm.</p><p>Chez Léon, c'est une pyramide à base carrée de côté ${E9.c} cm et de hauteur ${E9.h} cm.</p><p>Quel est le cornet de plus grand volume ?</p>`,
   c:`<p><b>Michel</b> : rayon ${N(E9.d/2)} cm.</p><p class="calc">V = {π × ${N(E9.d/2)}² × ${E9.h}/3}<br>V ≈ ${N(E9.vc,1)} cm³</p><p><b>Léon</b> :</p><p class="calc">V = {${E9.c} × ${E9.c} × ${E9.h}/3}<br>V ${Math.abs(E9.vp*10-Math.round(E9.vp*10))<1e-9?"=":"≈"} ${N(E9.vp,1)} cm³</p><p>Le cornet de <b>${E9.vc>E9.vp?"Michel":"Léon"}</b> a le plus grand volume.</p>`},
  {n:"Exercice 10", t:"Tétraèdre", w:"Sur ton cahier", h:`${tetraA(E10.a,E10.c,E10.h,{w:240})}<p>SABC est un tétraèdre : ABC est rectangle en A et [SA] est perpendiculaire à la base.</p><p><b>Données :</b> AB = ${N(E10.a)} cm ; AC = ${N(E10.c)} cm ; SA = ${E10.h} cm.</p><p>Quel est le volume du tétraèdre en cm³ ?</p>`,
   c:`<p class="calc">B = {${N(E10.a)} × ${N(E10.c)}/2}<br>B = ${N(E10.a*E10.c/2)} cm²</p><p class="calc">V = {${N(E10.a*E10.c/2)} × ${E10.h}/3}<br>V ${eq(E10.a*E10.c/2*E10.h/3)} <b>${N(E10.a*E10.c/2*E10.h/3,2)} cm³</b></p>`},
  {n:"Exercice 11", t:"Un berlingot de lait concentré", w:"Sur ton cahier", h:`<p>Un berlingot a la forme d'une pyramide régulière à base carrée de ${E11.a} cm de côté et de hauteur ${E11.h} cm.</p><p>Combien de berlingots pleins peut-on préparer avec 1 L de lait concentré ?</p>`,
   c:`<p class="calc">V = {${E11.a} × ${E11.a} × ${E11.h}/3}<br>V ${eq(E11.V)} ${N(E11.V,2)} cm³</p><p>1 L = 1 000 cm³ et 1 000 ÷ ${N(E11.V,2)} ${eq(1000/E11.V)} ${N(1000/E11.V,2)}.</p><p>On peut préparer <b>${E11.n} berlingots</b>.</p>`},
  {n:"Exercice 12", t:"Une tour", w:"Sur ton cahier", h:`${tour(E12.r,E12.h1,E12.h2,N(E12.r)+" m",E12.h1+" m",E12.h2+" m",{w:200})}<p>Cette tour cylindrique de rayon ${N(E12.r)} m et de hauteur ${E12.h1} m est surmontée d'un toit conique de hauteur ${E12.h2} m.</p><p>Donne le volume de cette tour en m³, arrondi au centième.</p>`,
   c:`<p class="calc">Cylindre : π × ${N(E12.r)}² × ${E12.h1} ≈ ${N(PI*E12.r**2*E12.h1,2)} m³<br>Cône : {π × ${N(E12.r)}² × ${E12.h2}/3} ≈ ${N(PI*E12.r**2*E12.h2/3,2)} m³</p><p>Volume de la tour : environ <b>${N(PI*E12.r**2*E12.h1+PI*E12.r**2*E12.h2/3,2)} m³</b>.</p>`},
  {n:"Exercice 13", t:"Des muffins", w:"Sur ton cahier", h:`${tronc(E13.R,E13.H,E13.r,E13.e,"Ø "+N(2*E13.R)+" cm",N(E13.r)+" cm",E13.e+" cm",E13.H+" cm")}<p>Un moule à muffins a ${E13.n} cavités identiques en forme de tronc de cône : un cône de rayon ${N(E13.R)} cm et de hauteur ${E13.H} cm, coupé par un plan parallèle à sa base.</p><p>Le fond de la cavité est un disque de rayon ${N(E13.r)} cm et la cavité a une profondeur de ${E13.e} cm.</p><p>Avec ${N(E13.P)} L de pâte, peut-on remplir entièrement les ${E13.n} cavités ?</p>`,
   c:`<p class="calc">Grand cône : {π × ${N(E13.R)}² × ${E13.H}/3} ≈ ${N(E13.v1,2)} cm³<br>Petit cône (hauteur ${E13.H} − ${E13.e} = ${E13.H-E13.e} cm) : {π × ${N(E13.r)}² × ${E13.H-E13.e}/3} ≈ ${N(E13.v2,2)} cm³<br>Une cavité : ≈ ${N(E13.v,2)} cm³</p><p>Pour les ${E13.n} cavités :</p><p class="calc">V ≈ ${N(E13.tot,0)} cm³<br>V ≈ ${N(E13.tot/1000,2)} L</p>
   <p>${E13.tot/1000<=E13.P?`${N(E13.tot/1000,2)} L ≤ ${N(E13.P)} L : <b>oui</b>, il y a assez de pâte.`:`${N(E13.tot/1000,2)} L &gt; ${N(E13.P)} L : <b>non</b>, il n'y a pas assez de pâte.`}</p>`},
  {n:"Exercice 14", t:"Récolte de blé", w:"Sur ton cahier", h:`<p>Un agriculteur a rempli entièrement sa remorque ${E14.n} fois. La remorque est un pavé droit : l = ${N(E14.l)} m ; L = ${N(E14.L)} m ; h = ${N(E14.h)} m.</p><p>Son silo est formé d'un cylindre de ${N(E14.r)} m de rayon et de ${E14.hc} m de hauteur, et d'un cône de même rayon et de ${N(E14.hk)} m de hauteur.</p><p>Aura-t-il suffisamment de place dans son silo pour stocker son grain ?</p>`,
   c:`<p class="calc">Une remorque : ${N(E14.l)} × ${N(E14.L)} × ${N(E14.h)} = ${N(E14.l*E14.L*E14.h)} m³<br>Le blé : ${E14.n} × ${N(E14.l*E14.L*E14.h)} = ${N(E14.vb)} m³</p>
   <p class="calc">Cylindre : π × ${N(E14.r)}² × ${E14.hc} ≈ ${N(PI*E14.r**2*E14.hc,2)} m³<br>Cône : {π × ${N(E14.r)}² × ${N(E14.hk)}/3} ≈ ${N(PI*E14.r**2*E14.hk/3,2)} m³<br>Silo : ≈ ${N(E14.vs,2)} m³</p>
   <p>${E14.vb<=E14.vs?`${N(E14.vb)} m³ &lt; ${N(E14.vs,2)} m³ : <b>oui</b>, il a assez de place.`:`${N(E14.vb)} m³ &gt; ${N(E14.vs,2)} m³ : <b>non</b>, il n'a pas assez de place.`}</p>`},
  {n:"Exercice 15", t:"Quand on connaît le volume !", w:"Sur ton cahier", h:`<p><b>1)</b> Une sculpture en forme de pyramide a un volume de ${N(E15.V)} cm³. Sa base a une aire de ${E15.B} cm². Quelle est la hauteur de la sculpture ?</p><p><b>2)</b> Un cône de révolution a un volume de ${N(E15.V2)} cm³ et sa hauteur mesure ${E15.h2} cm. Quelle est l'aire de sa base ?</p>`,
   c:`<p><b>1)</b></p><p class="calc">h = {3 × V/B}<br>h = {3 × ${N(E15.V)}/${E15.B}}<br>h = {${N(3*E15.V)}/${E15.B}}<br>h = <b>${E15.V*3/E15.B} cm</b></p><p><b>2)</b></p><p class="calc">B = {3 × V/h}<br>B = {3 × ${N(E15.V2)}/${E15.h2}}<br>B = {${N(3*E15.V2)}/${E15.h2}}<br>B = <b>${E15.B2} cm²</b></p>`}
 ]},
 {t:"Pour les plus rapides", e:[
  {n:"Exercice 16", t:"Cuboctaèdre", w:"Sur ton cahier", h:`<p>On obtient un cuboctaèdre en retirant d'un cube d'arête ${E16} cm huit pyramides identiques, une à chaque coin.</p><p>Chaque pyramide a pour sommets un coin du cube et les milieux des trois arêtes issues de ce coin.</p><p>Calcule le volume du cuboctaèdre.</p>`,
   c:`<p class="calc">Une pyramide : base ${E16/2} × ${E16/2} ÷ 2 = ${N(E16*E16/8)} cm², hauteur ${E16/2} cm</p><p class="calc">V = {${N(E16*E16/8)} × ${E16/2}/3}<br>V ${Number.isInteger(rdx(E16**3/48*1000))?"=":"≈"} ${N(E16**3/48)} cm³</p><p class="calc">8 pyramides : ${N(E16**3/6)} cm³</p><p class="calc">Cube : ${N(E16**3)} cm³<br>Cuboctaèdre : ${N(E16**3)} − ${N(E16**3/6)} ${Number.isInteger(rdx(E16**3*5/6*1000))?"=":"≈"} <b>${N(E16**3*5/6)} cm³</b></p>`},
  {n:"Exercice 17", t:"Une cuve", w:"Sur ton cahier", h:`${cuve(E17.c,E17.h,N(E17.c)+" m",N(E17.h)+" m")}<p>Une cuve est formée d'un cube de ${N(E17.c)} m d'arête posé sur une pyramide régulière à base carrée de ${N(E17.h)} m de hauteur.</p><p>La cuve contient ${N(E17.W)} L d'eau.</p><p>À quelle distance du bord supérieur se trouve le niveau d'eau ?</p>`,
   c:`<p>Pyramide :</p><p class="calc">V₁ = {${N(E17.c)} × ${N(E17.c)} × ${N(E17.h)}/3}<br>V₁ = ${N(E17.vp)} m³<br>V₁ = ${N(E17.vp*1000)} L</p><p>Cube :</p><p class="calc">V₂ = ${N(E17.c)}³<br>V₂ = ${N(E17.vc)} m³<br>V₂ = ${N(E17.vc*1000)} L</p>
   <p>Vide dans le cube, un volume V :</p><p class="calc">V = ${N(E17.vc*1000)} + ${N(E17.vp*1000)} − ${N(E17.W)}<br>V = ${N(E17.c*E17.c*E17.e*1000)} L<br>V = ${N(E17.c*E17.c*E17.e)} m³</p><p>La hauteur vide h :</p><p class="calc">h = ${N(E17.c*E17.c*E17.e)} ÷ ${N(E17.c*E17.c)}<br>h = ${N(E17.e)} m</p><p>Le niveau d'eau est à <b>${N(E17.e)} m</b> du bord supérieur.</p>`}
 ]}
];
};
