import sys,json
from faster_whisper import WhisperModel
m=WhisperModel("small",device="cpu",compute_type="int8")
seg,_=m.transcribe(sys.argv[1],word_timestamps=True,language="en")
W=[{"w":w.word.strip(),"s":round(w.start,3),"e":round(w.end,3)} for s in seg for w in s.words]
json.dump(W,open(sys.argv[2],"w"));print(len(W),W[-1])
