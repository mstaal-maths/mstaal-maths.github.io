/* Calcul exact (fractions d'entiers) et étapes de calcul avec les priorités opératoires.
   Gère les nombres décimaux (virgule), × ÷ + −, les parenthèses ( ) et les crochets [ ].
   Une étape = dans chaque groupe le plus intérieur, on fait :
     - s'il y a des × ou ÷ : dans chaque « terme », l'opération × ou ÷ la plus à gauche ;
     - sinon : l'addition ou la soustraction la plus à gauche (de gauche à droite).  */
(function(){
const gcd=(a,b)=>{ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a; };
const R=(n,d=1)=>{ if(d<0){ n=-n; d=-d; } const g=gcd(n,d)||1; return {n:n/g, d:d/g}; };
const add=(a,b)=>R(a.n*b.d+b.n*a.d, a.d*b.d), sub=(a,b)=>R(a.n*b.d-b.n*a.d, a.d*b.d);
const mul=(a,b)=>R(a.n*b.n, a.d*b.d), div=(a,b)=>{ if(b.n===0) throw new Error("division par 0"); return R(a.n*b.d, a.d*b.n); };
const OPS={"×":mul,"÷":div,"+":add,"−":sub};
/* nombre décimal exact ? (dénominateur de la forme 2^a·5^b) */
const decimal = r => { let d=r.d; while(d%2===0) d/=2; while(d%5===0) d/=5; return d===1; };
/* écriture française : virgule, espaces par groupes de 3 */
function txt(r, money){
  if(!decimal(r)) return `{${r.n}/${r.d}}`;
  if(money && r.d!==1){ const c=Math.round(r.n*100/r.d), a=String(Math.abs(c)).padStart(3,"0"); return (c<0?"−":"")+a.slice(0,-2).replace(/\B(?=(\d{3})+(?!\d))/g," ")+","+a.slice(-2); }
  let k=0; while(Math.pow(10,k)%r.d!==0 && k<12) k++;
  const sc = Math.round(r.n*Math.pow(10,k)/r.d), neg=sc<0, a=String(Math.abs(sc)).padStart(k+1,"0");
  const ip=a.slice(0,a.length-k)||"0", fp=a.slice(a.length-k).replace(/0+$/,"");
  return (neg?"−":"")+ip.replace(/\B(?=(\d{3})+(?!\d))/g," ")+(fp?","+fp:"");
}
function parse(s){
  s=String(s).replace(/(\d)[\s  ](?=\d{3}(?!\d))/g,"$1").replace(/-/g,"−").replace(/\*/g,"×").replace(/\//g,"÷").replace(/\./g,",");
  const tk=s.match(/\d+(?:,\d+)?|[×÷+−()[\]]/g)||[];
  return tk.map(x=>/\d/.test(x)?{t:"n",v:(()=>{ const [i,f=""]=x.split(","); return R(+(i+f), Math.pow(10,f.length)); })()}:{t:x});
}
const isOpen=t=>t.t==="("||t.t==="[", isClose=t=>t.t===")"||t.t==="]";
function render(T, money){
  let s=""; T.forEach((x,i)=>{ const v = x.t==="n"?txt(x.v,money):x.t;
    if(i===0) s+=v; else if(isClose(x)||(T[i-1]&&isOpen(T[i-1]))) s+=v; else s+=" "+v; });
  return s;
}
/* une étape ; renvoie false s'il n'y a plus rien à faire */
function step(T){
  if(T.length===1) return false;
  /* groupes les plus intérieurs */
  const groups=[]; const st=[];
  T.forEach((x,i)=>{ if(isOpen(x)) st.push(i); else if(isClose(x)){ const o=st.pop(); if(!T.slice(o+1,i).some(y=>isOpen(y)||isClose(y))) groups.push([o,i]); } });
  if(st.length) throw new Error("parenthèses mal fermées");
  const work = groups.length ? groups.map(([o,c])=>[o+1,c,true]) : [[0,T.length,false]];
  for(let g=work.length-1; g>=0; g--){
    let [a,b,br]=work[g]; const C=T.slice(a,b);
    if(C.length===1){ if(br) T.splice(a-1,3,C[0]); continue; }
    const hasMul=C.some(x=>x.t==="×"||x.t==="÷");
    const todo=[];
    if(hasMul){ /* l'opération × ÷ la plus à gauche de chaque terme */
      let start=0; for(let i=0;i<=C.length;i++){ if(i===C.length||C[i].t==="+"||C[i].t==="−"){ const j=C.slice(start,i).findIndex(x=>x.t==="×"||x.t==="÷"); if(j>=0) todo.push(start+j); start=i+1; } }
    } else { const j=C.findIndex(x=>x.t==="+"||x.t==="−"); todo.push(j); }
    for(let k=todo.length-1;k>=0;k--){ const j=a+todo[k]; const v=OPS[T[j].t](T[j-1].v,T[j+1].v);
      if(v.n<0) throw new Error("résultat intermédiaire négatif");
      T.splice(j-1,3,{t:"n",v}); }
    const nb=a+(C.length-2*todo.length); /* nouvelle fin du groupe */
    if(br && nb-a===1) T.splice(a-1,3,T[a]);
  }
  return true;
}
function steps(expr, money){ const T=parse(expr), out=[render(T,money)]; let guard=0; while(step(T)&&guard++<60) out.push(render(T,money)); if(T.length!==1) throw new Error("calcul inachevé : "+expr); return {lines:out, v:T[0].v}; }
const val = expr => steps(expr).v;
/* présentation « A = … » ligne par ligne */
const html = (expr, name, money) => { const L=steps(expr, money).lines; return `<p class="calc">${L.map((l,i)=>`${name?name+" = ":(i?"= ":"")}${l}`).join("<br>")}</p>`; };
const inline = (expr, money) => steps(expr, money).lines.join(" = ");
window.C5 = {R, add, sub, mul, div, txt, parse, steps, val, html, inline, decimal, eq:(a,b)=>a.n===b.n&&a.d===b.d};
})();
