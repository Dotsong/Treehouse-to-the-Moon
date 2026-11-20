# Google Play submission files

Everything the Play Console asks for, ready to upload. The step-by-step guide is `../ANDROID_CHECKLIST.md`.

| Folder | What's in it | Where it goes in Play Console |
|---|---|---|
| `1-Icon-and-Feature-Graphic/` | `Play-Icon-512.png` (512×512), `Feature-Graphic-1024x500.png` | Main store listing → Graphics |
| `2-Screenshots/Phone-1080x1920/` | 10 phone screenshots (9:16) | Main store listing → Phone screenshots (2–8) |
| `2-Screenshots/Tablet-7-inch-1200x1920/` | 10 seven-inch tablet screenshots | Main store listing → 7-inch tablet screenshots (up to 8) |
| `2-Screenshots/Tablet-10-inch-1600x2560/` | 10 ten-inch tablet screenshots | Main store listing → 10-inch tablet screenshots (up to 8) |
| `3-Text/01-App-Name.txt` | Treehouse to the Moon (21 characters, max 30) | Main store listing → App name |
| `3-Text/02-Short-Description.txt` | 80 characters (max 80) | Main store listing → Short description |
| `3-Text/03-Full-Description.txt` | 1,875 characters (max 4,000) | Main store listing → Full description |
| `3-Text/04-Play-Console-Answers.txt` | Every answer for the "Set up your app" tasks | Dashboard → Set up your app |

The Android app icons and splash screens are made from `../assets/` by `npm run android-icons`.
