# render each dialogue line as its own wav with the character's voice (local Chatterbox, no API)
import json, subprocess, sys, os
SK='/home/user/.claude/skills/viral-video-studio/tools/voice.py'; PY='/home/user/voicekit/.venv/bin/python'
CAST={'WALT':('storyteller','-3.5','0.9'),'M7':('british','-1.0','0.97'),'MAYA':('gentle','+4.0','1.04')}
for spk,(preset,pitch,speed) in CAST.items():
    for i,txt in json.load(open(f'{spk}_lines.json')):
        f=f'd_{i:02d}_{spk}.txt'; open(f,'w').write(f"@voice {spk} {preset} pitch={pitch} speed={speed}\n{spk}: {txt}\n")
        subprocess.run([PY,SK,'--script',f,'--voice',preset,'--out',f'd_{i:02d}_{spk}.wav','--takes','2','--no-master'],check=True,stdout=open('gen_dialog_detail.log','a'),stderr=subprocess.STDOUT)
        print('done',i,spk,txt[:40],flush=True)
