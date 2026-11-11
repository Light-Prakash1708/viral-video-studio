import copy,scenes_a,scenes_b,scenes_c
ALL={s['id']:copy.deepcopy(s) for m in (scenes_a,scenes_b,scenes_c) for s in m.S}
def rep(sc,key,old,new):
    assert old in sc[key],(sc['id'],old[:50]); sc[key]=sc[key].replace(old,new,1)
# foreground modes
for k,m in dict(s01='none',s05='bokeh',s07='bokeh',s08='bokeh',s09='bokeh',s11='bokeh',s14='bokeh').items(): ALL[k]['fg']=m
# ---- S02: layers + two close-ups
s=ALL['s02']
rep(s,'build',"function build(){let s=roomBack(p,{});","function build(){let s=`<g id=\"${p}-L0\">`+roomBack(p,{});")
rep(s,'build',"s+=manBack(p+'-man',880,835,1.3)+roomFront(p);","s+=`</g><g id=\"${p}-L1\">`+manBack(p+'-man',880,835,1.3)+`</g><g id=\"${p}-L2\">`+roomFront(p);")
rep(s,'build',"return s+dust(p,30,3,300,150,1300,700)+","return s+`</g>`+dust(p,30,3,300,150,1300,700)+closeup(p+'a',{})+closeup(p+'b',{})+")
rep(s,'build',"driftDust(tl,p,D,50);fade(tl,p,D,.8,.7)}","parallax(tl,p,D);steam(tl,p,D);cuAnim(tl,p+'a',A.tired+.3,A.tired+3.0,{moods:[[0,'tired'],[1.2,'yawn'],[2.0,'tired']],lids:.45,blinks:[.4,2.3],look:[[0,0,7],[1.1,0,0]]});cuAnim(tl,p+'b',A.tomorrow_better+.2,A.tomorrow_better+3.3,{moods:[[0,'neutral'],[.9,'hope']],light:'#ffb24a',lightOp:.55,blinks:[1.2,2.5],look:[[0,0,0],[1.0,-9,-7]]});driftDust(tl,p,D,50);fade(tl,p,D,.8,.7)}")
# ---- S03: close-up on the empty chair
s=ALL['s03']
rep(s,'build',"return s+dust(p,34,8,0,100,1920,800,'#bcd0ff')}","return s+dust(p,34,8,0,100,1920,800,'#bcd0ff')+closeup(p+'a',{})}")
rep(s,'build',"driftDust(tl,p,D,110);fade(tl,p,D,.7,.7)}","cuAnim(tl,p+'a',A.negotiating-.2,A.negotiating+3.0,{moods:[[0,'sad'],[1.6,'tired']],lids:.3,blinks:[.9,2.3],look:[[0,0,0],[.6,16,2]]});driftDust(tl,p,D,110);fade(tl,p,D,.7,.7)}")
# ---- S06
s=ALL['s06']
rep(s,'build',"function build(){let s=roomBack(p,{rain:true});","function build(){let s=`<g id=\"${p}-L0\">`+roomBack(p,{rain:true});")
rep(s,'build',"s+=manBack(p+'-man',880,835,1.3)+roomFront(p)+","s+=`</g><g id=\"${p}-L1\">`+manBack(p+'-man',880,835,1.3)+`</g><g id=\"${p}-L2\">`+roomFront(p)+")
rep(s,'build',"return s+dust(p,26,31,300,150,1300,700)+","return s+`</g>`+dust(p,26,31,300,150,1300,700)+closeup(p+'a',{})+")
rep(s,'build',"driftDust(tl,p,D,40);fade(tl,p,D,.6,.6)}","parallax(tl,p,D);steam(tl,p,D);cuAnim(tl,p+'a',1.9,4.9,{moods:[[0,'tired'],[1.5,'sad']],lids:.5,blinks:[.8,2.2],look:[[0,0,8],[1.5,-6,10]]});driftDust(tl,p,D,40);fade(tl,p,D,.6,.6)}")
# ---- S10
s=ALL['s10']
rep(s,'build',"let s=`<g id=\"${p}-rm\">`+roomBack(p,{rain:true})+","let s=`<g id=\"${p}-rm\"><g id=\"${p}-L0\">`+roomBack(p,{rain:true})+")
rep(s,'build',"+manBack(p+'-man',880,835,1.3,{old:true,hair:'#cfcfd8',body:'#252a40'})+roomFront(p)+","+`</g><g id=\"${p}-L1\">`+manBack(p+'-man',880,835,1.3,{old:true,hair:'#cfcfd8',body:'#252a40'})+`</g><g id=\"${p}-L2\">`+roomFront(p)+")
rep(s,'build','fill="#cfc7b4"/></g>`;','fill="#cfc7b4"/></g></g>`;')
rep(s,'build',"return s+dust(p,34,18,200,100,1500,760,'#cfd6e6')+","return s+dust(p,34,18,200,100,1500,760,'#cfd6e6')+closeup(p+'a',{old:true,light:'#8fa6e8'})+")
rep(s,'build',"driftDust(tl,p,D,40);fade(tl,p,D,.9,.8)}","parallax(tl,p,D);steam(tl,p,D);cuAnim(tl,p+'a',A.older-.4,A.older+4.4,{moods:[[0,'tired'],[1.5,'sad']],lids:.4,blinks:[1.0,3.0],look:[[0,0,6],[2,-10,4]],tear:2.3});driftDust(tl,p,D,40);fade(tl,p,D,.9,.8)}")
# ---- S13
s=ALL['s13']
rep(s,'build',"function build(){let s=roomBack(p,{dawn:true});","function build(){let s=`<g id=\"${p}-L0\">`+roomBack(p,{dawn:true});")
rep(s,'build',"s+=`<g id=\"${p}-young\">`+manBack","s+=`</g><g id=\"${p}-L1\"><g id=\"${p}-young\">`+manBack")
rep(s,'build',"`</g><g id=\"${p}-oldg\" opacity=\"0\">`+manBack(p+'-oman',880,835,1.3,{old:true,hair:'#d6d6de',body:'#3a3f5a',rim:'#ffd089'})+`</g>`;","`</g><g id=\"${p}-oldg\" opacity=\"0\">`+manBack(p+'-oman',880,835,1.3,{old:true,hair:'#d6d6de',body:'#3a3f5a',rim:'#ffd089'})+`</g></g>`;")
rep(s,'build',"s+=roomFront(p)+","s+=`<g id=\"${p}-L2\">`+roomFront(p)+")
rep(s,'build',"return s+dust(p,34,24,300,150,1300,700,'#ffe9bd')+","return s+`</g>`+dust(p,34,24,300,150,1300,700,'#ffe9bd')+closeup(p+'a',{light:'#ffd089'})+closeup(p+'b',{old:true,light:'#ffd089'})+")
rep(s,'build',"driftDust(tl,p,D,50);fade(tl,p,D,.6,.6)}","parallax(tl,p,D);steam(tl,p,D);cuAnim(tl,p+'a',1.0,4.0,{moods:[[0,'neutral'],[.8,'resolve']],light:'#ffd089',lightOp:.6,blinks:[.9,2.4],look:[[0,0,6],[.9,0,-4]]});cuAnim(tl,p+'b',A.evennow+.3,A.evennow+3.9,{moods:[[0,'sad'],[1.3,'hope']],light:'#ffd089',lightOp:.6,lids:.2,blinks:[1.0,2.8],look:[[0,0,5],[1.4,0,-5]]});driftDust(tl,p,D,50);fade(tl,p,D,.6,.6)}")
S=list(ALL.values())
