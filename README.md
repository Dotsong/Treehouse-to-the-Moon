# Treehouse to the Moon

A slow, dreamy 3D game with no obstacles. Two sisters, June and Pip, tie fifty birthday balloons to their treehouse and float it all the way to the Moon, then drift home at night in time for dinner.

The whole game is a single file, `index.html`. Open it in a browser to play. It loads [three.js r128](https://cdnjs.com/libraries/three.js/r128) and two Google Fonts from the web; everything else, including the music, is generated in the page.

## How to play

- **Lift off!** starts the story. The girls run a pre-flight checklist, untie the mooring rope, and count down.
- **Drag** to look around. **Scroll** or **pinch** to zoom.
- **Pause** with the round button in the top-right corner, or press **P** or the space bar. The round book button under it opens the fact book.
- **Pace** speeds the flight up to 2× or 4×. **Settings** changes the text size and the music, and goes back to the start.
- **Little book tags** float over things in the scene. Tap one to open the fact book and read a science fact. There are 42 to collect, and some only appear while a visitor (birds, a hot-air balloon, the space station, a UFO) is passing. A tag disappears once its fact is in the book.

## What happens on the way

1. **The backyard at sunset.** Fireflies, the old oak, Mom and Dad's house across the lawn.
2. **Up through the sky.** Birds race the treehouse, a little bird sometimes stops on the side railing for Pip's cookie crumbs, a cloud bank swallows the treehouse for a few seconds and a hot-air balloon is waiting on the other side, and two jet planes cross with contrails.
3. **Into space.** The atmosphere layers tick by (troposphere to exosphere), shooting stars streak by, there's a meteor shower, and two friendly UFOs come to wave.
4. **On the Moon.** The treehouse hovers so the rope ladder touches the ground. The space station sails across the black sky overhead. The girls climb down, plant a flag, leave footprints, build moon castles and rock towers, draw pictures in the dust, make moon angels, collect souvenir rocks in a bucket, and play extra-long low-gravity hopscotch. What they do, and in what order, is a little different every time. After a while, Lumi, a real moon girl, peeks out from behind a boulder, ducks back, then walks out and joins their games. When the sisters get hungry, they invite her home for dinner.
5. **Home for dinner.** The trip back happens at night. The town and city lights come on, Mom and Dad wait on the lawn with a lantern, welcome Lumi to Earth, and everyone walks inside for spaghetti.

## Filmed moments and memory

The pre-flight check is its own cutscene: the camera holds on the treehouse, comes in on the girls, travels up to the balloons and down their strings when June asks about them, and waits for Pip to untie the rope before the countdown. The big conversations (meeting Lumi, getting hungry, and the hug on the lawn) are filmed too: the camera eases in, cuts between over-the-shoulder shots at each new line, and everyone turns to look at whoever is speaking. Each sky visitor waits for a lull in the conversation before it arrives.

The game remembers earlier trips: the girls count them, Lumi greets them as old friends, and they sometimes recall a fact they read in the book. Settings → Restart progress forgets all of it.

## Under the hood

- **Rendering:** three.js r128, loaded from cdnjs.
- **Music:** generated live with the Web Audio API: pad chords and a music-box melody all the way, with a flute and harp in the backyard, strings in the sky, glass chimes and a drone in space, a humming choir on the Moon, and harp and strings on the way home. Each place has its own small sounds too: birds and crickets, gusts of wind, faint sparkles in space, frogs and an owl at home.
- **Characters:** June, Pip, Mom and Dad use the detailed models from Trail to the Top (shaped faces, combed hair, pleated dresses, hands with fingers, knees and elbows that bend, mouths that move as they talk), and Lumi has her own: moonlight-white hair with two star-pinned buns and a periwinkle dress scattered with stars. Settings → Characters switches back to the classic models. June and Pip each have a small behavior planner. They walk, lean on the railing, peek over it, go inside, climb the ladder, hop, and take turns so they don't bump into each other.
- **Landscape:** farm fields, forests, a river and lakes are drawn onto a curved patch of the planet. A town, a city and a ring of mountains fill the horizon.
- **Saving:** the facts found, the trip count, the text size, and whether Lumi has been met are kept in your browser's local storage.

## The iPhone and iPad app

The `app/` folder packages the game as an iOS app with Capacitor. It includes three.js and the fonts so the app works offline. See [`app/IOS_CHECKLIST.md`](app/IOS_CHECKLIST.md) for the steps on a Mac, [`app/APP_STORE_LISTING.md`](app/APP_STORE_LISTING.md) for the store text, and [`privacy.html`](privacy.html) for the privacy policy. Rebuild the app's copy of the game with `python3 tools/build-app.py` after changing `index.html`.

