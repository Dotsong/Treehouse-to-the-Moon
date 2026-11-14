# Treehouse to the Moon: App Store submission

Everything App Store Connect asks for, ready to drag or paste in. Built from the game as of November 13, 2026.

## 1-App-Icon

- `AppIcon-1024.png`: 1024 × 1024, no transparency. Drag it into the AppIcon slot in Xcode (`ios/App/App/Assets.xcassets` → AppIcon). App Store Connect takes the icon from the build, so it isn't uploaded separately.

## 2-Screenshots

Ten for each size, in order. App Store Connect → your app → the version page → **Previews and Screenshots**. Drag the folder's contents in; they keep their numbered order.

| Folder | Size | App Store slot |
| --- | --- | --- |
| `iPhone-6.9-inch` | 1320 × 2868 | iPhone 6.9" Display (Apple scales it down for smaller iPhones) |
| `iPad-13-inch` | 2064 × 2752 | iPad 13" Display (scaled down for smaller iPads) |

1. Slowdown Storytime title page
2. The opening storybook card
3. The pre-flight check on the porch ("Rope untied!")
4. A little bird on the railing
5. Out of the cloud: the hot-air balloon
6. Out in space with a friendly UFO
7. Meeting Lumi on the Moon
8. Playing on the Moon
9. The fact book
10. Home for dinner

The two `-overview.jpg` files are contact sheets for a quick look; don't upload them.

## 3-Text

Paste each file into the field of the same name. All fit Apple's limits.

| File | App Store Connect field |
| --- | --- |
| `01-Name.txt` | App Information → Name (30 max) |
| `02-Subtitle.txt` | App Information → Subtitle (30 max) |
| `03-Promotional-Text.txt` | Version → Promotional Text (170 max) |
| `04-Description.txt` | Version → Description |
| `05-Keywords.txt` | Version → Keywords (100 max) |
| `06-Whats-New.txt` | Version → What's New (not needed for the very first version) |
| `07-URLs.txt` | Version → Support URL, and App Privacy → Privacy Policy URL |
| `08-App-Review-Notes.txt` | Version → App Review Information → Notes |
| `09-Categories-and-Ratings.txt` | App Information → Category; Age Rating; App Privacy; Pricing; Copyright |
| `10-privacy-policy.html` | A copy of the privacy page that the Privacy Policy URL points to |

## Before you submit

- Replace `[your contact email]` in `privacy.html` (in the repo root), then turn on GitHub Pages so the Privacy Policy URL works.
- Fill in the copyright line in `09-Categories-and-Ratings.txt`.
- App Review also asks for a contact name, phone and email for the reviewers; those are yours to fill in.
- An App Preview video is optional and isn't included.

The full step-by-step guide is in `../IOS_CHECKLIST.md`.
