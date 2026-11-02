"""Copie le site (version claude.ai) dans le dépôt GitHub et ajoute ce qu'il faut pour un vrai site public :
   en-tête HTML complet (téléphones, langue), description pour Google, plan du site."""
import shutil, os, re, sys
SRC=sys.argv[1]; DST=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='https://mstaal-maths.github.io/'
shutil.rmtree(os.path.join(DST,'pdf'), ignore_errors=True)   # les PDF sont maintenant tous dans pb/
for d in ['data','lib','pb']:
    shutil.rmtree(os.path.join(DST,d), ignore_errors=True); shutil.copytree(os.path.join(SRC,d), os.path.join(DST,d))

# ---------- corrections des exercices protégées par un code (un code par chapitre) ----------
# Les sources (version de M. Staal) restent en clair. Ici, dans la copie publique seulement :
#  - data/<ch>.js : la correction (c:) de chaque exercice de l'onglet Exercices est remplacée par un marqueur ;
#  - data/lock-<ch>.js : les vraies corrections (texte final, calculé dans le vrai site) + leurs images, chiffrées ;
#  - pb/<ch>.js : le PDF « Corrections » est chiffré avec la même clé ("corrx" à la place de "corr") ;
#  - img/ : les images qui ne servent qu'aux corrections sont retirées (elles sont dans le fichier chiffré).
# Chiffrement : AES-GCM 256, clé = PBKDF2-SHA256(code normalisé, sel du chapitre, 200 000 tours).
# Les codes en clair sont dans le dossier privé (CODES ci-dessous), jamais dans le dépôt.
CODES='/tmp/claude-0/-home-claude/8257eaad-948d-5bd2-b9ef-25ea6b474986/scratchpad/codes/codes.json'
ACORN='/opt/npm-tools/node_modules'
LOCK_IT=200000
LOCK_TXT='\u2063\U0001f512 Correction protégée par un code.'
SITES_JS=r'''
const acorn=require(process.argv[1]+'/acorn'), walk=require(process.argv[1]+'/acorn-walk'), fs=require('fs');
const out={};
for(const f of process.argv.slice(2)){ const src=fs.readFileSync(f,'utf8'); const L=[];
  walk.full(acorn.parse(src,{ecmaVersion:'latest',sourceType:'script'}), n=>{ if(n.type!=='ObjectExpression') return;
    const P=n.properties.filter(p=>p.type==='Property' && !p.computed), name=p=>p.key.type==='Identifier'?p.key.name:String(p.key.value);
    const c=P.find(p=>name(p)==='c'); if(c && P.some(p=>name(p)==='h')) L.push([c.start,c.end]); });
  out[f]=L.sort((a,b)=>a[0]-b[0]); }
process.stdout.write(JSON.stringify(out));
'''
LITS_JS=r'''
const acorn=require(process.argv[1]+'/acorn'), walk=require(process.argv[1]+'/acorn-walk'), fs=require('fs');
const out={};
for(const f of process.argv.slice(2)){ const src=fs.readFileSync(f,'utf8'), L=[], keys=new Set();
  const ast=acorn.parse(src,{ecmaVersion:'latest',sourceType:'script',onComment:(bl,t,s,e)=>L.push([s,e,'cm',t])});
  walk.full(ast, n=>{ if(n.type==='Property' && !n.computed) keys.add(n.key); if(n.type==='ExpressionStatement' && n.directive) keys.add(n.expression); });
  walk.full(ast, n=>{ if(n.type==='Literal' && typeof n.value==='string' && !keys.has(n)) L.push([n.start,n.end,'s',n.value]);
    if(n.type==='TemplateElement') L.push([n.start,n.end,'t',n.value.cooked==null?n.value.raw:n.value.cooked]); });
  out[f]=L; }
process.stdout.write(JSON.stringify(out));
'''
CAP_JS=';(function(k){{var D=typeof CH!=="undefined"&&CH[k],L=[];if(D&&D.exos)D.exos.forEach(function(S){{(S.e||[]).forEach(function(e){{L.push(e);}});}});(window.{g}=window.{g}||{{}})[k]={{D:D,e:L}};}})({k});\n'
READ_JS=r'''([g, pre, heavy]) => { const out={}, rnd=Math.random; let seed=7; Math.random=()=>{ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; };
  const walk=(o,acc,skip,seen=new Set())=>{ if(typeof o==='string'){ acc.push(o); return; } if(!o||typeof o!=='object'||seen.has(o)) return; seen.add(o);
    for(const key in o){ if(key==='c' && skip && skip.has(o)) continue; walk(o[key],acc,skip,seen); } };
  for(const k in window[g]){ const C=window[g][k], S=new Set(C.e), smp=[], txt=[], stxt=[];
    const rest=JSON.stringify(C.D,function(key,v){ return key==='c' && S.has(this) ? undefined : v; });
    walk(C.D, txt, S);
    /* QCM et exercices générés : des tirages (toujours les mêmes), pour la comparaison et pour savoir quel texte et quelles images ils utilisent */
    if(pre){ const add=x=>{ smp.push(JSON.stringify(x)); walk(x, stxt); };
      try{ (C.D.quiz||[]).forEach(N=>Object.values(N.q||{}).forEach(a=>a.forEach(Q=>{ for(let i=0;i<(Q.g?(heavy.includes(k)?60:8):1);i++){ try{ add(Q.g?Q.g():Q); }catch(e){} } }))); }catch(e){}
      try{ if(window.TRAIN&&TRAIN[k]) for(let i=0;i<(heavy.includes(k)?15:4);i++) add(TRAIN[k]()); }catch(e){} }
    out[k]={c:C.e.map(e=>e.c), id:C.e.map(e=>[e.n||'',e.t||'']), rest, txt:txt.join('\n'), smp:smp.join('\n'), stxt:stxt.join('\n')}; }
  Math.random=rnd; return out; }'''

def verrouiller():
    import json, glob, subprocess, hashlib, hmac, base64, threading, functools, http.server, unicodedata, html
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
    from playwright.sync_api import sync_playwright
    if not os.path.exists(CODES): sys.exit('ARRÊT : la liste des codes '+CODES+' est introuvable (les corrections ne seraient pas protégées).')
    codes=json.load(open(CODES,encoding='utf-8'))
    norm=lambda s: re.sub(r'[^A-Z0-9]','',unicodedata.normalize('NFD',s).encode('ascii','ignore').decode().upper())
    files={os.path.basename(f)[:-3]:f for f in glob.glob(os.path.join(SRC,'data','*.js')) if re.fullmatch(r'[3456]e-\d+\.js',os.path.basename(f))}
    keys=sorted(files, key=lambda k:(k[:2],int(k[3:])))
    miss=[k for k in keys if k not in codes]
    if miss: sys.exit('ARRÊT : pas de code pour '+', '.join(miss))
    src={k:open(files[k],encoding='utf-8').read() for k in keys}
    sites=json.loads(subprocess.run(['node','-e',SITES_JS,ACORN]+[files[k] for k in keys],capture_output=True,text=True,check=True).stdout)
    sites={k:sites[files[k]] for k in keys}
    def subst(k, repl):   # remplace les propriétés c: choisies (repl(i) -> texte ou None)
        s=src[k]; out=[]; pos=0
        for i,(a,b) in enumerate(sites[k]):
            r=repl(i)
            if r is None: continue
            out.append(s[pos:a]); out.append('c:'+json.dumps(r)); pos=b
        out.append(s[pos:]); return ''.join(out)
    tag=lambda k,i: f'\u2063LK{k}:{i}\u2063'
    variants={}
    # petit serveur local + vrai navigateur : les corrections sont calculées par le site lui-même
    H=functools.partial(type('Q',(http.server.SimpleHTTPRequestHandler,),{'log_message':lambda *a:None}), directory=SRC)
    srv=http.server.ThreadingHTTPServer(('127.0.0.1',0),H); threading.Thread(target=srv.serve_forever,daemon=True).start()
    base=f'http://127.0.0.1:{srv.server_address[1]}/'
    def run(pw, mode, g, pre=False, heavy=()):
        b=pw.chromium.launch(); pg=b.new_page(); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.add_init_script('(()=>{ let s=12345; Math.random=()=>{ s=(s*16807)%2147483647; return (s-1)/2147483646; }; })();')   # tirages identiques d'une fois sur l'autre
        def handler(route):
            k=re.search(r'/data/([3456]e-\d+)\.js', route.request.url).group(1)
            body=(variants[mode][k] if mode in variants else src[k])+CAP_JS.format(g=g,k=json.dumps(k))
            route.fulfill(status=200, content_type='application/javascript; charset=utf-8', body=body)
        pg.route(re.compile(r'/data/[3456]e-\d+\.js(\?.*)?$'), handler)
        pg.goto(base+'index.html', wait_until='load'); pg.wait_for_timeout(300)
        r=pg.evaluate(READ_JS, [g, pre, list(heavy)]); b.close()
        if errs: sys.exit(f'ARRÊT ({mode}) : erreur JS {errs[:3]}')
        return r
    variants['tag']={k:subst(k, lambda i,k=k: tag(k,i)) for k in keys}
    with sync_playwright() as pw:
        A=run(pw,'tag','__CAP')        # 1) quelles propriétés c: deviennent des corrections d'exercices ?
        B=run(pw,'orig','__CAP',True)  # 2) les corrections réelles, telles que le site les affiche
        used={}
        for k in keys:
            if k not in A or k not in B: sys.exit('ARRÊT : chapitre non chargé '+k)
            u=set()
            for j,c in enumerate(A[k]['c']):
                m=[int(x) for x in re.findall('\u2063LK'+re.escape(k)+r':(\d+)\u2063', c if isinstance(c,str) else '')]
                if not m: sys.exit(f'ARRÊT : {k}, correction n°{j+1} ({A[k]["id"][j]}) introuvable dans le fichier source')
                u.update(m)
            if not A[k]['rest'] or not B[k]['rest']: sys.exit('ARRÊT : CH['+k+'] absent à la fin de son fichier')
            other=A[k]['rest']+''.join(A[x]['rest'] or '' for x in keys if x!=k)
            bad=[i for i in u if tag(k,i) in other]
            if bad: sys.exit(f'ARRÊT : {k}, une correction d\'exercice sert aussi ailleurs (sites {bad})')
            if not all(isinstance(c,str) for c in B[k]['c']): sys.exit('ARRÊT : correction non textuelle dans '+k)
            used[k]=u
        variants['pub']={k:subst(k, lambda i,k=k: LOCK_TXT if i in used[k] else None) for k in keys}
        # 3) morceaux de correction restés ailleurs dans le fichier (données ou fonctions qui ne servaient qu'aux corrections,
        #    commentaires) : toute chaîne qui contient du texte de correction absent du contenu public est vidée.
        T=lambda x: re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]*>',' ',x)).replace('\u202f',' ').replace('\xa0',' ').replace('\u2009',' ')).strip()
        def frs(t): return {g for g in (x.strip(' ,–-') for x in re.split(r'[.;:!?·•]\s|\s[a-h]\)\s', t)) if len(g)>=22 and len(g.split())>=4}
        ATT=lambda x: ' '.join(html.unescape(v) for v in re.findall(r'(?:alt|aria-label|title)=\\?"([^"\\]*)', x))   # textes des images (alt…)
        ALW='\n'.join([T(B[k]['txt'])+'\n'+ATT(B[k]['txt']) for k in keys]+[T(B[k]['stxt'])+'\n'+ATT(B[k]['stxt']) for k in keys]
                       +[T(open(f,encoding='utf-8',errors='ignore').read()) for f in glob.glob(os.path.join(SRC,'data','*.js')) if os.path.basename(f)[:-3] not in files]
                       +[T(open(os.path.join(SRC,'index.html'),encoding='utf-8').read())])
        FR={}; CT={}
        for k in keys:
            CT[k]='\n'.join(T(c) for c in B[k]['c']); FR[k]={f for c in B[k]['c'] for f in frs(T(c)) if f not in ALW}
        import tempfile; tmp=tempfile.mkdtemp(prefix='verrou-')   # hors du dépôt
        for k in keys: open(os.path.join(tmp,k+'.js'),'w',encoding='utf-8').write(variants['pub'][k])
        lits=json.loads(subprocess.run(['node','-e',LITS_JS,ACORN]+[os.path.join(tmp,k+'.js') for k in keys],capture_output=True,text=True,check=True).stdout)
        shutil.rmtree(tmp,ignore_errors=True)
        cand={}
        for k in keys:
            cand[k]=[(st,en,kind,T(v)) for st,en,kind,v in lits[os.path.join(tmp,k+'.js')]
                     if (lambda n: any(f in n for f in FR[k]) or (len(n)>=22 and len(n.split())>=4 and n in CT[k] and n not in ALW))(T(v))]
        # une chaîne qui sert AUSSI ailleurs (QCM, exercices générés…) est publique de toute façon : on la garde.
        # Pour le savoir, chaque chaîne candidate reçoit une étiquette, puis on fait beaucoup de tirages dans le vrai site.
        tagl=lambda k,i: f'\u2063LT{k}:{i}\u2063'
        variants['tag2']={}
        for k in keys:
            t=variants['pub'][k]
            for i,(st,en,kind,n) in sorted(enumerate(cand[k]), key=lambda x:-x[1][0]):
                if kind!='cm': t=t[:st]+(json.dumps(tagl(k,i)) if kind=='s' else tagl(k,i))+t[en:]
            variants['tag2'][k]=t
        heavy=[k for k in keys if any(c[2]!='cm' for c in cand[k])]
        R=run(pw,'tag2','__CAP',True,heavy)
        seen='\n'.join(R[x]['rest']+'\n'+R[x]['smp'] for x in keys)
        vides=0
        for k in keys:
            keep={i for i,c in enumerate(cand[k]) if c[2]!='cm' and tagl(k,i) in seen}
            bad=[c for i,c in enumerate(cand[k]) if i not in keep]
            FR[k]={f for f in FR[k] if not any(f in cand[k][i][3] for i in keep)}
            t=variants['pub'][k]
            if os.environ.get('VERROU_LOG'):
                with open(os.environ['VERROU_LOG'],'a',encoding='utf-8') as lg:
                    for st,en,kind,n in bad: lg.write(f'{k}\tretiré\t{kind}\t{t[st:en][:300]!r}\n')
                    for i in keep: lg.write(f'{k}\tgardé (sert ailleurs)\t{cand[k][i][2]}\t{t[cand[k][i][0]:cand[k][i][1]][:300]!r}\n')
            for st,en,kind,n in sorted(bad, reverse=True): t=t[:st]+{'s':'""','t':'','cm':' '}[kind]+t[en:]
            variants['pub'][k]=t; vides+=len(bad)
            Tt=T(t); reste=[f for f in FR[k] if f in Tt]
            if reste: sys.exit(f'ARRÊT : {k}, texte de correction encore lisible dans le fichier public : {reste[:2]}')
        print(f'  {vides} morceaux de texte de correction retirés des fichiers publics (hors propriétés c:)')
        C=run(pw,'pub','__CAP',True)   # 4) contrôle : version publique = version privée, corrections en moins
    srv.shutdown()
    # les figures numérotent leurs id (flèches, dégradés…) : sans les corrections, la numérotation se décale.
    # On compare donc à numérotation près, et les id définis dans une correction reçoivent le suffixe « -k » (jamais de doublon).
    IDRE=re.compile(r'(id=\\?"|url\(#|href=\\?"#)([A-Za-z_][\w:.-]*)')
    def canon(s):
        m={}; return IDRE.sub(lambda g: g.group(1)+m.setdefault(g.group(2), '§%d'%len(m)), s)
    for k in keys:
        L=[]
        for c in B[k]['c']:
            own={g.group(2) for g in IDRE.finditer(c) if g.group(1).startswith('id')}
            ext={g.group(2) for g in IDRE.finditer(c) if not g.group(1).startswith('id')}-own
            if ext: sys.exit(f'ARRÊT : {k}, une correction utilise un id défini ailleurs ({sorted(ext)[:3]})')
            L.append(IDRE.sub(lambda g: g.group(1)+g.group(2)+('-k' if g.group(2) in own else ''), c))
        B[k]['c']=L
    for k in keys:
        if canon(C[k]['smp'])!=canon(B[k]['smp']): sys.exit('ARRÊT : '+k+' : les QCM ou exercices générés de la version publique diffèrent de la version privée')
        if canon(C[k]['rest'])!=canon(B[k]['rest']) or C[k]['id']!=B[k]['id']:
            x,y=canon(C[k]['rest']),canon(B[k]['rest']); i=next((i for i in range(min(len(x),len(y))) if x[i]!=y[i]), min(len(x),len(y)))
            sys.exit('ARRÊT : la version publique de '+k+' diffère de la version privée (hors corrections) :\n  public : '+x[max(0,i-150):i+150]+'\n  privé  : '+y[max(0,i-150):i+150])
        if not all(isinstance(c,str) and LOCK_TXT in c and '\u2063LK' not in c for c in C[k]['c']): sys.exit('ARRÊT : correction restée en clair dans '+k)
    # images utilisées seulement par les corrections des exercices
    def ref(s): return {a or b for a,b in re.findall(r'data-ib=\\?"([^"\\]+)\\?"|src=\\?"img/([^"\\]+)\\?"', s)}
    elsewhere=set()
    for k in keys: elsewhere|=ref(B[k]['rest'])|ref(B[k]['smp'])
    for f in glob.glob(os.path.join(SRC,'data','*.js'))+[os.path.join(SRC,'index.html')]:
        if os.path.basename(f)[:-3] in files: continue
        elsewhere|=set(re.findall(r'["\'/]((?:[0-9a-z]+)/[^"\'\s<>]+\.(?:png|jpe?g|gif|svg|webp))', open(f,encoding='utf-8',errors='ignore').read()))
    total=0; removed=set()
    for k in keys:
        code=norm(codes[k]); salt=hashlib.sha256(('laats-corrections|'+k).encode()).digest()[:16]
        key=hashlib.pbkdf2_hmac('sha256', code.encode(), salt, LOCK_IT, 32); aes=AESGCM(key)
        def enc(data, label):   # IV tiré du contenu : même contenu -> même fichier (pas de faux changements dans git)
            iv=hmac.new(key, label.encode()+b'|'+data, hashlib.sha256).digest()[:12]
            return {'v':base64.b64encode(iv).decode(), 'd':base64.b64encode(aes.encrypt(iv, data, None)).decode()}
        imgs={}
        for p in sorted(set().union(set(), *[ref(c) for c in B[k]['c']])):
            if p in elsewhere: continue
            fp=os.path.join(SRC,'img',p)
            if not os.path.isfile(fp): continue
            mime={'png':'image/png','jpg':'image/jpeg','jpeg':'image/jpeg','gif':'image/gif','svg':'image/svg+xml','webp':'image/webp'}[p.rsplit('.',1)[1].lower()]
            imgs[p]=f'data:{mime};base64,'+base64.b64encode(open(fp,'rb').read()).decode(); removed.add(p)
        box=enc(json.dumps({'c':B[k]['c'],'i':imgs},ensure_ascii=False,separators=(',',':')).encode(), 'html')
        box.update(s=base64.b64encode(salt).decode(), it=LOCK_IT)
        open(os.path.join(DST,'data',f'lock-{k}.js'),'w').write(f'(window.LOCKD=window.LOCKD||{{}})[{json.dumps(k)}]={json.dumps(box,separators=(",",":"))};\n')
        open(os.path.join(DST,'data',f'{k}.js'),'w',encoding='utf-8').write(variants['pub'][k]+CAP_JS.format(g='LOCKS',k=json.dumps(k)))
        pf=os.path.join(DST,'pb',f'{k}.js')
        if os.path.exists(pf):
            m=re.fullmatch(r'window\.PDFB=window\.PDFB\|\|\{\};PDFB\["([^"]+)"\]=(\{.*\});?\s*', open(pf).read(), re.S)
            if not m or m.group(1)!=k: sys.exit('ARRÊT : format inattendu pour '+pf)
            d=json.loads(m.group(2))
            if 'corr' in d: d['corrx']=enc(base64.b64decode(d.pop('corr')), 'pdf')
            open(pf,'w').write('window.PDFB=window.PDFB||{};PDFB['+json.dumps(k)+']='+json.dumps(d)+';')
        total+=len(B[k]['c'])
    for p in removed:
        fp=os.path.join(DST,'img',p)
        if os.path.exists(fp): os.remove(fp)
    print(f'corrections protégées : {total} exercices, {len(keys)} chapitres, {len(removed)} images rangées dans les fichiers chiffrés')
verrouiller()

html=open(os.path.join(SRC,'index.html'),encoding='utf-8').read()
html=html.replace('<meta charset="utf-8">\n','',1)
html=re.sub(r'<title>[^<]*</title>\n','',html,count=1)
head=f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Laats – Révisions de maths de la 6e à la 3e</title>
<meta name="description" content="Laats, le site de révision créé par Johann STAAL, professeur de maths : cours, exercices corrigés, QCM, évaluations d'entraînement et mini-jeux, de la 6e à la 3e.">
<link rel="canonical" href="{URL}">
<meta property="og:title" content="Laats – Révisions de maths de la 6e à la 3e">
<meta property="og:description" content="Laats, le site de révision créé par Johann STAAL, professeur de maths : cours, exercices corrigés, QCM, évaluations d'entraînement et mini-jeux, de la 6e à la 3e.">
<meta property="og:url" content="{URL}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Laats">
<meta property="og:locale" content="fr_FR">
<meta property="og:image" content="{URL}og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#f6f8fc">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" href="icon-48.png" type="image/png" sizes="48x48">
<link rel="icon" href="icon-192.png" type="image/png" sizes="192x192">
<link rel="apple-touch-icon" href="icon-180.png">
<meta name="apple-mobile-web-app-title" content="Laats">
<meta name="author" content="Johann STAAL">
<script type="application/ld+json">{{"@context":"https://schema.org","@type":"WebSite","name":"Laats","alternateName":"Laats maths","url":"{URL}","inLanguage":"fr","author":{{"@type":"Person","name":"Johann STAAL"}}}}</script>
<meta name="google-site-verification" content="FbK-a01abS9KfgRM0RR3wsXvcssGQ3GlBl0Y_OxGacg">
'''
open(os.path.join(DST,'index.html'),'w',encoding='utf-8').write(head+html)
open(os.path.join(DST,'sitemap.xml'),'w').write(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>{URL}</loc></url>\n</urlset>\n')

# ---------- fonctionnement sans connexion : manifeste, icônes, service worker, liste des images par classe ----------
import json, time, glob, hashlib
from PIL import Image, ImageDraw, ImageFont
LOGO='/tmp/claude-0/-home-claude/8257eaad-948d-5bd2-b9ef-25ea6b474986/scratchpad/logo'
for f in ['icon-512.png','icon-192.png','icon-180.png','icon-48.png','favicon.ico','og-image.png']: shutil.copy(os.path.join(LOGO,f), os.path.join(DST,f))
json.dump({"name":"Laats","short_name":"Laats","lang":"fr","start_url":"./","scope":"./","display":"standalone",
  "background_color":"#f6f8fc","theme_color":"#15213b","icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"any maskable"}]},
  open(os.path.join(DST,'manifest.webmanifest'),'w'),ensure_ascii=False,indent=1)
# images utilisées par chaque classe (pour le bouton « télécharger les images de ma classe »)
IB={}
CLS=lambda n: '3e' if n.startswith('3k') else '4e' if n.startswith('4k') else '5e' if n[:2] in ('5k','5c') else '6e' if n.startswith('c') else None
for d in sorted(os.listdir(os.path.join(DST,'img'))):
    c=CLS(d)
    if c: IB.setdefault(c,set()).update('img/'+d+'/'+f for f in os.listdir(os.path.join(DST,'img',d)))
for k in list(IB): IB[k]=sorted(IB[k])
open(os.path.join(DST,'data','iblist.js'),'w').write('window.IBLIST='+json.dumps(IB)+';\n')
core=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','favicon.ico']+sorted(os.path.relpath(x,DST) for d in ['data','lib'] for x in glob.glob(os.path.join(DST,d,'**','*'),recursive=True) if os.path.isfile(x))
H=hashlib.sha1()
for x in core[1:]: H.update(open(os.path.join(DST,x),'rb').read())
ver=H.hexdigest()[:10]
open(os.path.join(DST,'sw.js'),'w').write(f'''/* Laats : fonctionnement sans connexion */
const V="staal-{ver}", CORE={json.dumps(core)};
self.addEventListener("install", e=>{{ self.skipWaiting(); e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).catch(()=>{{}})); }});
self.addEventListener("activate", e=>{{ e.waitUntil(caches.keys().then(K=>Promise.all(K.filter(k=>k.startsWith("staal-")&&k!==V&&k!=="staal-media").map(k=>caches.delete(k)))).then(()=>self.clients.claim())); }});
self.addEventListener("fetch", e=>{{
  const r=e.request, u=new URL(r.url); if(r.method!=="GET" || u.origin!==location.origin) return;
  const media=/[/](img|pb)[/]/.test(u.pathname), store=media?"staal-media":V;
  if(r.mode==="navigate"){{ e.respondWith(fetch(r).then(x=>{{ const y=x.clone(); caches.open(V).then(c=>c.put("index.html",y)); return x; }}).catch(()=>caches.match("index.html"))); return; }}
  e.respondWith(caches.open(store).then(c=>c.match(r,{{ignoreSearch:true}}).then(hit=>{{
    const net=fetch(r).then(x=>{{ if(x.ok) c.put(r,x.clone()); return x; }}).catch(()=>hit);
    if(hit && media){{ e.waitUntil(net.catch(()=>{{}})); return hit; }} return net.then(x=>x||hit, ()=>hit); }})));
}});
''')
print('ok')
