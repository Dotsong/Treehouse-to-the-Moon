# Treehouse to the Moon

A slow, dreamy 3D game with no obstacles. Two sisters, June and Pip, tie fifty birthday balloons to their treehouse and float it all the way to the Moon, then drift home at night in time for dinner.

The whole game is a single file, `index.html`. Open it in a browser to play. It loads [three.js r128](https://cdnjs.com/libraries/three.js/r128) and two Google Fonts from the web; everything else, including the music, is generated in the page.

## How to play

- **Lift off!** starts the story. The girls run a pre-flight checklist, untie the mooring rope, and count down.
- **Drag** to look around. **Scroll** or **pinch** to zoom.
- **Pause** with the round button in the top-right corner, or press **P** or the space bar.
- **Pace** speeds the flight up to 2× or 4×.
- **Little book tags** float over things in the scene. Tap one to open the fact book and read a science fact. There are 27 to collect.

## What happens on the way

1. **The backyard at sunset.** Fireflies, the old oak, Mom and Dad's house across the lawn.
2. **Up through the sky.** Birds fly past and circle the treehouse, a cloud bank swallows it for a few seconds, and two jet planes cross with contrails.
3. **Into space.** The atmosphere layers tick by (troposphere to exosphere), shooting stars streak past, there's a meteor shower, and two friendly UFOs come to wave.
4. **On the Moon.** The treehouse hovers so the rope ladder touches the ground. The girls climb down, plant a flag, leave footprints, build moon castles, collect souvenir rocks in a bucket, and play extra-long low-gravity hopscotch. After a while, Lumi, a real moon girl, peeks out from behind a boulder and joins their games. When the sisters get hungry, they invite her home for dinner.
5. **Home for dinner.** The trip back happens at night. The town and city lights come on, Mom and Dad wait on the lawn with a lantern, welcome Lumi to Earth, and everyone walks inside for spaghetti.

## Under the hood

- **Rendering:** three.js r128, loaded from cdnjs.
- **Music:** generated live with the Web Audio API: pad chords, a music-box melody, wind, bird chirps and a UFO whistle.
- **Characters:** June and Pip each have a small behavior planner. They walk, lean on the railing, peek over it, go inside, climb the ladder, hop, and take turns so they don't bump into each other.
- **Landscape:** farm fields, forests, a river and lakes are drawn onto a curved patch of the planet. A town, a city and a ring of mountains fill the horizon.
- **Saving:** the fact book remembers the facts you've found in your browser's local storage.
