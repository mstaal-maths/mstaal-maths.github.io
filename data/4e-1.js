/* 4e — Chapitre 1 : Nombres relatifs : addition, soustraction et multiplication
   Cours, feuille d'exercices, activités (cartes, cerceaux, tableau de multiplication) et problèmes ouverts de M. Staal.
   Droites graduées, pyramides, cercles et étiquettes sont dessinés en SVG / HTML à partir des valeurs :
   ce qui est dessiné est exactement ce qui est écrit dans la correction. */
(function(){
const VF=["Vrai","Faux"];
const ri=(a,b)=>a+Math.floor(Math.random()*(b-a+1)), pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{ a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
const uniq=(good,bads)=>{ const s=[good]; bads.forEach(b=>{ if(!s.includes(b)) s.push(b); }); return s; };
const sch=(t,body)=>`<div class="sch"><b class="schT">${t}</b>${body}</div>`;
const r3=x=>Math.round(x*1000)/1000;
/* écriture française : −2,5 · 0 · 1 200 */
const F=x=>{ const r=r3(x); const [i,d]=String(Math.abs(r)).split("."); return (r<0?"−":"")+i.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(d?","+d:""); };
const S=x=>(r3(x)>0?"+":"")+F(x);            /* avec le signe + */
const P=x=>r3(x)===0?"0":`(${S(x)})`;         /* entre parenthèses : (+3) · (−5) */
const Q=x=>r3(x)<0?`(${F(x)})`:F(x);          /* parenthèses seulement si négatif : 6 × (−4) */
const cols=arr=>`<div class="calcs">${arr.map(x=>`<span${x.replace(/<[^>]+>/g,"").length>30?' style="white-space:normal"':""}>${x}</span>`).join("")}</div>`;
const RED="#d0342c", BLUE="#1e7fc4";
const co=(p,alt,w)=>img("4k1co/"+p,alt,w), ex=(p,alt,w)=>img("4k1ex/"+p,alt,w);
/* calculs en chaîne (règle de M. Staal) : l'expression est nommée et chaque étape est sur une nouvelle ligne « A = … » */
const chn=(N,st)=>`<p class="calc">${st.map(s=>`${N} = ${s}`).join("<br>")}</p>`;
const chns=L=>`<div class="calcs">${L.map(([N,st])=>chn(N,st)).join("")}</div>`;
/* QCM : une explication qui enchaîne plusieurs calculs (… = … = …) est réécrite ligne par ligne
   « A = … » (règle des calculs en chaîne) ; l'expression est aussi nommée dans la question. */
const qChain=(()=>{
  const U="(?:<i>[a-z]<\\/i>|<sup>[^<]*<\\/sup>|\\{[^{}]*\\}|[\\d,+−×÷()\\[\\]xy²³√ -])";
  const S="(?:<i>[a-z]<\\/i>|<sup>[^<]*<\\/sup>|\\{[^{}]*\\}|[\\d)\\]xy²³])";   /* fin d'expression (jamais une espace) */
  const E=`(?:<i>[a-z]<\\/i>|<sup>[^<]*<\\/sup>|\\{[^{}]*\\}|[\\d(\\[−x√-])(?:${U}*${S})?`;
  const RE=new RegExp(`(?<![A-Za-zéèàù\\d])${E}(?: = ${E}){2,}`,"g");
  const bal=s=>{ let d=0; for(const c of s.replace(/<[^>]+>/g,"")){ if(c==="("||c==="[") d++; if(c===")"||c==="]") d--; if(d<0) return false; } return d===0; };
  const trim=s=>s.replace(/[\s,]+$/,"").replace(/\s*\($/,"");
  return o=>{
    if(!o || typeof o.ex!=="string" || (o.ex.match(/ = /g)||[]).length<2) return o;
    let q=String(o.q||""), k=0, changed=false;
    const ex=o.ex.replace(RE,(m,off,all)=>{
      const raw=m.split(" = "), items=raw.map(trim); let rest=raw[raw.length-1].slice(items[items.length-1].length);
      { const L=items.length-1, k=items[L].lastIndexOf(" ("); if(!bal(items[L]) && k>0){ rest=items[L].slice(k)+rest; items[L]=items[L].slice(0,k); } }
      if(items.some(x=>!bal(x)||!/[\dxy]|<i>/.test(x))) return m;
      let N="ABCDEFGH"[k++]; const e0=items[0];
      const mq=q.match(new RegExp("\\b([A-Z]) = "+e0.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")));
      if(mq) N=mq[1]; else if(q.split(e0).length===2) q=q.replace(e0, N+" = "+e0);
      else if(k===1){ const mv=q.match(/^((?:Développe et réduis|Développe|Réduis|Factorise|Calcule(?: en simplifiant d'abord)?|Simplifie)(?: :)? )(.+?)(\.?|\s*\(.*\))$/);
        if(mv && !/ = /.test(mv[2])){ q=mv[1]+N+" = "+mv[2]+mv[3]; items.unshift(mv[2]); } }
      changed=true;
      return "<br>"+items.map(e=>N+" = "+e).join("<br>")+(/^ \(/.test(rest)?rest:"<br>"+rest);
    });
    if(!changed) return o;
    let s=ex.replace(/<br>\s*\.?\s*$/,"").replace(/<br>[\s.,;:]*(?=\S)/g,"<br>").replace(/\s*:?\s*<br>/,m=>/:/.test(m)?" :<br>":"<br>");
    s=s.replace(/<br>([a-zéèà])/g,(m,c)=>"<br>"+c.toUpperCase());
    return Object.assign({}, o, {q, ex:s});
  };
})();
/* outils partagés par les chapitres de 4e (chargés après celui-ci) */
window.CHN4={chn,chns,qChain};

/* ------------------------------------------------------------------
   Droite graduée « flammes / gouttes » : graduations entières de min à max
   arcs [[départ, arrivée, texte, couleur, dessous?]] · dots [[valeur, couleur]]
------------------------------------------------------------------ */
function dl(o){
  const {min=-7,max=8,w=560}=o, x0=30, x1=w-40, u=(x1-x0)/(max-min), X=v=>x0+(v-min)*u;
  const up=(o.arcs||[]).some(a=>!a[4]), dn=(o.arcs||[]).some(a=>a[4]), Y=up?78:30, H=Y+(dn?110:44);
  let s=`<svg class="fig" viewBox="0 0 ${w} ${H}" width="${w}" role="img" aria-label="${o.alt||"Droite graduée"}">`;
  s+=`<line x1="${x0-20}" y1="${Y}" x2="${w-12}" y2="${Y}" class="ln"/><path d="M${w-22} ${Y-7} L${w-10} ${Y} L${w-22} ${Y+7}" class="ln"/>`;
  for(let v=min; v<=max; v++){ const x=X(v).toFixed(1);
    s+=`<line x1="${x}" y1="${Y-8}" x2="${x}" y2="${Y+8}" class="ln" style="stroke-width:${v?1.5:2.4}"/>`;
    s+=`<text x="${x}" y="${Y+(dn?26:27)}" class="lab" style="font-size:13px${v?"":";font-weight:700"}">${v>0?"+"+v:F(v)}</text>`; }
  (o.arcs||[]).forEach(([a,b,t,col,down])=>{ const xa=X(a), xb=X(b), cx=(xa+xb)/2, h=Math.min(60, Math.abs(xb-xa)*0.4+14), sg=down?1:-1, yb=Y+sg*(down?36:6), ya=yb, cy=yb+sg*h*1.6;
    s+=`<path d="M${xa.toFixed(1)} ${ya} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${xb.toFixed(1)} ${yb}" style="fill:none;stroke:${col};stroke-width:2.4"/>`;
    const dx=xb-cx, dy=yb-cy, d=Math.hypot(dx,dy), ux=dx/d, uy=dy/d;
    s+=`<path d="M${(xb-ux*11-uy*6).toFixed(1)} ${(yb-uy*11+ux*6).toFixed(1)} L${xb.toFixed(1)} ${yb} L${(xb-ux*11+uy*6).toFixed(1)} ${(yb-uy*11-ux*6).toFixed(1)}" style="fill:none;stroke:${col};stroke-width:2.4"/>`;
    s+=`<text x="${cx.toFixed(1)}" y="${(yb+sg*(h*0.8+(down?16:8))).toFixed(1)}" text-anchor="middle" style="font-size:15px;fill:${col};font-weight:700">${t}</text>`; });
  (o.dots||[]).forEach(([v,col])=>{ s+=`<circle cx="${X(v).toFixed(1)}" cy="${Y}" r="6" style="fill:${col}"/>`; });
  return s+"</svg>";
}

/* ------------------------------------------------------------------
   Pyramide : rows = étages du bas vers le haut (valeurs exactes)
   known(k,i) → la brique est donnée dans l'énoncé · show : écrit toutes les valeurs (correction)
------------------------------------------------------------------ */
function pyr(rows, known=(k)=>k===0, show=false, cw=72){
  const n=rows[0].length, ch=42, W=n*cw+4, H=n*ch+4;
  let s=`<svg class="fig" viewBox="0 0 ${W} ${H}" width="${Math.min(W,520)}" role="img" aria-label="Pyramide de nombres">`;
  rows.forEach((row,k)=>row.forEach((v,i)=>{ const x=2+k*cw/2+i*cw, y=2+(n-1-k)*ch, kn=known(k,i);
    s+=`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" style="fill:${kn?"var(--paper)":"color-mix(in srgb,var(--c) 7%,var(--paper))"};stroke:var(--ink);stroke-width:1.6"/>`;
    const t = kn ? F(v) : show ? F(v) : "…";
    s+=`<text x="${x+cw/2}" y="${y+ch/2+6}" text-anchor="middle" style="font-size:17px;fill:${kn?"var(--ink)":show?"var(--c)":"var(--muted)"};font-weight:${kn?600:700}">${t}</text>`; }));
  return s+"</svg>";
}
/* étages calculés à partir de la base : op = somme ou produit */
const build=(base,op)=>{ const R=[base]; while(R[R.length-1].length>1){ const l=R[R.length-1]; R.push(l.slice(1).map((v,i)=>r3(op(l[i],v)))); } return R; };
const ADD=(a,b)=>a+b, MUL=(a,b)=>a*b;

/* ------------------------------------------------------------------
   Exercice des cercles : rouge − bleu diamétralement opposé = centre
   vals : 8 cercles dans l'ordre haut, haut-droite, droite, bas-droite (rouges) puis bas, bas-gauche, gauche, haut-gauche (bleus)
   known[i] : nombre écrit dans l'énoncé
------------------------------------------------------------------ */
function cercles(c, vals, known, show=false){
  const cx=150, cy=135, R=96, r=27;
  let s=`<svg class="fig" viewBox="0 0 300 270" width="300" role="img" aria-label="Cercles rouges et bleus autour du nombre ${F(c)}">`;
  const pos=i=>{ const a=(-90+45*i)*Math.PI/180; return [cx+R*Math.cos(a), cy+R*Math.sin(a)]; };
  vals.forEach((v,i)=>{ const [x,y]=pos(i); s+=`<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="thin"/>`; });
  s+=`<rect x="${cx-26}" y="${cy-20}" width="52" height="40" style="fill:#b9dfa6;stroke:#3d7a2a;stroke-width:2"/><text x="${cx}" y="${cy+7}" text-anchor="middle" style="font-size:19px;font-weight:700;fill:#1a1a1a">${F(c)}</text>`;
  vals.forEach((v,i)=>{ const [x,y]=pos(i), red=i<4, k=known[i];
    s+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r}" style="fill:${red?"#f4a08f":"#9fcdf2"};stroke:${red?"#b23a2a":"#2a6fa8"};stroke-width:2"/>`;
    if(k||show) s+=`<text x="${x.toFixed(1)}" y="${(y+6).toFixed(1)}" text-anchor="middle" style="font-size:17px;font-weight:700;fill:${k?"#1a1a1a":"#0b4f8a"}${k?"":";text-decoration:underline"}">${F(v)}</text>`; });
  return s+"</svg>";
}

/* étiquettes colorées */
const ETC=["#fcd5b4","#d9c8ee","#fbd3e3","#c6e6a8","#fde59a","#bfe6f5","#c9daf2","#e2efb3"];
const etiq=(list)=>`<div class="figs" style="gap:10px">${list.map((t,i)=>`<span style="display:inline-block;padding:8px 14px;border-radius:8px;background:${ETC[i%ETC.length]};color:#1a1a1a;font-weight:600;font-size:18px">${t}</span>`).join("")}</div>`;

/* tableau simple */
const tab=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>i?`<td>${c}</td>`:`<th>${c}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* tableau dont toutes les cellules sont des données (en-tête en haut seulement) */
const tabH=(head,rows)=>`<div class="scroll"><table class="std"><thead><tr>${head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
/* table de multiplication de −3 à 3 */
const MT=[-3,-2,-1,0,1,2,3];
const tabMul=(full)=>`<div class="scroll"><table class="std"><thead><tr><th>×</th>${MT.map(v=>`<th>${F(v)}</th>`).join("")}</tr></thead><tbody>${MT.map(a=>`<tr><th>${F(a)}</th>${MT.map(b=>`<td>${full?`<span style="color:${a*b>0?BLUE:a*b<0?RED:"var(--ink)"};font-weight:700">${F(a*b)}</span>`:""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;

/* outils réutilisés par la fiche d'entraînement */
window.REL4={F,S,P,Q,cols,dl,pyr,build,ADD,MUL,cercles,etiq,tab,tabH,RED,BLUE};

/* ===================== figures du cours ===================== */
const D_A1=dl({arcs:[[0,3,"+3",BLUE],[3,5,"+2",BLUE,1]], dots:[[5,BLUE]], alt:"(+3) + (+2) : on avance de 3 puis de 2, on arrive à +5"});
const D_A2=dl({arcs:[[0,-4,"−4",RED],[-4,-6,"−2",RED,1]], dots:[[-6,RED]], alt:"(−4) + (−2) : on recule de 4 puis de 2, on arrive à −6"});
const D_B1=dl({arcs:[[0,3,"+3",BLUE],[3,-2,"−5",RED,1]], dots:[[-2,RED]], alt:"(+3) + (−5) : on avance de 3 puis on recule de 5, on arrive à −2"});
const D_B2=dl({arcs:[[0,-2,"−2",RED],[-2,4,"+6",BLUE,1]], dots:[[4,BLUE]], alt:"(−2) + (+6) : on recule de 2 puis on avance de 6, on arrive à +4"});

/* ===================== figures de la fiche ===================== */
const PA=build([15,-7,-12],ADD), PB=build([-15,23,-37,61],ADD);
const knownB=(k,i)=>i===0 && k<3 || k===3;           /* pyramide b : la brique de gauche de chaque étage + le sommet */
const PM1=build([-2,0.5,-8],MUL), PM2=build([-3,-4,0.5,-10],MUL), PM3=build([-2,3,-7],MUL), PM4=build([-3,-2,1,-5],MUL);
const CV=[4,0.7,-6,-11,9,5.7,-1,-6], CK=[1,1,0,1,1,0,1,0];
const TAROT=[["Charlotte",-45,20,60],["Amandine",-45,-30,30],["Marion",30,40,-45],["Estelle",60,-30,-45]];
const LILA=[["a.","(−15) + (−5) = −10",-20,0],["b.","(−8) × (−2) = 16",16,1],["c.","(+7) − (+2) = 9",5,0],["d.","8 − (−3) = 11",11,1],["e.","(−10) × 7 = −70",-70,1],["f.","(−5) × (−3) = −15",15,0],["g.","(+8) − (+7) = 1",1,1],["h.","(−11) − (+5) = 6",-16,0]];
const ETQ=["−3 − (−9)","(−2,5) + (−1,5)","−8 − (−14)","4,6 − 8,6","7,3 + (−3,3)","−3,2 − 2,8","−1,5 − 4,5","11 − (+7)"];

/* ===================== schémas (rappels) ===================== */
const S_ADD=sch("Additionner deux nombres relatifs",`<p class="calc">(−4) + (−2) = (−6) &nbsp; <span style="color:var(--muted)">même signe : on garde le signe, on additionne 4 + 2</span></p><p class="calc">(+3) + (−5) = (−2) &nbsp; <span style="color:var(--muted)">signes contraires : 5 − 3 = 2, signe de −5</span></p>`);
const S_SOUS=sch("Soustraire un nombre relatif",`${chn("A",["(+3) − (−12)","(+3) + (+12)","(+15)"])}<p class="schN">Soustraire un nombre, c'est ajouter son opposé.</p>`);
const S_MUL=sch("Signe d'un produit",`<p class="calc">(−6) × (−4) = (+24) &nbsp; <span style="color:var(--muted)">même signe : positif</span></p><p class="calc">(+6) × (−4) = (−24) &nbsp; <span style="color:var(--muted)">signes contraires : négatif</span></p>`);
const S_SIMP=sch("Simplifier l'écriture",`${chns([["A",["(+3) + (−5)","3 − 5","−2"]],["B",["(−6) × (−4)","−6 × (−4)","24"]]])}<p class="schN">On supprime le signe d'addition et les parenthèses ; jamais deux signes à la suite.</p>`);

/* générateurs utiles au QCM */
const nz=(a,b)=>{ let v; do{ v=ri(a,b); }while(!v); return v; };
const expl=(a,b)=>{ const s=a+b; if(a*b>0) return `Même signe : on garde le signe « ${a>0?"+":"−"} » et on additionne les distances à zéro : ${F(Math.abs(a))} + ${F(Math.abs(b))} = ${F(Math.abs(s))}.`;
  if(!s) return `${F(a)} et ${F(b)} sont opposés : leur somme est 0.`;
  const big=Math.abs(a)>Math.abs(b)?a:b; return `Signes contraires : ${F(Math.max(Math.abs(a),Math.abs(b)))} − ${F(Math.min(Math.abs(a),Math.abs(b)))} = ${F(Math.abs(s))}, et on prend le signe de ${F(big)} (la plus grande distance à zéro).`; };

CH["4e-1"]={
intro:"Additionner, soustraire et multiplier des nombres relatifs, puis simplifier l'écriture d'un calcul.",
savoir:[
  "additionner deux nombres relatifs de même signe ;",
  "additionner deux nombres relatifs de signes contraires ;",
  "soustraire un nombre relatif (ajouter son opposé) ;",
  "multiplier deux nombres relatifs (règle des signes) ;",
  "simplifier l'écriture d'une somme et la calculer."
],

/* ===================== COURS ===================== */
cours:[
{k:"1", t:"L'addition de deux nombres relatifs", h:`
  <p>Sur la droite graduée, les nombres négatifs (les flammes) sont à gauche de 0 et les nombres positifs (les gouttes) sont à droite.</p>
  ${co("droite.png","Droite graduée de −7 à +8 : les flammes du côté des négatifs, les gouttes du côté des positifs",520)}
  <h4>1. Additionner deux nombres relatifs de même signe</h4>
  <div class="retenir" data-l="Propriété"><p>Si deux nombres relatifs sont de <b>même signe</b>, alors leur somme :</p><ul><li>a ce même signe ;</li><li>a pour distance à zéro la somme des distances à zéro des deux nombres.</li></ul></div>
  <p><b>Exemple 1 :</b></p>${chn("A",["(+3) + (+2)","(+5)"])}
  <div class="figs">${co("gouttes.png","3 gouttes plus 2 gouttes",200)}</div>
  <p>Les deux nombres sont positifs. 3 + 2 = 5, donc la somme est +5.</p>${D_A1}
  <p><b>Exemple 2 :</b></p>${chn("B",["(−4) + (−2)","(−6)"])}
  <div class="figs">${co("flammes.png","4 flammes plus 2 flammes",200)}</div>
  <p>Les deux nombres sont négatifs. 4 + 2 = 6, donc la somme est −6.</p>${D_A2}
  <h4>2. Additionner deux nombres relatifs de signes contraires</h4>
  <div class="retenir" data-l="Propriété"><p>Si deux nombres relatifs sont de <b>signes contraires</b>, alors leur somme :</p><ul><li>a le signe du nombre qui a la plus grande distance à zéro ;</li><li>a pour distance à zéro la différence des distances à zéro des deux nombres.</li></ul></div>
  <p><b>Exemple 1 :</b></p>${chn("C",["(+3) + (−5)","(−2)"])}
  <p>Les distances à zéro sont 3 et 5 : 5 − 3 = 2.</p><p>C'est −5 qui a la plus grande distance à zéro : la somme est négative.</p>${D_B1}
  <p><b>Exemple 2 :</b></p>${chn("D",["(−2) + (+6)","(+4)"])}
  <p>Les distances à zéro sont 2 et 6 : 6 − 2 = 4.</p><p>C'est +6 qui a la plus grande distance à zéro : la somme est positive.</p>${D_B2}`},
{k:"2", t:"La soustraction de deux nombres relatifs", h:`
  <div class="retenir" data-l="Propriété"><p>Soustraire un nombre, c'est <b>ajouter son opposé</b>.</p></div>
  <p><b>Exemples :</b></p>
  ${chns([["A",["(−7) − (+9)","(−7) + (−9)","(−16)"]],["B",["(+3) − (−12)","(+3) + (+12)","(+15)"]],["C",["(−5) − (−8)","(−5) + (+8)","(+3)"]]])}`},
{k:"3", t:"La multiplication de deux nombres relatifs", h:`
  <h4>1. Multiplier deux nombres relatifs de même signe</h4>
  <div class="retenir" data-l="Propriété"><p>Si deux nombres relatifs sont de <b>même signe</b>, alors leur produit :</p><ul><li>est <b>positif</b> ;</li><li>a pour distance à zéro le produit des distances à zéro des deux nombres.</li></ul></div>
  <p><b>Exemples :</b></p>${chns([["A",["(+7) × (+3)","(+21)"]],["B",["(−6) × (−4)","(+24)"]]])}
  <h4>2. Multiplier deux nombres relatifs de signes contraires</h4>
  <div class="retenir" data-l="Propriété"><p>Si deux nombres relatifs sont de <b>signes contraires</b>, alors leur produit :</p><ul><li>est <b>négatif</b> ;</li><li>a pour distance à zéro le produit des distances à zéro des deux nombres.</li></ul></div>
  <p><b>Exemples :</b></p>${chns([["C",["(−7) × (+3)","(−21)"]],["D",["(+6) × (−4)","(−24)"]]])}`},
{k:"4", t:"Simplification d'écriture", h:`
  <div class="retenir" data-l="Convention"><ul><li>On peut simplifier une addition de nombres relatifs en supprimant le <b>signe d'addition</b> et les <b>parenthèses</b> autour des nombres.</li><li>On ne peut pas avoir deux signes à suivre : si c'est le cas, il faut mettre des parenthèses.</li><li>On peut supprimer le signe « + » d'un nombre positif (et ses parenthèses).</li></ul></div>
  <p><b>Exemples :</b> simplifier les écritures suivantes.</p>
  ${chns([["A",["(+3) + (+2)","3 + 2","5"]],["B",["(−4) + (−2)","−4 − 2","−6"]],["C",["(+3) + (−5)","3 − 5","−2"]],["D",["(−2) + (+6)","−2 + 6","4"]],["E",["(+6) × (−4)","6 × (−4)","−24"]],["F",["(−6) × (−4)","−6 × (−4)","24"]]])}
  <div class="attention"><b>ATTENTION :</b> dans 6 × (−4), on garde les parenthèses autour de −4 : on ne peut pas écrire deux signes à la suite (« × − »).</div>`}
],

/* ===================== EXERCICES ===================== */
exos:[
{t:"L'addition de deux nombres relatifs", e:[
  {n:"Exercice 1", t:"Les températures", w:"Sur ton cahier", h:`<p>Marie a relevé les températures tous les matins durant une semaine, à la même heure.</p><p>Voici ses données (en °C) :</p>
   ${tabH(["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"],[[-1,0,1.3,-1.5,-0.5,1,-0.7].map(F)])}
   <p>Range ces températures dans l'ordre croissant.</p>`,
   c:`<p>Les nombres négatifs sont les plus petits. Entre deux nombres négatifs, le plus petit est celui qui a la plus grande distance à zéro.</p><p class="calc">−1,5 &lt; −1 &lt; −0,7 &lt; −0,5 &lt; 0 &lt; 1 &lt; 1,3</p><p>Jeudi, lundi, dimanche, vendredi, mardi, samedi, mercredi.</p>`},
  {n:"Exercice 2", t:"Calculer des sommes", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(["A = (+2) + (+2)","B = (−1) + (−3)","C = (+4) + (+5)","D = (−5) + (−2)","E = (+3) + (+6)","F = (−2) + (−7)","G = (−5) + (+2)","H = (−1) + (+4)","I = (+5) + (−3)","J = (−3) + (+7)","K = (+3) + (−2)","L = (−7) + (+5)","M = (+5) + (−8)","N = (−6) + (+3)","O = (+5) + (−1)"])}`,
   c:`<p><b>Même signe :</b> on garde le signe et on additionne les distances à zéro.</p>${chns([["A",["(+2) + (+2)","(+4)"]],["B",["(−1) + (−3)","(−4)"]],["C",["(+4) + (+5)","(+9)"]],["D",["(−5) + (−2)","(−7)"]],["E",["(+3) + (+6)","(+9)"]],["F",["(−2) + (−7)","(−9)"]]])}
   <p><b>Signes contraires :</b> on soustrait les distances à zéro et on prend le signe du nombre qui a la plus grande distance à zéro.</p>${chns([["G",["(−5) + (+2)","(−3)"]],["H",["(−1) + (+4)","(+3)"]],["I",["(+5) + (−3)","(+2)"]],["J",["(−3) + (+7)","(+4)"]],["K",["(+3) + (−2)","(+1)"]],["L",["(−7) + (+5)","(−2)"]],["M",["(+5) + (−8)","(−3)"]],["N",["(−6) + (+3)","(−3)"]],["O",["(+5) + (−1)","(+4)"]]])}`},
  {n:"Exercice 3", t:"Additions de plus de deux nombres relatifs", w:"Sur ton cahier", h:`<p><b>Exemple :</b> on regroupe les nombres positifs, puis les nombres négatifs.</p>
   <p class="calc">A = (−4) + (+2) + (−3) + (+5) + (+2) + (−3)<br>A = (+2) + (+5) + (+2) + (−4) + (−3) + (−3)<br>A = (+9) + (−10)<br>A = (−1)</p>
   <div class="retenir" data-l="Remarque"><p>Lorsqu'il y a deux nombres opposés dans une somme, on peut les rayer : leur somme est 0.</p></div>
   <p>Calcule à ton tour : B = (−5) + (−3) + (+2) + (+3) + (−4).</p>`,
   c:`<p>(−3) et (+3) sont opposés : on les raye.</p><p class="calc">B = (−5) + <s>(−3)</s> + (+2) + <s>(+3)</s> + (−4)<br>B = (−5) + (+2) + (−4)<br>B = (+2) + (−5) + (−4)<br>B = (+2) + (−9)<br>B = (−7)</p>`},
  {n:"Exercice 4", t:"Jeu vidéo", w:"Sur ton cahier", h:`<p>Quatre copains jouent à un jeu vidéo.</p><p>Richard gagne 25 points à la première partie et perd 18 points à la deuxième.</p><p>Nicolas perd 2 points à la première manche et perd 11 points à la seconde.</p><p>Jean-Baptiste gagne 9 points à la première partie et perd 24 points à la deuxième.</p><p>Dylan perd 27 points à la première manche et gagne 33 points à la seconde.</p>
   <p><b>1)</b> Écris les quatre additions qui permettent de calculer le score de chacun.</p><p><b>2)</b> Qui a gagné le plus de points ?</p>`,
   c:`<p><b>1)</b></p><p class="calc">Richard : (+25) + (−18) = (+7)<br>Nicolas : (−2) + (−11) = (−13)<br>Jean-Baptiste : (+9) + (−24) = (−15)<br>Dylan : (−27) + (+33) = (+6)</p><p><b>2)</b> −15 &lt; −13 &lt; +6 &lt; +7 : c'est <b>Richard</b> qui a gagné le plus de points (7 points).</p>`},
  {n:"Exercice 5", t:"Les pyramides additives", w:"Sur ta feuille", h:`<p>Dans chaque brique, le nombre à inscrire est la <b>somme</b> des nombres écrits dans les deux briques du dessous.</p><p>Complète chaque pyramide.</p>
   <div class="figs"><div><p><b>a.</b></p>${pyr(PA)}</div><div><p><b>b.</b></p>${pyr(PB,knownB)}</div></div>`,
   c:`<p><b>a.</b> 15 + (−7) = 8 · (−7) + (−12) = −19 · 8 + (−19) = −11</p>${pyr(PA,undefined,true)}
   <p><b>b.</b> On cherche le nombre qui manque dans chaque somme :</p><p>−6 + … = 4, donc … = 10 · 8 + … = −6, donc … = −14 · −14 + … = 10, donc … = 24</p><p>−15 + … = 8, donc … = 23 · 23 + … = −14, donc … = −37 · −37 + … = 24, donc … = 61</p>${pyr(PB,knownB,true)}`},
  {n:"Exercice 6", t:"Envisager tous les cas", w:"Sur ton cahier", h:`<p>Les signes des nombres ont été remplacés par ■.</p><p>Pour chaque égalité, retrouve les signes en envisageant tous les cas possibles.</p>${cols(["a. ■8,5 + (■13,7) = ■5,2","b. ■4,8 + (■7,3) = ■12,1","c. ■17,4 + (■29) = ■11,6","d. ■9,6 + (■15,1) = ■24,7"])}`,
   c:`<p><b>a.</b> 13,7 − 8,5 = 5,2 : les signes sont contraires.</p><p class="calc">+8,5 + (−13,7) = −5,2 &nbsp; ou &nbsp; −8,5 + (+13,7) = +5,2</p>
   <p><b>b.</b> 4,8 + 7,3 = 12,1 : les signes sont les mêmes.</p><p class="calc">+4,8 + (+7,3) = +12,1 &nbsp; ou &nbsp; −4,8 + (−7,3) = −12,1</p>
   <p><b>c.</b> 29 − 17,4 = 11,6 : les signes sont contraires.</p><p class="calc">+17,4 + (−29) = −11,6 &nbsp; ou &nbsp; −17,4 + (+29) = +11,6</p>
   <p><b>d.</b> 9,6 + 15,1 = 24,7 : les signes sont les mêmes.</p><p class="calc">+9,6 + (+15,1) = +24,7 &nbsp; ou &nbsp; −9,6 + (−15,1) = −24,7</p>`},
  {n:"Exercice 7", t:"Le tarot", w:"Sur ton cahier", h:`<p>Charlotte, Amandine, Marion et Estelle jouent au tarot.</p><p>À la première partie, Marion a gagné 30 points et Estelle en a gagné 60. Charlotte et Amandine ont toutes les deux perdu 45 points.</p><p>Voici la feuille de score :</p>
   ${tabH(TAROT.map(r=>r[0]),[TAROT.map(r=>S(r[1])),TAROT.map(()=>"&nbsp;"),TAROT.map(()=>"&nbsp;")])}
   <p><b>Remarque :</b> la somme des scores doit toujours être égale à 0.</p><p>En effet, (−45) + (−45) + (+30) + (+60) = 0.</p>
   <p><b>1)</b> À la deuxième partie, Marion a gagné 40 points et Charlotte en a gagné 20. Amandine et Estelle ont toutes les deux perdu 30 points.</p><p>Écris sur la 2<sup>e</sup> ligne leur nouveau score. Par exemple, pour Charlotte : (−45) + (+20) = …</p>
   <p><b>2)</b> À la troisième partie, Charlotte a gagné 60 points et Amandine en a gagné 30. Marion et Estelle ont toutes les deux perdu 45 points.</p><p>Écris leur nouveau score sur la 3<sup>e</sup> ligne.</p>`,
   c:`<p><b>1)</b> Charlotte : (−45) + (+20) = −25 · Amandine : (−45) + (−30) = −75 · Marion : (+30) + (+40) = +70 · Estelle : (+60) + (−30) = +30</p><p>Vérification : (−25) + (−75) + (+70) + (+30) = 0.</p>
   <p><b>2)</b> Charlotte : (−25) + (+60) = +35 · Amandine : (−75) + (+30) = −45 · Marion : (+70) + (−45) = +25 · Estelle : (+30) + (−45) = −15</p><p>Vérification : (+35) + (−45) + (+25) + (−15) = 0.</p>
   ${tabH(TAROT.map(r=>r[0]),[0,1,2].map(l=>TAROT.map(r=>{ let t=r[1]; for(let k=1;k<=l;k++) t+=r[k+1]; return S(t); })))}`}
 ]},
{t:"La soustraction de deux nombres relatifs", e:[
  {n:"Activité 1", t:"Comprendre la soustraction de nombres relatifs", w:"Sur ton cahier", h:`<p>Le jeu contient les cartes numérotées de −6 à 8 :</p><p class="calc">−6 ; −5 ; −4 ; −3 ; −2 ; −1 ; 0 ; 1 ; 2 ; 3 ; 4 ; 5 ; 6 ; 7 ; 8</p>
   <p><b>Partie 1 : paquet de cartes sans les cartes « −5 » et « −4 »</b></p><p><b>a)</b> Fais la somme des cartes.</p><p><b>b)</b> Retire la carte 3 et fais la somme des cartes.</p><p><b>c)</b> Remets la carte 3. Retire la carte −3 et fais la somme des cartes.</p>
   <p><b>Partie 2 : paquet de cartes entier</b></p><p><b>a)</b> Fais la somme des cartes.</p><p><b>b)</b> Retire la carte 3 et fais la somme des cartes.</p><p><b>c)</b> Remets la carte 3. Retire la carte −3 et fais la somme des cartes.</p>
   <p><b>Bilan :</b> retirer une carte, c'est faire une soustraction. Quel calcul revient au même que « 24 − (−3) » ?</p>`,
   c:`<p><b>Partie 1 :</b> on raye les cartes opposées (−3 et 3, −2 et 2, −1 et 1, −6 et 6). Il reste 0 + 4 + 5 + 7 + 8.</p><p><b>a)</b> La somme des cartes est égale à <b>24</b>.</p><p><b>b)</b> Sans la carte 3 : 24 − 3 = <b>21</b>.</p><p><b>c)</b> Sans la carte −3 : la somme augmente de 3 : <b>27</b>. Donc 24 − (−3) = 27 = 24 + 3.</p>
   <p><b>Partie 2 :</b> on ajoute les cartes −5 et −4 : 24 + (−5) + (−4) = 15.</p><p><b>a)</b> La somme des cartes est égale à <b>15</b>.</p><p><b>b)</b> Sans la carte 3 : 15 − 3 = <b>12</b>.</p><p><b>c)</b> Sans la carte −3 : 15 − (−3) = <b>18</b>.</p>
   <p><b>Bilan :</b> 24 − (−3) = 24 + (+3) : soustraire un nombre, c'est ajouter son opposé.</p>`},
  {n:"Exercice 8", t:"Entraînement aux soustractions", w:"Sur ton cahier", h:`<p>Calcule les expressions suivantes.</p>${cols(["A = 8 − (−4)","B = (−4) − (+10)","C = (−13) − (−3)","D = 15 − (−15)","E = (−22) − (−22)","F = 7 − (+12)"])}`,
   c:`<p>Soustraire un nombre, c'est ajouter son opposé.</p>${chns([["A",["8 − (−4)","8 + (+4)","12"]],["B",["(−4) − (+10)","(−4) + (−10)","−14"]],["C",["(−13) − (−3)","(−13) + (+3)","−10"]],["D",["15 − (−15)","15 + (+15)","30"]],["E",["(−22) − (−22)","(−22) + (+22)","0"]],["F",["7 − (+12)","7 + (−12)","−5"]]])}`},
  {n:"Exercice 9", t:"Les cercles", w:"Sur ta feuille", h:`<p>Un nombre écrit dans un cercle rouge <b>moins</b> le nombre écrit dans le cercle bleu diamétralement opposé doit donner −5.</p><p>Exemple : 4 − 9 = −5.</p><p>Complète les cercles vides.</p>${cercles(-5,CV,CK)}`,
   c:`<p class="calc">Cercle rouge en face de −1 : … − (−1) = −5, donc … = −6 car −6 − (−1) = −6 + 1 = −5.<br>Cercle bleu en face de 0,7 : 0,7 − … = −5, donc … = 5,7 car 0,7 − 5,7 = −5.<br>Cercle bleu en face de −11 : −11 − … = −5, donc … = −6 car −11 − (−6) = −11 + 6 = −5.</p>${cercles(-5,CV,CK,true)}`}
 ]},
{t:"La multiplication de deux nombres relatifs", e:[
  {n:"Activité 2", t:"Jeu du lancer de cerceaux", w:"Sur ton cahier", h:`<p><b>Règle du jeu :</b> on lance des balles dans les cerceaux, puis on fait la somme de tous les points pour avoir le score final.</p><p><b>Objectif :</b> avoir le plus de points possible.</p>
   ${ex("cerceaux.jpg","Cerceaux : marron +10, violet −8, jaune +7, vert +5, bleu clair −6, bleu foncé +3, rouge −12",420)}
   <p>Juliette et Alexis ont joué à ce jeu.</p><p>Juliette a envoyé <b>26 balles</b> : 8 dans un cerceau jaune, 5 dans un cerceau bleu clair, 4 dans un cerceau vert, 4 dans un cerceau violet et 5 lancers ratés.</p><p>Alexis a voulu laisser de l'avance à Juliette et n'a lancé que <b>20 balles</b> : 3 dans un cerceau rouge, 11 dans un cerceau jaune et le reste dans un cerceau bleu clair.</p>
   <p>Lequel des deux copains a gagné la partie ?</p>`,
   c:`<p>Juliette : 8 × (+7) = +56 · 5 × (−6) = −30 · 4 × (+5) = +20 · 4 × (−8) = −32 (les lancers ratés ne rapportent rien).</p><p class="calc">56 + (−30) + 20 + (−32) = 76 + (−62) = 14</p>
   <p>Alexis : 20 − 3 − 11 = 6 balles dans un cerceau bleu clair. 3 × (−12) = −36 · 11 × (+7) = +77 · 6 × (−6) = −36.</p><p class="calc">(−36) + 77 + (−36) = 77 + (−72) = 5</p><p>14 &gt; 5 : c'est <b>Juliette</b> qui a gagné la partie.</p>`},
  {n:"Activité 3", t:"Une conjecture sur le produit", w:"Sur ta feuille", h:`<p>Complète le tableau : dans chaque case, écris le produit du nombre de la ligne par le nombre de la colonne.</p><p>Aide-toi des régularités : dans chaque ligne, les résultats augmentent (ou diminuent) toujours du même nombre.</p>${tabMul(false)}
   <p>Que remarques-tu sur le signe du produit de deux nombres négatifs ? d'un nombre positif et d'un nombre négatif ?</p>`,
   c:`${tabMul(true)}<p>Le produit de deux nombres <b>de même signe</b> est <b>positif</b> : par exemple (−3) × (−2) = 6.</p><p>Le produit de deux nombres <b>de signes contraires</b> est <b>négatif</b> : par exemple (−3) × 2 = −6.</p><p>Un produit dont un facteur est 0 est égal à 0.</p>`},
  {n:"Exercice 10", t:"Les pyramides multiplicatives", w:"Sur ta feuille", h:`<p>Dans chaque brique, le nombre à inscrire est le <b>produit</b> des nombres écrits dans les deux briques du dessous.</p><p>Complète chaque pyramide.</p>
   <div class="figs"><div><p><b>a.</b></p>${pyr(PM1)}</div><div><p><b>b.</b></p>${pyr(PM2)}</div></div><div class="figs"><div><p><b>c.</b></p>${pyr(PM3)}</div><div><p><b>d.</b></p>${pyr(PM4)}</div></div>`,
   c:`<p><b>a.</b> (−2) × 0,5 = −1 · 0,5 × (−8) = −4 · (−1) × (−4) = 4</p>${pyr(PM1,undefined,true)}
   <p><b>b.</b> (−3) × (−4) = 12 · (−4) × 0,5 = −2 · 0,5 × (−10) = −5 · 12 × (−2) = −24 · (−2) × (−5) = 10 · (−24) × 10 = −240</p>${pyr(PM2,undefined,true)}
   <p><b>c.</b> (−2) × 3 = −6 · 3 × (−7) = −21 · (−6) × (−21) = 126</p>${pyr(PM3,undefined,true)}
   <p><b>d.</b> (−3) × (−2) = 6 · (−2) × 1 = −2 · 1 × (−5) = −5 · 6 × (−2) = −12 · (−2) × (−5) = 10 · (−12) × 10 = −120</p>${pyr(PM4,undefined,true)}`},
  {n:"Exercice 11", t:"C'est toi le prof !", w:"Sur ton cahier", h:`<p>Lila est interrogée sur les opérations de nombres relatifs.</p><p>Elle obtient :</p><ul><li>1 point pour chaque bonne réponse ;</li><li>0 point s'il n'y a aucune réponse ;</li><li>−0,5 point si la réponse est fausse.</li></ul><p>Voici sa copie :</p>
   <div class="scroll"><table class="std"><tbody>${LILA.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td></tr>`).join("")}</tbody></table></div>
   <p><b>1)</b> Corrige sa copie.</p><p><b>2)</b> Calcule la note de Lila.</p>`,
   c:`<p><b>1)</b></p><div class="scroll"><table class="std"><tbody>${LILA.map(r=>`<tr><th>${r[0]}</th><td>${r[1]}</td><td>${r[3]?"<b>Juste</b>":`<b>Faux</b> : le résultat est ${F(r[2])}`}</td></tr>`).join("")}</tbody></table></div>
   <p>Les calculs corrigés (f : même signe, donc le produit est positif) :</p>${chns([["A",["(−15) + (−5)","−20"]],["C",["(+7) − (+2)","(+7) + (−2)","5"]],["F",["(−5) × (−3)","15"]],["H",["(−11) − (+5)","(−11) + (−5)","−16"]]])}
   <p><b>2)</b> Lila a 4 bonnes réponses et 4 réponses fausses.</p><p class="calc">4 × 1 + 4 × (−0,5) = 4 + (−2) = 2</p><p>Lila a <b>2 points sur 8</b>.</p>`}
 ]},
{t:"Simplification d'écriture", e:[
  {n:"Exercice 12", t:"Simplification", w:"Sur ton cahier", h:`<p>Simplifie, puis calcule.</p>${cols(["A = (+5) + (+7)","B = (−4) + (−3)","C = (−4) + (+8)","D = (+5) + (−7)"])}`,
   c:`<p>On supprime le signe d'addition et les parenthèses.</p>${chns([["A",["(+5) + (+7)","5 + 7","12"]],["B",["(−4) + (−3)","−4 − 3","−7"]],["C",["(−4) + (+8)","−4 + 8","4"]],["D",["(+5) + (−7)","5 − 7","−2"]]])}`},
  {n:"Exercice 13", t:"Déjà simplifiées", w:"Sur ton cahier", h:`<p>Calcule.</p>${cols(["A = 8 − 11","B = −5 + 11","C = −4 − 8","D = −7 + 3","E = 14 − 8","F = −2 − 7"])}`,
   c:`${chns([["A",["8 − 11","−3"]],["B",["−5 + 11","6"]],["C",["−4 − 8","(−4) + (−8)","−12"]],["D",["−7 + 3","−4"]],["E",["14 − 8","6"]],["F",["−2 − 7","−9"]]])}<p>Pour C, on peut écrire −4 − 8 comme la somme (−4) + (−8).</p>`},
  {n:"Exercice 14", t:"Étiquettes égales", w:"Sur ta feuille", h:`<p>Entoure les étiquettes qui ont le même résultat.</p><p><i>Si tu as besoin, écris tes calculs.</i></p>${etiq(ETQ.map((t,i)=>"ABCDEFGH"[i]+" = "+t))}`,
   c:`${chns([["A",["−3 − (−9)","−3 + 9","6"]],["B",["(−2,5) + (−1,5)","−4"]],["C",["−8 − (−14)","−8 + 14","6"]],["D",["4,6 − 8,6","−4"]],["E",["7,3 + (−3,3)","4"]],["F",["−3,2 − 2,8","−6"]],["G",["−1,5 − 4,5","−6"]],["H",["11 − (+7)","11 + (−7)","4"]]])}
   <p>Égales à 6 : A et C.</p><p>Égales à −4 : B et D.</p><p>Égales à 4 : E et H.</p><p>Égales à −6 : F et G.</p>`},
  {n:"Exercice 15", t:"Histoire de simplification", w:"Sur ton cahier", h:`<p>−1 + 2 − 3 + 4 + 5 est l'écriture simplifiée de (−1) + (+2) − (+3) + (+4) − (−5).</p><p>Associe chaque calcul à son écriture simplifiée, puis effectue chaque calcul.</p>
   ${tab(["Calcul","Écriture simplifiée"],[["a. A = (−6) + (+11) + (−9)","(1) −6 + 11 + 9"],["b. B = (+6) + (−11) − (+9)","(2) 6 − 11 − 9"],["c. C = (−6) − (−11) + (+9)","(3) 6 − 11 + 9"],["d. D = (+6) − (+11) − (−9)","(4) −6 + 11 − 9"]])}`,
   c:`<p>Soustraire (+11), c'est ajouter (−11) : on écrit « − 11 ». Soustraire (−11), c'est ajouter (+11) : on écrit « + 11 ».</p><p>Associations : a va avec (4), b avec (2), c avec (1) et d avec (3).</p>${chns([["A",["(−6) + (+11) + (−9)","−6 + 11 − 9","5 − 9","−4"]],["B",["(+6) + (−11) − (+9)","6 − 11 − 9","−5 − 9","−14"]],["C",["(−6) − (−11) + (+9)","−6 + 11 + 9","5 + 9","14"]],["D",["(+6) − (+11) − (−9)","6 − 11 + 9","−5 + 9","4"]]])}`},
  {n:"Exercice 16", t:"L'ascenseur fou", w:"Sur ton cahier", h:`<p>Maïna est au deuxième étage.</p><p>Elle entre dans l'ascenseur et appuie sur le bouton RDC (rez-de-chaussée).</p><p>Mais au lieu de descendre, il se met à monter et à descendre n'importe comment.</p><p>Il monte de 3 étages, puis descend de 4 et encore de 2, pour enfin s'arrêter un étage plus haut.</p><p>Maïna va-t-elle se retrouver au rez-de-chaussée ?</p>`,
   c:`<p>Le rez-de-chaussée correspond à l'étage 0. On part de l'étage 2.</p><p class="calc">2 + 3 − 4 − 2 + 1 = 6 − 6 = 0</p><p>Oui : Maïna se retrouve à l'étage 0, c'est-à-dire au <b>rez-de-chaussée</b>.</p>`}
 ]},
{t:"Problèmes ouverts", e:[
  {n:"Exercice 17", t:"Le carré magique", w:"Sur ta feuille", h:`<p>Ce tableau se complète uniquement avec les nombres entiers de −8 compris à 7 compris (chacun une seule fois).</p><p>Complète-le de façon que les sommes sur chaque ligne, chaque colonne et chaque diagonale soient égales.</p>
   <div class="scroll"><table class="std" style="width:auto">${[[null,null,-7,4],[null,1,2,-1],[null,null,-2,3],[null,null,5,null]].map(r=>`<tr>${r.map(v=>`<td style="width:52px;height:40px;text-align:center">${v===null?"":F(v)}</td>`).join("")}</tr>`).join("")}</table></div>`,
   c:`<p>La somme de tous les nombres de −8 à 7 est −8 (les opposés s'annulent, il reste −8). Il y a 4 lignes : chaque ligne a pour somme −8 ÷ 4 = <b>−2</b>.</p><p>On complète de proche en proche :</p><p class="calc">2<sup>e</sup> ligne : … + 1 + 2 + (−1) = −2, donc … = −4.<br>Dernière colonne : 4 + (−1) + 3 + … = −2, donc … = −8.<br>Diagonale qui descend : … + 1 + (−2) + (−8) = −2, donc … = 7.<br>1<sup>re</sup> ligne : 7 + … + (−7) + 4 = −2, donc … = −6.</p><p>Il reste les nombres −5 ; −3 ; 0 et 6.</p><p class="calc">Diagonale qui monte : 4 + 2 + … + … = −2 : les deux cases valent −8 ensemble, donc ce sont −3 et −5.<br>2<sup>e</sup> colonne : −6 + 1 + … + … = −2 : la case de la 3<sup>e</sup> ligne est −3 (avec −5, il faudrait 8, qui n'est pas dans la liste), et celle du bas est 6.<br>Donc la case en bas à gauche est −5, et la dernière case est 0.</p>
   <div class="scroll"><table class="std" style="width:auto">${[[7,-6,-7,4],[-4,1,2,-1],[0,-3,-2,3],[-5,6,5,-8]].map((r,i)=>`<tr>${r.map((v,j)=>{ const g=[[0,0,1,1],[0,1,1,1],[0,0,1,1],[0,0,1,0]][i][j]; return `<td style="width:52px;height:40px;text-align:center${g?"":";color:var(--c);font-weight:700"}">${F(v)}</td>`; }).join("")}</tr>`).join("")}</table></div>
   <p>Vérification : 7 + (−6) + (−7) + 4 = −2 · 7 + 1 + (−2) + (−8) = −2 · 4 + 2 + (−3) + (−5) = −2.</p>`},
  {n:"Exercice 18", t:"Imaginer une stratégie", w:"Sur ta feuille", h:`<p>Place dans les disques neuf nombres entiers relatifs <b>consécutifs</b>, de façon que les sommes sur chaque ligne, chaque colonne et chaque diagonale soient égales à 0.</p>
   <svg class="fig" viewBox="0 0 230 230" width="230" role="img" aria-label="Neuf disques en carré, reliés par lignes, colonnes et diagonales">${[[35,35,195,35],[35,115,195,115],[35,195,195,195],[35,35,35,195],[115,35,115,195],[195,35,195,195],[35,35,195,195],[195,35,35,195]].map(([a,b,c,d])=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="thin"/>`).join("")}${[35,115,195].map(y=>[35,115,195].map(x=>`<circle cx="${x}" cy="${y}" r="24" style="fill:#f8c9bd;stroke:#b23a2a;stroke-width:2"/>`).join("")).join("")}</svg>`,
   c:`<p>Pour que les sommes soient nulles, il faut autant de positifs que de négatifs : on prend les nombres de −4 à 4. Le nombre 0 va au centre, et deux nombres opposés sont toujours face à face.</p>
   <svg class="fig" viewBox="0 0 230 230" width="230" role="img" aria-label="Solution : −3, 2, 1 / 4, 0, −4 / −1, −2, 3">${[[35,35,195,35],[35,115,195,115],[35,195,195,195],[35,35,35,195],[115,35,115,195],[195,35,195,195],[35,35,195,195],[195,35,35,195]].map(([a,b,c,d])=>`<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" class="thin"/>`).join("")}${[[-3,2,1],[4,0,-4],[-1,-2,3]].map((r,i)=>r.map((v,j)=>`<circle cx="${35+80*j}" cy="${35+80*i}" r="24" style="fill:#f8c9bd;stroke:#b23a2a;stroke-width:2"/><text x="${35+80*j}" y="${41+80*i}" text-anchor="middle" style="font-size:18px;font-weight:700;fill:#1a1a1a">${F(v)}</text>`).join("")).join("")}</svg>
   <p>Lignes : −3 + 2 + 1 = 0 · 4 + 0 + (−4) = 0 · −1 + (−2) + 3 = 0.</p><p>Colonnes : −3 + 4 + (−1) = 0 · 2 + 0 + (−2) = 0 · 1 + (−4) + 3 = 0.</p><p>Diagonales : −3 + 0 + 3 = 0 · 1 + 0 + (−1) = 0.</p>`},
  {n:"Exercice 19", t:"La salle du trésor", w:"Sur ton cahier", h:`<div class="scroll"><table class="std" style="width:auto">${[[-7,-8,-9],[-4,-5,-6],[-1,-2,-3]].map((r,i)=>`<tr>${r.map((v,j)=>`<td style="width:56px;height:44px;text-align:center;font-weight:700${i===2&&j===0?";background:#f4a08f;color:#1a1a1a":i===0&&j===2?";background:#9fcdf2;color:#1a1a1a":""}">${F(v)}</td>`).join("")}</tr>`).join("")}</table></div>
   <p>Pour traverser la salle du trésor, on peut passer d'une case à l'autre :</p><ul><li>soit en allant vers la <b>droite</b>, ce qui correspond à <b>additionner</b> les deux nombres situés dans les cases ;</li><li>soit en allant vers le <b>haut</b>, ce qui correspond à <b>multiplier</b> les deux nombres situés dans les cases.</li></ul><p>Les déplacements vers la gauche et vers le bas sont interdits.</p><p>On entre par la case −1 et on sort par la case −9.</p><p>À la sortie, le résultat obtenu est le cumul des sommes gagnées ou perdues à chaque déplacement.</p><p>Quel est le gain maximal que l'on peut obtenir ?</p>`,
   c:`<p>Il faut faire 2 déplacements vers la droite (D) et 2 vers le haut (H) : il y a 6 chemins possibles.</p>
   ${tab(["Chemin","Déplacements","Total"],[["D D H H","(−1) + (−2) = −3 · (−2) + (−3) = −5 · (−3) × (−6) = 18 · (−6) × (−9) = 54","<b>64</b>"],["D H D H","−3 · (−2) × (−5) = 10 · (−5) + (−6) = −11 · 54","50"],["D H H D","−3 · 10 · (−5) × (−8) = 40 · (−8) + (−9) = −17","30"],["H D D H","(−1) × (−4) = 4 · (−4) + (−5) = −9 · −11 · 54","38"],["H D H D","4 · −9 · 40 · −17","18"],["H H D D","4 · (−4) × (−7) = 28 · (−7) + (−8) = −15 · −17","0"]])}
   <p>Le gain maximal est <b>64</b> : on va deux fois vers la droite, puis deux fois vers le haut.</p>`}
 ]}
],

/* ===================== QCM ===================== */
quiz:[
{nom:"Additionner deux relatifs", schema:S_ADD, q:{
 1:[ {g:()=>{ const s=pick([1,-1]), a=s*ri(1,15), b=s*ri(1,15); return {q:`Calcule : ${P(a)} + ${P(b)}`, rep:[F(a+b)], ex:expl(a,b), sx:S_ADD}; }},
     {g:()=>{ const a=nz(-15,15), b=nz(-15,15), r=a+b; return {q:`Quel est le signe de ${P(a)} + ${P(b)} ?`, c:r?["positif","négatif"]:["positif","négatif","la somme est nulle"], rep:r>0?"positif":r<0?"négatif":"la somme est nulle", ex:expl(a,b), sx:S_ADD}; }} ],
 2:[ {g:()=>{ let a,b; do{ a=nz(-20,20); b=nz(-20,20); }while(a*b>0); return {q:`Calcule : ${P(a)} + ${P(b)}`, rep:[F(a+b)], ex:expl(a,b), sx:S_ADD}; }} ],
 3:[ {g:()=>{ let a,b; do{ a=nz(-99,99)/10; b=nz(-99,99)/10; }while(a*b>0); return {q:`Calcule : ${P(a)} + ${P(b)}`, rep:[F(a+b)], ex:expl(a,b), sx:S_ADD}; }},
     {g:()=>{ const v=Array.from({length:5},()=>nz(-9,9)), s=v.reduce((x,y)=>x+y,0), p=v.filter(x=>x>0).reduce((x,y)=>x+y,0), n=s-p, st=[v.map(P).join(" + "), [...v.filter(x=>x>0),...v.filter(x=>x<0)].map(P).join(" + "), p&&n?`${P(p)} + ${P(n)}`:"", P(s)].filter((x,i,a)=>x&&x!==a[i-1]); return {q:`Calcule : ${v.map(P).join(" + ")}`, rep:[F(s)], ex:`On regroupe les positifs, puis les négatifs : ${st.join(" = ")}.`, sx:S_ADD}; }} ]
}},
{nom:"Soustraire un relatif", schema:S_SOUS, q:{
 1:[ {g:()=>{ const a=nz(-15,15), b=ri(1,15); return {q:`Calcule : ${P(a)} − (+${b})`, rep:[F(a-b)], ex:`${P(a)} − (+${b}) = ${P(a)} + (−${b}) = ${P(a-b)}.`, sx:S_SOUS}; }} ],
 2:[ {g:()=>{ const a=nz(-15,15), b=ri(1,15); return {q:`Calcule : ${P(a)} − (−${b})`, rep:[F(a+b)], ex:`Soustraire −${b}, c'est ajouter son opposé +${b} : ${P(a)} − (−${b}) = ${P(a)} + (+${b}) = ${P(a+b)}.`, sx:S_SOUS}; }},
     {g:()=>{ const a=nz(-12,12), b=nz(-12,12); const good=`${P(a)} + ${P(-b)}`; return {q:`${P(a)} − ${P(b)} est égal à…`, c:shuf(uniq(good,[`${P(a)} + ${P(b)}`,`${P(-a)} + ${P(-b)}`,`${P(-a)} + ${P(b)}`])), rep:good, ex:`Soustraire ${P(b)}, c'est ajouter son opposé ${P(-b)}.`, sx:S_SOUS}; }} ],
 3:[ {g:()=>{ const a=nz(-99,99)/10, b=nz(-99,99)/10; return {q:`Calcule : ${P(a)} − ${P(b)}`, rep:[F(a-b)], ex:`${P(a)} − ${P(b)} = ${P(a)} + ${P(-b)} = ${P(a-b)}.`, sx:S_SOUS}; }},
     {g:()=>{ const c=nz(-9,-1), r=nz(-9,9); return {q:`Quel nombre faut-il écrire à la place de … ? &nbsp; ${P(r)} − … = ${P(c)}`, rep:[F(r-c)], ex:`${P(r)} − ${P(r-c)} = ${P(r)} + ${P(c-r)} = ${P(c)}.`, sx:S_SOUS}; }} ]
}},
{nom:"Multiplier deux relatifs", schema:S_MUL, q:{
 1:[ {g:()=>{ const a=nz(-10,10), b=nz(-10,10); return {q:`Le produit ${P(a)} × ${P(b)} est…`, c:["positif","négatif"], rep:a*b>0?"positif":"négatif", ex:a*b>0?"Les deux nombres sont de même signe : le produit est positif.":"Les deux nombres sont de signes contraires : le produit est négatif.", sx:S_MUL}; }} ],
 2:[ {g:()=>{ const a=nz(-12,12), b=nz(-12,12); return {q:`Calcule : ${P(a)} × ${P(b)}`, rep:[F(a*b)], ex:`${a*b>0?"Même signe : positif":"Signes contraires : négatif"}. ${Math.abs(a)} × ${Math.abs(b)} = ${Math.abs(a*b)}, donc ${P(a)} × ${P(b)} = ${P(a*b)}.`, sx:S_MUL}; }} ],
 3:[ {g:()=>{ const a=pick([-0.5,0.5,-2.5,2.5,-1.5,1.5]), b=2*nz(-9,9); return {q:`Calcule : ${P(a)} × ${P(b)}`, rep:[F(a*b)], ex:`${a*b>0?"Même signe : positif":"Signes contraires : négatif"}. ${F(Math.abs(a))} × ${Math.abs(b)} = ${F(Math.abs(a*b))}.`, sx:S_MUL}; }},
     {g:()=>{ const a=nz(-6,6), b=nz(-6,6), c=a*b; return {q:`Dans une pyramide multiplicative, les deux briques du dessous contiennent ${F(a)} et ${F(b)}. Quel nombre faut-il écrire au-dessus ?`, rep:[F(c)], ex:`${P(a)} × ${P(b)} = ${P(c)}.`, sx:S_MUL}; }} ]
}},
{nom:"Simplifier l'écriture", schema:S_SIMP, q:{
 1:[ {g:()=>{ let a,b; do{ a=nz(-12,12); b=nz(-12,12); }while(a>0&&b>0); const good=`${F(a)} ${b<0?"−":"+"} ${Math.abs(b)}`; return {q:`Quelle est l'écriture simplifiée de ${P(a)} + ${P(b)} ?`, c:shuf(uniq(good,[`${F(a)} ${b<0?"+":"−"} ${Math.abs(b)}`,`${F(-a)} ${b<0?"−":"+"} ${Math.abs(b)}`,`${F(-a)} ${b<0?"+":"−"} ${Math.abs(b)}`])), rep:good, ex:`On supprime le signe d'addition et les parenthèses : ${P(a)} + ${P(b)} = ${good} = ${F(a+b)}.`, sx:S_SIMP}; }} ],
 2:[ {g:()=>{ let a,b; do{ a=nz(-15,15); b=nz(-15,15); }while(a>0&&b>0); const e=`${F(a)} ${b<0?"−":"+"} ${Math.abs(b)}`; return {q:`Calcule : ${e}`, rep:[F(a+b)], ex:`${e} = ${P(a)} + ${P(b)} = ${F(a+b)}.`, sx:S_SIMP}; }} ],
 3:[ {g:()=>{ const a=nz(-12,12), b=ri(2,12), c=ri(2,12), o1=pick(["+","−"]), s1=pick([1,-1]), o2=pick(["+","−"]), s2=pick([1,-1]);
       const B=s1*b, C=s2*c, eB=o1==="+"?B:-B, eC=o2==="+"?C:-C, r=a+eB+eC; const simp=`${F(a)} ${eB<0?"−":"+"} ${Math.abs(eB)} ${eC<0?"−":"+"} ${Math.abs(eC)}`;
       return {q:`Calcule : ${P(a)} ${o1} ${P(B)} ${o2} ${P(C)}`, rep:[F(r)], ex:`On simplifie l'écriture, puis on calcule : ${P(a)} ${o1} ${P(B)} ${o2} ${P(C)} = ${simp} = ${F(r)}.`, sx:S_SIMP}; }},
     {q:"Vrai ou faux : on peut écrire 6 × −4.", c:VF, rep:"Faux", ex:"On ne peut pas avoir deux signes à suivre : on écrit 6 × (−4).", sx:S_SIMP} ]
}}
],

/* ===================== ÉVALUATION D'ENTRAÎNEMENT ===================== */
eval:{
titre:"Évaluation d'entraînement · chapitre 1", duree:50, info:"Durée : 50 min · Calculatrice non autorisée · Stylo et crayon",
comp:[
  ["CALCULER","Je sais additionner et soustraire deux nombres relatifs.","Ex. 1 (4 points)"],
  ["CALCULER","Je sais multiplier deux nombres relatifs.","Ex. 2 (3 points)"],
  ["CALCULER","Je sais simplifier l'écriture d'un calcul, puis le calculer.","Ex. 3 (3 points)"],
  ["RAISONNER","Je repère et je corrige des erreurs, je complète une pyramide.","Ex. 4 et 5 (7 points)"],
  ["MODÉLISER","Je traduis un problème par des calculs avec des nombres relatifs.","Ex. 6 (3 points)"]
],
exos:[
{t:"Additions et soustractions", p:4, h:`<p>Calcule.</p>${cols(["A = (−9) + (−6)","B = (+14) + (−20)","C = (−3,5) + (+8)","D = (−12) + (+12)","E = (−8) − (+5)","F = (+6) − (−9)","G = (−15) − (−4)","H = 2,5 − (−1,5)"])}`,
 c:`${chns([["A",["(−9) + (−6)","−15"]],["B",["(+14) + (−20)","−6"]],["C",["(−3,5) + (+8)","4,5"]],["D",["(−12) + (+12)","0"]],["E",["(−8) − (+5)","(−8) + (−5)","−13"]],["F",["(+6) − (−9)","(+6) + (+9)","15"]],["G",["(−15) − (−4)","(−15) + (+4)","−11"]],["H",["2,5 − (−1,5)","2,5 + 1,5","4"]]])}<p><i>(0,5 point par calcul)</i></p>`},
{t:"Multiplications", p:3, h:`<p>Calcule.</p>${cols(["A = (−7) × (+8)","B = (−9) × (−6)","C = (+12) × (−5)","D = (−0,5) × (−18)","E = (−1) × (+4,7)","F = 0 × (−13)"])}`,
 c:`${chns([["A",["(−7) × (+8)","−56"]],["B",["(−9) × (−6)","54"]],["C",["(+12) × (−5)","−60"]],["D",["(−0,5) × (−18)","9"]],["E",["(−1) × (+4,7)","−4,7"]],["F",["0 × (−13)","0"]]])}<p><i>(0,5 point par calcul)</i></p>`},
{t:"Simplifier, puis calculer", p:3, h:`<p>Écris chaque calcul sans parenthèses ni signe d'addition inutile, puis calcule.</p>${cols(["A = (+7) + (−12)","B = (−6) + (−9)","C = (−11) + (+4)","D = (+5) + (+13)","E = (−3) − (+8) + (+6)"])}`,
 c:`${chns([["A",["(+7) + (−12)","7 − 12","−5"]],["B",["(−6) + (−9)","−6 − 9","−15"]],["C",["(−11) + (+4)","−11 + 4","−7"]],["D",["(+5) + (+13)","5 + 13","18"]]])}<p><i>(0,5 point par calcul)</i></p>${chns([["E",["(−3) − (+8) + (+6)","−3 − 8 + 6","−11 + 6","−5"]]])}<p><i>(1 point)</i></p>`},
{t:"C'est toi le prof !", p:4, h:`<p>Voici la copie de Noa :</p><div class="scroll"><table class="std"><tbody><tr><th>a)</th><td>(−8) + (+3) = −11</td></tr><tr><th>b)</th><td>(−4) × (−7) = 28</td></tr><tr><th>c)</th><td>(+6) − (+10) = 4</td></tr><tr><th>d)</th><td>−9 − 6 = −15</td></tr><tr><th>e)</th><td>(−5) × 3 = 15</td></tr><tr><th>f)</th><td>7 − (−2) = 9</td></tr></tbody></table></div>
  <p><b>1)</b> Pour chaque ligne, écris « juste » ou « faux ». Corrige les erreurs.</p><p><b>2)</b> Le professeur donne 2 points par bonne réponse et enlève 1 point par réponse fausse. Calcule la note de Noa. Explique ta démarche.</p>`,
 c:`<p><b>1)</b> a) Faux · b) Juste · c) Faux · d) Juste · e) Faux · f) Juste</p><p>Les calculs corrigés, et la vérification de f :</p>${chns([["A",["(−8) + (+3)","−5"]],["C",["(+6) − (+10)","(+6) + (−10)","−4"]],["E",["(−5) × 3","−15"]],["F",["7 − (−2)","7 + 2","9"]]])}<p><i>(0,5 point par ligne)</i></p>
  <p><b>2)</b> Noa a 3 bonnes réponses et 3 réponses fausses.</p><p class="calc">3 × 2 + 3 × (−1) = 6 + (−3) = 3</p><p>Noa a 3 points sur 12. <i>(1 point)</i></p>`},
{t:"Pyramides", p:3, h:`<p><b>a)</b> et <b>c)</b> sont des pyramides additives (somme des deux briques du dessous). <b>b)</b> est une pyramide multiplicative (produit des deux briques du dessous).</p><p>Complète-les.</p>
  <div class="figs"><div><p><b>a)</b></p>${pyr(build([-9,4,-2],ADD))}</div><div><p><b>b)</b></p>${pyr(build([-2,5,-1],MUL))}</div><div><p><b>c)</b></p>${pyr(build([-4,5,-12],ADD),(k,i)=>i===0)}</div></div>`,
 c:`<p><b>a)</b> (−9) + 4 = −5 · 4 + (−2) = 2 · (−5) + 2 = −3 <i>(1 point)</i></p>${pyr(build([-9,4,-2],ADD),undefined,true)}
  <p><b>b)</b> (−2) × 5 = −10 · 5 × (−1) = −5 · (−10) × (−5) = 50 <i>(1 point)</i></p>${pyr(build([-2,5,-1],MUL),undefined,true)}
  <p><b>c)</b> 1 + … = −6, donc … = −7 · −4 + … = 1, donc … = 5 · 5 + … = −7, donc … = −12 <i>(1 point)</i></p>${pyr(build([-4,5,-12],ADD),(k,i)=>i===0,true)}`},
{t:"Le concours de fléchettes", p:3, h:`<p>Sur une cible, la zone verte rapporte +8 points, la zone orange −5 points et la zone grise −3 points.</p><p>Léo lance 10 fléchettes : 4 dans la zone verte, 3 dans la zone orange et 3 dans la zone grise.</p><p>Inès lance 10 fléchettes : 3 dans la zone verte, 1 dans la zone orange, 4 dans la zone grise, et 2 fléchettes ratent la cible (0 point).</p>
  <p><b>a)</b> Écris un calcul qui donne le score de Léo, puis effectue-le.</p><p><b>b)</b> Même question pour Inès.</p><p><b>c)</b> Qui a gagné ?</p>`,
 c:`<p class="calc">a) Léo : 4 × 8 + 3 × (−5) + 3 × (−3) = 32 + (−15) + (−9) = 32 − 24 = 8</p><p><i>(1 point)</i></p><p class="calc">b) Inès : 3 × 8 + 1 × (−5) + 4 × (−3) = 24 + (−5) + (−12) = 24 − 17 = 7</p><p><i>(1 point)</i></p><p>c) 8 &gt; 7 : c'est Léo qui a gagné. <i>(1 point)</i></p>`}
]}
};

/* clavier texte pour les réponses tapées (pour pouvoir écrire le signe −)
   et calculs en chaîne « A = … » dans les explications (sauf « Quel nombre faut-il écrire… ») */
const NOCH=["2.3.1"];
CH["4e-1"].quiz.forEach((N,ni)=>Object.entries(N.q).forEach(([l,list])=>list.forEach((it,i)=>{
  const f=o=>Object.assign(NOCH.includes(`${ni+1}.${l}.${i}`)?o:qChain(o),{kb:"text"});
  if(it.g){ const g=it.g; list[i]={g:()=>f(g())}; } else list[i]=f(it);
})));
})();
