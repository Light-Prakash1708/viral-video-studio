# Next videos: topic research and plan (measured Nov 9, 2026 with the YouTube Data API)

## What the data says (median views of the top 15 Shorts for each search / channel)
| Search / channel | Median of top 15 | Top Short | Takeaway |
|---|---|---|---|
| Zack D. Films (3D "how it works" + surprising fact) | 86M | 128M | the hottest format |
| Professor of How (3D "what happens inside", Hindi + English) | 60M | 190M | Indian creator, 3D mechanism |
| "invented by accident" | 24.5M | 108M | invention stories are a goldmine |
| "biggest scam in history" | 6.9M | 75M | scams work when framed as a scam story |
| "ponzi scheme story" | 2.0M | 16M | |
| "history of condom" | 1.25M | 131M (microscope clip) | huge curiosity, monetisation risk |
| "invention of airbag" | 0.41M | 36M (new airbag gadgets) | NO origin-story Short ranks: open gap |
| "charles ponzi" | 0.14M | 3.0M | don't lead with the name |
| "named after a person" | 0.04M | 2.5M | word origins alone don't get searched |
| "dark history of everyday things" | ~0 | 1.2M | saturated, avoid |

## Our angle (what nobody else does)
3D mechanism like Professor of How / Zack D. Films ("what happens inside, in slow motion")
+ Segment Zero storytelling (hook with a number → story → "You see, think about the last time…" → twist / callback ending)
+ India + global angle, one-word captions, orchestral score that follows the story, a recurring series opener.

## Order to make
1. **Airbags**: hook "An airbag has 30 milliseconds to save your life. Faster than a blink." Story: John Hetrick's 1952 near-crash with his wife and daughter; carmakers ignored it for decades; the real problem was a fast enough sensor. 3D slow-mo: crash sensor → chemical ignition → nitrogen fills the bag.
2. **Ponzi (as a scam story)**: hook "He paid every investor on time… with their own money." Postal reply coupons, 50% in 45 days, $15 million in eight months, one journalist did the math. Last line: "And that's why every scam like it still carries his name."
3. **Elevators**: Elisha Otis cut his own elevator rope in front of a crowd in 1854; how the safety brake works.
4. **Seatbelts**: how one locks (a pendulum) and why Volvo gave the patent away free.
5. **Shampoo (India angle)**: the word comes from Hindi "chāmpo"; Sake Dean Mahomed made it famous in England.
6. **Condoms** (later, educational, objects only): Fallopio's 1564 linen sheath → Goodyear's vulcanised rubber → latex; "how they're made and tested" 3D angle.

## More series topics ("the story + the mechanism")
Black box (how it survives a crash) · UPI (how a payment moves in 2 seconds) · Mumbai dabbawalas (how they almost never lose a box) · ATM fake-note detection · Parachute (the inventor who jumped from the Eiffel Tower) · Coca-Cola's secret recipe · microwave (melted chocolate bar) · potato chips (invented out of spite) · Velcro · pacemaker · penicillin · Post-it.

## Re-run the research any time
`python3 ~/.claude/skills/viral-video-studio/tools/yt_research.py "topic one" "topic two"` (needs the YouTube API key saved as a network secret: host www.googleapis.com, header X-Goog-Api-Key, no prefix).
