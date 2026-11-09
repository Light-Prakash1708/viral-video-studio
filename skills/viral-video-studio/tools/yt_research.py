import json, sys, urllib.request, urllib.parse, re
B='https://www.googleapis.com/youtube/v3/'
def get(ep, **p): return json.load(urllib.request.urlopen(B+ep+'?'+urllib.parse.urlencode(p)))
def dur(s):
    m=re.match(r'PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?',s); h,mi,se=[int(x or 0) for x in m.groups()]; return h*3600+mi*60+se
Q=sys.argv[1:]
for q in Q:
    r=get('search',part='snippet',q=q,type='video',videoDuration='short',maxResults=15,order='viewCount',relevanceLanguage='en')
    ids=[i['id']['videoId'] for i in r['items']]
    v=get('videos',part='statistics,contentDetails,snippet',id=','.join(ids))
    rows=sorted([(int(x['statistics'].get('viewCount',0)),dur(x['contentDetails']['duration']),x['snippet']['title'][:62],x['snippet']['channelTitle'][:22],x['snippet']['publishedAt'][:7]) for x in v['items']],reverse=True)
    vs=[r[0] for r in rows]; med=sorted(vs)[len(vs)//2] if vs else 0
    print(f"\n### {q}  | top {vs[0]/1e6:.1f}M · median of top15 {med/1e6:.2f}M")
    for r in rows[:5]: print(f"  {r[0]/1e6:6.1f}M {r[1]:3d}s {r[4]} | {r[2]} | {r[3]}")
