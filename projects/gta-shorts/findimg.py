import json,urllib.request,urllib.parse,time,sys,os,subprocess
def get(u,raw=False,tries=4):
    for i in range(tries):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":"video-asset-fetcher/1.0"}),timeout=40).read()
            return r if raw else json.loads(r)
        except Exception as e:
            if i==tries-1: return None
            time.sleep(5*(i+1))
queries=sys.argv[1:]
meta=[]
for qi,q in enumerate(queries):
    d=get("https://api.openverse.org/v1/images/?"+urllib.parse.urlencode({"q":q,"license":"cc0,pdm,by","page_size":5,"fields":"id,title,source,license,url,creator,foreign_landing_url,width,height"}))
    for r in (d or {}).get("results",[]):
        th=get(f"https://api.openverse.org/v1/images/{r['id']}/thumb/",raw=True)
        if th:
            n=len(meta); open(f"cand/{n:02d}.jpg","wb").write(th); meta.append({"n":n,"q":q,**r})
    time.sleep(2)
json.dump(meta,open("cand/meta.json","w"))
print(len(meta),"candidates")
for m in meta: print(m["n"],m["q"][:22],"|",(m["title"] or "")[:44],"|",m["source"],m["license"],m["width"],"x",m["height"])
