# Putting Treehouse to the Moon on Google Play

The Android app is made the same way as the iPhone app: Capacitor wraps the offline game in a full-screen web view. On a Mac you build it in **Android Studio**, which is Google's free equivalent of Xcode. (Visual Studio and VS Code can't build Android apps.)

Everything the Play Console asks for is already prepared in `app/GooglePlaySubmission/`.

The app ID is **`com.michellebrunk.treehousetothemoon`**, the same as on the App Store. On Google Play the app ID can **never be changed** once the first bundle is uploaded, so check it in step 6 before building.

---

## Part A: start these today (they take days)

### 1. Create a Google Play developer account
1. Go to **play.google.com/console/signup** and sign in with the Google account that should own the app.
2. Choose **Personal** (just you) or **Organization** (a registered business, which needs a free D-U-N-S number).
3. Pay the one-time **$25** registration fee.
4. Verify your identity with a government ID, and verify your phone number.
5. Install the **Google Play Console** app on an Android phone or tablet and sign in. New personal accounts are asked to prove they have a real Android device.

Verification can take a few days.

### 2. Line up 12 testers
New **personal** accounts can't publish straight to the public. Google first requires a **closed test with at least 12 testers who stay opted in for 14 days in a row**. Only then can you apply for production. (Organization accounts don't have this rule.)

Start collecting names now. Each tester needs:
- the **Gmail or Google account email** they use on their Android device
- an **Android phone or tablet**

Friends and family are fine. Ask them to install the game when you send the link and keep it installed for the full 14 days.

---

## Part B: build the Android project on your Mac

### 3. Install Android Studio
1. Download it from **developer.android.com/studio** and drag it into Applications.
2. Open it and choose **Standard** setup. It downloads the Android SDK and its own Java, which takes a while.
3. When it reaches the Welcome screen, you can close it.

### 4. Get the latest project
In Terminal:

```bash
cd ~/Treehouse-to-the-Moon
git pull
cd app
npm install
```

### 5. Create the Android project
Still in Terminal, in `~/Treehouse-to-the-Moon/app`:

```bash
npm run build          # makes the offline copy of the game in www/
npx cap add android    # creates the android/ project (one time only)
npm run android-icons  # makes every Android icon and splash size from app/assets/
npm run android        # copies the game in and opens Android Studio
```

Android Studio opens the `android` folder. If it asks whether to **Trust** the project, click Trust. Wait for the progress bar at the bottom ("Gradle sync") to finish. The first sync can take several minutes.

---

## Part C: settings in Android Studio

Use the **Project** panel on the left. If it shows "Android" at the top, that's the right view.

### 6. Check the app ID and version
Open **Gradle Scripts → build.gradle (Module :app)** and check:

```gradle
applicationId "com.michellebrunk.treehousetothemoon"
versionCode 1
versionName "1.0"
```

`versionCode` must go up by 1 for **every** bundle you upload (2, 3, 4…). `versionName` is what people see.

### 7. Check the Android version it targets
Google Play requires new apps to target **Android 16 (API level 36)** or higher. Open **Gradle Scripts → variables.gradle** and check:

```gradle
compileSdkVersion = 36
targetSdkVersion = 36
```

If either number is lower than 36, change it to 36. Then click **Sync Now** in the yellow bar that appears.

### 8. Keep the screen awake and use the full screen
The game is watched without touching the screen, so the tablet shouldn't dim mid-trip. Open **app → java → com.michellebrunk.treehousetothemoon → MainActivity** and replace everything in it with:

```java
package com.michellebrunk.treehousetothemoon;

import android.os.Bundle;
import android.view.WindowManager;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Don't let the screen dim or lock during the trip
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        // Hide the status and navigation bars; a swipe from the edge brings them back
        WindowInsetsControllerCompat bars = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        bars.hide(WindowInsetsCompat.Type.systemBars());
        bars.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }
}
```

### 9. Check the app name
Open **app → res → values → strings.xml**. Both `app_name` and `title_activity_main` should be `Treehouse to the Moon`, with spaces.

### 10. Try it
You can test in either of two ways:
- **On a real Android device:**
  1. On the device, open Settings → About → tap **Build number** 7 times to turn on Developer options.
  2. Go to Developer options and turn on **USB debugging**.
  3. Plug it into the Mac and allow the prompt on the device.
- **On an emulator:** in Android Studio, open **Device Manager** (the phone icon on the right) and click **+** → Create Virtual Device. Pick a tablet such as **Pixel Tablet**, then Next → Finish.

Choose the device in the toolbar at the top, then click the green **▶ Run** button.

Check the same things as on the iPad:
- the title page, the story card and the liftoff
- the Pace button, the ✕ close buttons and the fact book arrows all draw properly
- music plays after the first tap
- the screen doesn't dim
- the app icon and name on the home screen look right
- the device's Back gesture leaves the game

### 11. Save the project
Commit the new `android/` folder to the repo, so these settings are never lost:

```bash
cd ~/Treehouse-to-the-Moon
git add app/android
git commit -m "Android project"
git push
```

---

## Part D: build the bundle for Google Play

### 12. Make a signed app bundle (.aab)
1. In Android Studio, choose **Build → Generate Signed App Bundle or APK…**
2. Choose **Android App Bundle** → Next.
3. Under **Key store path**, click **Create new…** and fill it in:
   - **Key store path:** a new folder outside the project, such as `~/Keystores/treehouse-upload.jks`
   - **Password:** make one up and save it in your password manager
   - **Alias:** `upload`, with its own password (it can be the same one)
   - **Validity:** 25 years or more
   - **Certificate:** your name; the other fields are optional
4. Click OK → Next, choose **release**, then **Create**.
5. When it finishes, click **locate** in the pop-up. The file is `android/app/release/app-release.aab`.

**Back up the `.jks` file and both passwords.** Every future update must be signed with this key. Google keeps the real app-signing key (Play App Signing), so a lost upload key can be reset through support, but that takes days.

---

## Part E: Google Play Console

### 13. Create the app
In **play.google.com/console**, click **Create app**:
- **App name:** Treehouse to the Moon
- **Default language:** English (United States)
- **App or game:** Game
- **Free or paid:** your choice. A free app can never be changed to paid later.
- Tick the two declarations, then click **Create app**.

### 14. Finish "Set up your app"
The Dashboard lists about ten tasks. Every answer is in `GooglePlaySubmission/3-Text/04-Play-Console-Answers.txt`. The tasks are:
- privacy policy
- app access
- ads
- content rating
- target audience
- news
- data safety
- advertising ID
- government
- financial features
- health

### 15. Fill in the store listing
Go to **Grow users → Store presence → Main store listing**:

| Field | File in `GooglePlaySubmission/` |
|---|---|
| App name (30 characters max) | `3-Text/01-App-Name.txt` |
| Short description (80 max) | `3-Text/02-Short-Description.txt` |
| Full description (4,000 max) | `3-Text/03-Full-Description.txt` |
| App icon (512×512) | `1-Icon-and-Feature-Graphic/Play-Icon-512.png` |
| Feature graphic (1024×500) | `1-Icon-and-Feature-Graphic/Feature-Graphic-1024x500.png` |
| Phone screenshots | `2-Screenshots/Phone-1080x1920/` |
| 7-inch tablet screenshots | `2-Screenshots/Tablet-7-inch-1200x1920/` |
| 10-inch tablet screenshots | `2-Screenshots/Tablet-10-inch-1600x2560/` |

Each screenshot section takes up to 8 images, so pick your favourite 8 of the 10. Click **Save**.

### 16. Run the closed test (personal accounts)
1. Go to **Test and release → Testing → Closed testing** and click **Create track**, or use the ready-made **Closed testing – Alpha** track.
2. **Testers** tab: **Create email list**, name it, and paste the 12+ testers' Google account emails. Save, and tick the list.
3. **Countries/regions:** add the countries your testers are in.
4. **Create new release:**
   - Upload `app-release.aab`.
   - Release name: `1 (1.0)`.
   - Release notes: `The first trip to the Moon!`
5. Click **Next** → **Save** → **Send for review** (or **Start rollout to Closed testing**). The first review can take a few days.
6. Once it's approved, go back to the **Testers** tab, copy the **opt-in link**, and send it to your testers. Each one must open it on their Android device, tap **Become a tester**, then install the game from Play.
7. Wait **14 days** with at least 12 testers still opted in. The Dashboard shows the count.

### 17. Apply for production
After the 14 days, the Dashboard shows **Apply for production**. Google asks a few questions about the test, such as how you recruited testers, what feedback you got and what you changed. Answer honestly in a sentence or two each. The decision usually takes up to a week.

### 18. Release to everyone
1. Go to **Test and release → Production** → **Countries/regions**, and add where it should be sold.
2. Click **Create new release**. Choose **Add from library** and pick the same bundle (version code 1). Use the same release notes.
3. Click **Next** → **Save** → **Send for review**.

After review it goes live, and you can pick **Managed publishing** if you'd rather press the final button yourself.

---

## Updating the app later
1. Change the game, then in `~/Treehouse-to-the-Moon/app` run `npm run android`.
2. Raise **versionCode** by 1 (and versionName if you like) in `build.gradle (Module :app)`.
3. Run **Build → Generate Signed App Bundle** with the same keystore.
4. In Play Console, go to **Production → Create new release**, upload the new bundle and roll it out.
