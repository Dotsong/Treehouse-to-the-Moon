# Putting Treehouse to the Moon on the App Store

This folder turns the game into an iPhone and iPad app with [Capacitor](https://capacitorjs.com). The app shows the game full-screen in a built-in web view, with three.js and the fonts bundled inside, so it works without an internet connection.

You'll need:

- **A Mac** with **Xcode** (free from the Mac App Store).
- **Node.js** (the LTS version from [nodejs.org](https://nodejs.org)).
- An **Apple Developer Program** membership. It's a yearly fee; check [developer.apple.com](https://developer.apple.com/programs/) for the current price.

Steps 1–4 happen once. After that, updating the app is step 8.

## 1. Get the project onto your Mac

```bash
git clone https://github.com/Dotsong/Treehouse-to-the-Moon.git
cd Treehouse-to-the-Moon/app
npm install
```

## 2. Build the offline game and create the iOS project

```bash
npm run build        # copies ../index.html into www/, pointed at the bundled files
npx cap add ios      # creates the ios/ Xcode project (one time only)
npm run ios          # syncs the game into the project and opens Xcode
```

If `npx cap add ios` asks for CocoaPods, install it with `brew install cocoapods` (or `sudo gem install cocoapods`) and run the command again.

Commit the new `ios/` folder to the repo, so the Xcode settings below are saved.

## 3. Set up the app in Xcode

In the left sidebar, click **App** (the blue project icon), then the **App** target:

- **Signing & Capabilities**
  - **Team:** choose your Apple Developer account.
  - **Bundle Identifier:** `com.dotsong.treehousetothemoon`, or your own reverse-domain ID. If you change it, change `appId` in `capacitor.config.json` to match.
- **General**
  - **Display Name:** Treehouse to the Moon.
  - **Supported Destinations:** iPhone and iPad.
  - **Device Orientation:** leave all orientations on. The game adapts to any shape, and iPad multitasking needs them.
  - **Version** 1.0.0, **Build** 1.
- **Info** (or `ios/App/App/Info.plist`): add
  - `Status bar is initially hidden` = `YES`
  - `View controller-based status bar appearance` = `NO`
- **Keep the screen awake during the flight.** The game is meant to be watched without touching it, so stop iPads from dimming and locking mid-trip. Open `ios/App/App/AppDelegate.swift` and add one line inside `application(_:didFinishLaunchingWithOptions:)`, before `return true`:

  ```swift
  UIApplication.shared.isIdleTimerDisabled = true
  ```

## 4. App icon and launch screen

- **Icon:** open `ios/App/App/Assets.xcassets`, then **AppIcon**. Drag `icon/AppIcon-1024.png` from this folder into the 1024×1024 slot. Recent Xcode versions make every other size from it.
- **Launch screen:** open `ios/App/App/Base.lproj/LaunchScreen.storyboard`, select the view, and set its **Background** color to **#0E0D2A** (the game's night blue). That way the app doesn't flash white while it starts.

## 5. Try it

- Pick an **iPad simulator** at the top of Xcode and press **Run** (▶).
- Then plug in a real iPad or iPhone, pick it as the destination, and run it there too. Check:
  - **Sound:** music starts on the first tap, and it plays with the mute switch on.
  - **No zooming:** double-tapping and pinching don't zoom the page; pinching the scene zooms the camera.
  - **Offline:** turn on **Airplane Mode** and relaunch. Everything should still work.
  - **Screen stays on:** the screen doesn't lock during a long flight.

## 6. Create the app in App Store Connect

At [appstoreconnect.apple.com](https://appstoreconnect.apple.com), go to **Apps**, then **+** and **New App**:

- **Platform:** iOS. **Name:** Treehouse to the Moon. **Bundle ID:** the one from step 3. **SKU:** anything unique, for example `treehouse-moon-1`.
- Fill in the listing from `APP_STORE_LISTING.md`: subtitle, description, keywords and categories.
- **Privacy Policy URL:** turn on GitHub Pages for the repo (**Settings → Pages →** branch `main`, folder `/`). The policy will then be at `https://dotsong.github.io/Treehouse-to-the-Moon/privacy.html`. **First, replace the contact placeholder in `privacy.html` with a real email address.**
- **App Privacy:** answer **"Data Not Collected"**. The game has no accounts, ads, analytics or tracking. The only thing it saves is which facts you've found, and that stays on the device.
- **Age rating:** answer **None** to everything, which gives **4+**.
- **Kids category (optional):** listing it under **Kids** (age band 6–8 suits it) adds extra review checks: no ads, no third-party analytics, and a grown-up check before any outside link. The game already meets those, since it has no outside links at all.
- **Screenshots:** ready-made ones are in `screenshots/`: eight at **1320×2868** for the 6.9-inch iPhone slot and eight at **2064×2752** for the 13-inch iPad slot. Drag them in, in order. If Apple asks for other sizes later, use **File → Save Screen** (⌘S) in the simulator.

## 7. Upload and submit

1. In Xcode, set the destination to **Any iOS Device (arm64)**.
2. **Product → Archive.**
3. In the Organizer window, choose **Distribute App**, then **App Store Connect**, then **Upload**.
4. After a few minutes the build appears in App Store Connect. Try it yourself first through **TestFlight** if you like.
5. On the app's version page, pick the build and press **Add for Review**, then **Submit**.

Apple's review usually takes a day or two. If they ask questions, answer in App Store Connect.

## 8. Updating the app later

Whenever `index.html` changes:

```bash
cd app
npm run sync         # rebuilds www/ and copies it into the iOS project
npx cap open ios
```

Then bump the **Build** number (and the **Version**, for a visible update), archive, and upload as in step 7.

## What's in this folder

| File | What it is |
| --- | --- |
| `package.json` | Capacitor dependencies and the `build` / `sync` / `ios` commands |
| `capacitor.config.json` | App ID, name, background color, web-view settings |
| `vendor-files/` | three.js r128 and the three fonts, with their licenses (MIT and SIL OFL) |
| `www/` | The built, offline game, regenerated by `npm run build` (don't edit it by hand) |
| `icon/` | `AppIcon-1024.png` and the `icon.svg` it was drawn from |
| `APP_STORE_LISTING.md` | Ready-to-paste App Store text |
