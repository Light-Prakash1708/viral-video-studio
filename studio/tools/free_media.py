#!/usr/bin/env python3
"""tools/free_media.py: licence-safe free audio (Openverse) and b-roll (archive.org) for videos.

  python tools/free_media.py audio "ambient piano" [--n 10] [--min-sec 30] [--licenses cc0,pdm,by]
  python tools/free_media.py audio-get <openverse_id> --out assets/                 # download + ATTRIBUTION.txt line
  python tools/free_media.py footage "city night timelapse" [--n 10] [--allow-by]
  python tools/free_media.py images "miami skyline" [--n 10]            # Openverse photos (cc0/pdm/by); thumbnails: api.openverse.org/v1/images/<id>/thumb/
  python tools/free_media.py image-get <openverse_id> --out assets/     # downloads + credit line (flickr may 429: retry)
  python tools/free_media.py footage-get <archive_identifier> --out assets/ [--trim 12:20] [--size 1920x1080]
  python tools/free_media.py px-images "laughing cat" [--n 10] [--orientation vertical]   # Pixabay photos/illustrations
  python tools/free_media.py px-videos "city night" [--n 10]                              # Pixabay stock video
  python tools/free_media.py px-image-get <pixabay_id> --out assets/   |   px-video-get <pixabay_id> --out assets/ [--trim 2:8] [--size 1080x1920]
Pixabay needs a free API key in the environment variable PIXABAY_API_KEY (https://pixabay.com/api/docs/). Pixabay Content
License: free for commercial use, credit not required (we add one anyway). Not allowed: selling it unaltered, implying an
identifiable person/brand endorses something, or showing a person in an offensive way; trademarks/logos in shots still need
care. Pixabay MUSIC has no API: download a track by hand from pixabay.com/music and give it to
`pick_music.py --file <track>` (some Pixabay tracks are registered with Content ID; keep the track page URL to dispute).

Defaults only return commercial-safe licences: CC0 / public-domain (pdm) / CC-BY for audio; public domain / CC0 for footage
(--allow-by adds CC-BY footage; credit then goes in the description). NC (non-commercial) and ND are never returned.
Every download appends a ready-to-paste credit line to <out>/ATTRIBUTION.txt. Always paste CC-BY credits in the video description.
Note: public-domain footage re-uploaded elsewhere can still trigger Content ID; keep the source URL handy to dispute.
"""
import argparse, json, os, subprocess, sys, urllib.parse, urllib.request
UA = {"User-Agent": "video-asset-fetcher/1.0"}

def get(url, timeout=60):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=timeout) as r: return r.read()
def getj(url):
    import time
    for i in range(5):
        try: return json.loads(get(url))
        except urllib.error.URLError as e:
            if (isinstance(e, urllib.error.HTTPError) and e.code != 429) or i == 4: raise
            time.sleep(8 * (i + 1))  # anonymous Openverse is rate limited
def dl(url, path):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=300) as r, open(path, "wb") as f:
        while True:
            b = r.read(1 << 20)
            if not b: break
            f.write(b)
def credit(out, line):
    os.makedirs(out, exist_ok=True)
    with open(os.path.join(out, "ATTRIBUTION.txt"), "a") as f: f.write(line.strip() + "\n")

def audio_search(q, n, min_sec, lic, source=None):
    p = {"q": q, "license": lic, "page_size": min(50, max(n * 3, 10)), "fields": "id,title,creator,license,license_version,url,duration,foreign_landing_url,attribution,source"}
    if source: p["source"] = source
    d = getj("https://api.openverse.org/v1/audio/?" + urllib.parse.urlencode(p))
    out = []
    for r in d.get("results", []):
        sec = (r.get("duration") or 0) / 1000
        if sec >= min_sec: out.append((r, sec))
    return out[:n]

def footage_search(q, n, allow_by):
    lic = "(licenseurl:*publicdomain* OR licenseurl:*zero*" + (" OR licenseurl:*licenses/by/*" if allow_by else "") + ")"
    p = {"q": f"mediatype:movies AND ({q}) AND {lic}", "rows": n, "output": "json", "sort[]": "downloads desc"}
    q2 = urllib.parse.urlencode(p, doseq=True) + "".join("&fl[]=" + f for f in ("identifier", "title", "licenseurl", "creator", "runtime", "downloads"))
    return getj("https://archive.org/advancedsearch.php?" + q2)["response"]["docs"]

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("cmd", choices=["audio", "audio-get", "footage", "footage-get", "images", "image-get", "px-images", "px-videos", "px-image-get", "px-video-get"]); ap.add_argument("arg")
    ap.add_argument("--n", type=int, default=10); ap.add_argument("--min-sec", type=float, default=20); ap.add_argument("--licenses", default="cc0,pdm,by")
    ap.add_argument("--allow-by", action="store_true"); ap.add_argument("--out", default="assets"); ap.add_argument("--trim"); ap.add_argument("--source", default="jamendo", help="openverse source; jamendo downloads reliably here (freesound CDN 403, wikimedia 429); '' = all"); ap.add_argument("--orientation", default="all"); ap.add_argument("--size", default="src", help="WxH to scale+crop, or src to keep the source resolution (archive.org is often 320x240-640x480)"); a = ap.parse_args()
    if a.cmd == "audio":
        for r, sec in audio_search(a.arg, a.n, a.min_sec, a.licenses, a.source or None):
            print(f"{r['id']}  {sec:6.1f}s  {r['license'].upper():4s} {r.get('creator') or '?':22.22s}  {r['title'][:60]}  [{r.get('source')}]")
    elif a.cmd == "audio-get":
        r = getj(f"https://api.openverse.org/v1/audio/{a.arg}/")
        ext = os.path.splitext(urllib.parse.urlparse(r["url"]).path)[1] or ".mp3"; os.makedirs(a.out, exist_ok=True)
        path = os.path.join(a.out, f"{a.arg}{ext}"); dl(r["url"], path)
        credit(a.out, r.get("attribution") or f"{r['title']} by {r.get('creator')} ({r['license']}) {r.get('foreign_landing_url')}"); print(path, r["license"], r.get("attribution", ""))
    elif a.cmd == "footage":
        for d in footage_search(a.arg, a.n, a.allow_by):
            print(f"{d['identifier']:34.34s} {str(d.get('runtime') or '?'):>8s}  {d.get('licenseurl','').split('/')[-3] if d.get('licenseurl') else '?':14.14s} {d.get('title','')[:60]}")
    elif a.cmd == "images":
        p = {"q": a.arg, "license": a.licenses, "page_size": min(20, a.n), "fields": "id,title,creator,license,source,width,height"}
        for r in getj("https://api.openverse.org/v1/images/?" + urllib.parse.urlencode(p)).get("results", []):
            print(f"{r['id']}  {r['license'].upper():4s} {r.get('source','?'):9.9s} {r.get('width')}x{r.get('height')}  {(r.get('title') or '')[:55]}")
    elif a.cmd.startswith("px-"):
        return pixabay(a)
    elif a.cmd == "image-get":
        r = getj(f"https://api.openverse.org/v1/images/{a.arg}/"); os.makedirs(a.out, exist_ok=True)
        path = os.path.join(a.out, f"{a.arg}.jpg"); dl(r["url"], path)
        credit(a.out, f"Image \"{(r.get('title') or '').strip()}\" by {r.get('creator') or 'unknown'} ({r['license'].upper()}) {r.get('foreign_landing_url') or r['url']}"); print(path, r["license"])
    else:
        m = getj(f"https://archive.org/metadata/{a.arg}"); files = [f for f in m.get("files", []) if f.get("name", "").lower().endswith((".mp4", ".ogv", ".mpeg", ".mov", ".avi"))]
        if not files: sys.exit("no video files in item")
        files.sort(key=lambda f: (0 if f["name"].lower().endswith(".mp4") else 1, int(f.get("size", 0) or 10**12)))
        f = files[0]; os.makedirs(a.out, exist_ok=True); raw = os.path.join(a.out, f"{a.arg}_src{os.path.splitext(f['name'])[1]}")
        dl(f"https://archive.org/download/{a.arg}/{urllib.parse.quote(f['name'])}", raw)
        outp = os.path.join(a.out, f"{a.arg}.mp4")
        vf = [] if a.size == "src" else ["-vf", "scale={0}:{1}:force_original_aspect_ratio=increase,crop={0}:{1}".format(*a.size.split("x"))]
        cmd = ["ffmpeg", "-y", "-v", "error", "-i", raw] + (["-ss", a.trim.split(":")[0], "-to", a.trim.split(":")[1]] if a.trim else []) + vf + ["-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", outp]
        subprocess.run(cmd, check=True); os.remove(raw)
        lic = m.get("metadata", {}).get("licenseurl", "public domain"); credit(a.out, f"Footage: \"{m.get('metadata', {}).get('title', a.arg)}\" via archive.org/details/{a.arg} ({lic})"); print(outp, lic)

def pixabay(a):
    key = os.environ.get("PIXABAY_API_KEY")
    if not key: sys.exit("PIXABAY_API_KEY is not set: add your free Pixabay API key as that environment variable (environment settings), then start a new session.")
    kind = "videos" if "video" in a.cmd else ""
    base = f"https://pixabay.com/api/{kind + '/' if kind else ''}"
    if a.cmd in ("px-images", "px-videos"):
        p = {"key": key, "q": a.arg[:100], "per_page": max(3, min(200, a.n)), "safesearch": "true"}
        if not kind: p.update(image_type="all", orientation=a.orientation)
        for h in getj(base + "?" + urllib.parse.urlencode(p)).get("hits", [])[:a.n]:
            if kind: v = h["videos"].get("large") or h["videos"]["medium"]; print(f"{h['id']}  {h['duration']:4d}s  {v['width']}x{v['height']}  by {h.get('user')}  tags: {h.get('tags','')[:60]}")
            else: print(f"{h['id']}  {h.get('type','photo'):12.12s} {h['imageWidth']}x{h['imageHeight']}  by {h.get('user')}  tags: {h.get('tags','')[:60]}")
        return
    h = (getj(base + "?" + urllib.parse.urlencode({"key": key, "id": a.arg})).get("hits") or [None])[0]
    if not h: sys.exit("no such Pixabay id")
    os.makedirs(a.out, exist_ok=True); page = h.get("pageURL", f"https://pixabay.com/ (id {a.arg})")
    if kind:
        v = h["videos"].get("large") if h["videos"].get("large", {}).get("url") else h["videos"]["medium"]
        raw = os.path.join(a.out, f"px_{a.arg}_src.mp4"); dl(v["url"], raw); outp = os.path.join(a.out, f"px_{a.arg}.mp4")
        vf = [] if a.size == "src" else ["-vf", "scale={0}:{1}:force_original_aspect_ratio=increase,crop={0}:{1}".format(*a.size.split("x"))]
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw] + (["-ss", a.trim.split(":")[0], "-to", a.trim.split(":")[1]] if a.trim else []) + vf + ["-an", "-c:v", "libx264", "-crf", "18", "-pix_fmt", "yuv420p", outp], check=True); os.remove(raw)
    else:
        outp = os.path.join(a.out, f"px_{a.arg}.jpg"); dl(h.get("largeImageURL") or h["webformatURL"], outp)
    credit(a.out, f"{'Video' if kind else 'Image'} by {h.get('user')} from Pixabay (Pixabay Content License) {page}"); print(outp, "Pixabay Content License", page)

if __name__ == "__main__": main()
