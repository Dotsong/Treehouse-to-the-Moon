# Handoff: building a new June & Pip game from Treehouse to the Moon

This guide is for a new session that wants to make another game with June and Pip, reusing as much of *Treehouse to the Moon* as makes sense. Read this first, then open `index.html`.

## The short version

- The whole game is one file, `index.html` (about 2,400 lines). The HTML and CSS come first, then one big script in a single closure.
- 3D uses **three.js r128**, loaded from `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`. It uses the r128 API (no ES modules, no newer APIs).
- Everything else is hand-written: the music, characters, textures and landscape. There are no image or audio files.
- It runs as a claude.ai artifact and as a static page (GitHub Pages works).
- `tools/smoke-test.js` loads the page with a stand-in for three.js, clicks through the start, the fact book and Good Night, and fails on any script error. Run it after every change: `node tools/smoke-test.js`.

## The cast

| Who | Look | Personality and voice |
| --- | --- | --- |
| **June** | Older sister, scale 1.3. Brown pigtails with yellow ribbons, coral dress. | The captain. Runs checklists and invites people along. "Okay, Pip. Final check before liftoff!" |
| **Pip** | Little sister, scale 1.08. Orange hair in a bun with a blue ribbon, lavender dress. Goes up on tiptoe at the railing. | Funny and eager. Notices things first. "June... that rock just giggled." |
| **Lumi** | The real moon girl, scale 1.16. Silvery-white bun, pale lavender skin, a soft glow and a star clip. | Shy, then delighted by Earth things she has never seen. "What's a jacket?" "What's raining?" |
| **Mom** | Long brown hair, rose dress. | Warm and practical. "Now, all three of you, go wash your hands!" |
| **Dad** | Orange hair, glasses, blue shirt. Carries a lantern at night. | Dry jokes. "Nobody run with spaghetti hands." |
| **Michelle** | The sisters' best friend next door. Never seen on screen. | LOVES spaghetti. The girls can't wait to tell her everything. Mention her now and then, not constantly. |

Story tone: a calm, cozy, no-obstacles "vibe" game. Nothing chases anyone, and nobody can lose.

## Map of `index.html`

Search for these section comments (`/* ---------- ... */`). They appear in this order:

| Section | What's there | How reusable |
| --- | --- | --- |
| CSS `:root` tokens | Palette, character colors, the Young Serif / Quicksand / Patrick Hand fonts, storybook paper | High: keep the look |
| `renderer & scene` | Renderer, shadows (PCF soft, 2048 map), resize | High |
| `sky dome` | Gradient sky shader plus day (`SKY`) and night (`SKY_N`) color keys, blended by `nightK` | High |
| `alphaTex` / `spriteTex` | Soft round textures drawn pixel by pixel (see gotchas) | High |
| `Earth` / `Moon` | Planet sphere, Moon with craters, landing frame (`qEnd`), Moon halo | Medium |
| `backyard` | Oak, lawn tufts and flowers, fence, family house with porch and windows | High if the game starts at home |
| `the world below` | Curved ground map (fields, forests, river, lakes, roads), instanced trees, hills, mountain ring, town, city, night lights | High for any outdoor scene |
| `the treehouse` | Walls with real window and door openings, interior, porch, lantern, firefly jar, rope ladder | High |
| `the sisters` | `makeGirl(opts)`: the rigged character used for everyone, including adults via `makeAdult` | **Core** |
| `what the sisters get up to` | The behavior "brain": zones, routing, poses, activities | **Core** |
| moon activities | Castles, souvenir rocks and bucket, hopscotch, dust drawings, moon angels, rock towers, `pickMoonAct` | Patterns are reusable |
| `music: generated live` | `Music` (Web Audio): pads, music-box melody, wind, `sfx('chirp' / 'ufo')`, iPad unlock | **Core** |
| `state & UI` | Story card, pace and music buttons, `flyAgain(toStart)` | Medium |
| `camera controls` | Drag to orbit, pinch or scroll to zoom | High |
| `speech bubbles` | The one-bubble-at-a-time speech queue | **Core** |
| `homecoming` | Parents, the return-trip curve, arrival and dinner scenes | Patterns are reusable |
| `sky events` | Birds, planes, UFOs, meteor shower, cloud bank; event list keyed to progress | Medium |
| `the fact book` | `FACTS`, `ART` (SVG pictures), contents page, book tags over the scene (`MARKDEFS`) | **Core** |
| `final check before liftoff` | `PREP` timeline: a time-coded list of beats | Pattern is reusable |
| `Lumi` | A staged story arc (stages 0 to 5) driven by time on the Moon | Pattern is reusable |
| `loop` | `frame()`: progress, transforms, sky, camera, tags, bubbles, render | Adapt |

## Core systems and how to use them

### Characters: `makeGirl(opts)`
Returns `{g, legs, upper, head, eyes, tails, dress, armL, armR, scale}`. The rig is root, then hip pivots for the legs, then a waist pivot (`upper`), then a neck pivot (`head`) and shoulder pivots (arms). Options are `dress, hair, skin, legs, ribbon, style ('pigtails' | 'bun' | 'mom' | 'dad'), scale`. `makeAdult` lengthens the legs and slims the dress for grown-ups.

### Behavior brains: `makeBrain(girl, opts)`
Each girl has a brain with `pos` (x, z in **treehouse-local** coordinates), `y`, `zone` (`'deck' | 'ladder' | 'ground'`), a `queue` of steps, and `hold` (a pose to idle in during scripted moments).

- **Steps:** `{k:'walk', path:[[x,z],...]}`, `{k:'pose', pose, dur, face}`, `{k:'climb', dir:±1, dur}`, `{k:'hops', pts, face}`, `{k:'say', text}`, `{k:'release'}`.
- **Routing:** `stepsTo(from, fromZone, to)` returns the steps to get anywhere: around the porch, through the door, and up or down the ladder. `goTo(b, p, pose, dur, face)` uses it.
- **Poses** (set in `rigTarget`): idle, lean, peek, wave, look, hop, moonhop, spin, doorpeek, inside, scoop, flag, climb, build, pickup, drop, draw, angel, hug, shy, hopscotch.
- **Rig values:** `tilt, lsp, lean, side, drop, rootY, hx, hy, hz, lax, laz, rax, raz, llx, lrx`. Each frame they ease toward their targets.
- **Getting along:** girls wait for anyone in their path. After 5 seconds of being stuck they step through, so nothing can deadlock. Only one girl uses the ladder at a time. `free(b, p)` keeps spots apart.
- **Scripted moments:** `together(seq, xs)` lines everyone up at the railing. `goPose` and `setPose` in the prep section move and hold one girl.
- `ALL` / `ACTIVE()` cover June, Pip and Lumi. `BRAINS` is just the sisters, who are paired with Mom and Dad at home.

### Speech: one bubble at a time
- Speaker indices: **0 June, 1 Pip, 2 Mom, 3 Dad, 4 Lumi**.
- Functions:
  - `say(i, text)` queues one line.
  - `speak(line, i)` queues a line, or a `[a, b]` pair where the other sister answers.
  - `playScript([[who, text], ...])` replaces the queue with a scene.
  - `announce(line)` queues an event reaction after the current speaker finishes.
  - `hushBubbles()` clears everything.
- `quiet()` is true when nobody is speaking. Each line stays up `1.6 + 0.06 × characters` seconds, with a 0.45-second gap.
- Random chatter pulls from `LINES[phase]` (keyed by trip stage), `POSE_LINES[pose]`, and Lumi's `LUMI_MOON` / `LUMI_TRIP`. `nextLine(key, list)` shuffles so nothing repeats until the list is used up.

### Fact book
- Add a fact with `F(label, kicker, tint, art, title, body, extra)` in `FACTS`. `ART` holds small SVG pictures (120×120, clipped to a circle).
- Add a tag in the scene with a `MARKDEFS` entry `{k, at:(out, u, starA) => 'w' | 'n' | false}`. Return `'w'` for a world position or `'n'` for a fixed screen position. Static tags should come before moving ones in the list, because they win when two overlap.
- New facts pulse with a gold dot; ones you've read are greyed out. The contents page lists everything, with unfound pages blanked out. Found facts are saved in `localStorage` (`treehouse-facts`). Use a new key for a new game.

### Music
- `Music.start()` runs once (guarded). `Music.unlock()` runs on the first touch, click or key: it resumes the audio, plays a silent `<audio>` loop so the iPad mute switch doesn't silence the game, and sets `navigator.audioSession`.
- `Music.toggle()` turns music on and off. `Music.sfx('chirp' | 'ufo')` plays a sound effect.
- Chords live in `CHORDS`, the melody scale in `SCALE`, and the beat length in `BEAT`. Melody density follows the trip stage.

### Storybook UI
The opening card (`.story`), the Moon card, the finale card, the pause button, the countdown, the fact book and the speech bubbles all share the paper-and-ink tokens. The cards are HTML on top of the canvas. They don't need any 3D.

## Hard-won lessons

1. **Declaration order matters.** The script is one closure full of `const` and `let`. Anything that runs during setup (building objects, placing pebbles) must not use a variable declared later in the file. That caused a crash where "Lift off!" did nothing. Code that only runs inside `frame()` or click handlers can refer to anything.
2. **Update positions before projecting to the screen.** Call `scene.updateMatrixWorld()` and `camera.updateMatrixWorld()` before placing HTML over 3D objects, and place speech bubbles and tags *after* the camera moves. Otherwise they lag and jitter, worst at 2× and 4× pace.
3. **Never use canvas gradients for see-through textures.** iPad Safari dithers them, and the noise shows up as colored specks. Use `alphaTex(size, fn)`, which writes pure-white pixels where only the alpha changes.
4. **Keep solid things non-transparent.** Clouds were `transparent: true`, which let stars and lights show through on some GPUs. Only switch to transparent while fading.
5. **InstancedMesh needs `frustumCulled = false`.** Its bounding sphere is the base shape at the origin, so the whole group vanishes when the origin goes off screen.
6. **Avoid z-fighting.** Two faces at the same height flicker. Push one slightly below the other, as with the treehouse floor.
7. **Camera-facing glow sprites look like ghost copies up close.** Keep halos small and fade them out with distance.
8. **Speech can't overlap.** Two bubbles at once looked messy. The queue fixes that, and event lines wait their turn.
9. **Characters can deadlock** when several girls line up at the railing. Route across the middle of the porch, and let a stuck girl step through after 5 seconds.
10. **Artifact limits:** scripts only from cdnjs and a few other CDNs, styles only from Google Fonts, everything else inline or as `data:` URIs. No sound until the person interacts. The `<title>` is the artifact's name.
11. **iPad:** detect it with `/iPad/` in the user agent, or `MacIntel` plus `maxTouchPoints > 1`. Block `gesturestart` and double-tap zoom. Use `touch-action: manipulation` on buttons and `none` on the canvas.

## Testing without a GPU

- `tools/three-stub.js` is a permissive stand-in for three.js. Every property and call returns another stand-in, so the page's own logic runs in a headless browser.
- `tools/smoke-test.js` uses it to catch setup crashes and broken buttons.
- For behavior, it worked well to pull the brain code out of `index.html` and run it in Node with small stand-ins. That covers minutes of play, checking that girls never overlap, never get stuck, and finish scripted scenes. Many bugs in this game were caught that way before anyone saw them.

## A prompt to start the new session

> I'm making a new June & Pip game. Start by reading `HANDOFF.md` and `index.html` in the Dotsong/Treehouse-to-the-Moon repo. Reuse the character rig, behavior brains, speech-bubble queue, storybook UI, fact book, music and testing tools from it. The new game is: [describe the idea]. Keep the same cozy, no-obstacles feel and the same characters (June, Pip, Mom, Dad, Lumi and their friend Michelle). Build it as a single HTML artifact like the first game, and run `tools/smoke-test.js` after each change.
