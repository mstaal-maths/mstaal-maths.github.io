/* Outils communs aux fiches d'exercices d'entraînement (nouveaux nombres à chaque fiche) */
window.TRAIN = {};
window.TR = (function(){
const T = {};
T.ri = (a,b) => a + Math.floor(Math.random()*(b-a+1));
T.pick = a => a[Math.floor(Math.random()*a.length)];
T.shuf = a => { a=[...a]; for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; };
T.sp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g," ");
T.gcd = (a,b) => b ? T.gcd(b, a%b) : a;
/* n valeurs différentes produites par f */
T.distinct = (n, f, key=x=>JSON.stringify(x)) => { const m=new Map(); let g=0; while(m.size<n && g++<2000){ const v=f(); m.set(key(v), v); } return [...m.values()]; };
const LET = "abcdefghijklmnop";
/* « a. … · b. … » : la mise en page des corrections découpe sur « · » */
T.items = (arr, sep=" · ", paren=false) => arr.map((x,i)=>`${LET[i]}${paren?")":"."} ${x}`).join(sep);
T.L = LET;

/* étapes d'un calcul avec priorités : ["12 + 3 × 4", "12 + 12", "24"] */
T.prioSteps = expr => {
  let t = expr.replace(/\s+/g,"").match(/\d+|[×÷+−()]/g);
  const render = toks => toks.join(" ").replace(/\( /g,"(").replace(/ \)/g,")");
  const out=[render(t)]; let guard=0;
  while(t.length>1 && guard++<40){
    let lo=0, hi=t.length, open=-1;
    for(let i=0;i<t.length;i++){ if(t[i]==="(") open=i; if(t[i]===")"){ lo=open+1; hi=i; break; } }
    if(lo>0 && hi-lo===1){ t.splice(lo-1,3,t[lo]); out[out.length-1]=render(t); continue; }
    const seg=t.slice(lo,hi); let j=seg.findIndex(x=>x==="×"||x==="÷"); if(j<0) j=seg.findIndex(x=>x==="+"||x==="−"); if(j<1) break;
    const A=+seg[j-1], B=+seg[j+1], op=seg[j], v= op==="×"?A*B: op==="÷"?A/B: op==="+"?A+B:A-B;
    t.splice(lo+j-1,3,String(v));
    for(let k=0;k<t.length;k++){ if(t[k]==="(" && t[k+2]===")"){ t.splice(k,3,t[k+1]); k=-1; } }
    out.push(render(t));
  }
  return out;
};
T.evalExpr = expr => { const s=T.prioSteps(expr); return +s[s.length-1]; };

/* noms des fractions */
const DEN = {2:["demi","demis"],3:["tiers","tiers"],4:["quart","quarts"],5:["cinquième","cinquièmes"],6:["sixième","sixièmes"],7:["septième","septièmes"],8:["huitième","huitièmes"],9:["neuvième","neuvièmes"],10:["dixième","dixièmes"],100:["centième","centièmes"],1000:["millième","millièmes"]};
T.frName = (a,b) => `${a===1?"un":lettres(a)} ${a>1?DEN[b][1]:DEN[b][0]}`;
T.DEN = DEN;

/* axe gradué dont on connaît les deux extrémités */
T.ax = (n, end, pts=[], start="0") => axis({n, lab:[[0,start],[n,T.sp(end)]], pts});
return T;
})();
