"""Copie le site (version claude.ai) dans le dépôt GitHub et ajoute ce qu'il faut pour un vrai site public :
   en-tête HTML complet (téléphones, langue), description pour Google, plan du site."""
import shutil, os, re, sys
SRC=sys.argv[1]; DST=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
URL='https://mstaal-maths.github.io/'
shutil.rmtree(os.path.join(DST,'pdf'), ignore_errors=True)   # les PDF sont maintenant tous dans pb/
for d in ['data','lib','pb']:
    shutil.rmtree(os.path.join(DST,d), ignore_errors=True); shutil.copytree(os.path.join(SRC,d), os.path.join(DST,d))
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
