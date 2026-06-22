# SK Coder — Android APK Build Guide

Build SK Coder into a native Android APK using Capacitor.

## Prerequisites

- Node.js 18+ and pnpm (`npm i -g pnpm`)
- Android Studio (with Android SDK 33+)
- Java 17+

## Steps

### 1. Install dependencies

```bash
pnpm install
```

### 2. Build the web app

```bash
pnpm run build
```

### 3. Add Capacitor Android platform (first time only)

```bash
npx cap add android
```

### 4. Sync web build into Android

```bash
npx cap sync android
```

### 5. Open in Android Studio

```bash
npx cap open android
```

In Android Studio:
- Wait for Gradle to sync
- Click **Build → Generate Signed Bundle / APK**
- Choose **APK**, follow the wizard to sign and export

### 6. Or run directly on a device/emulator

```bash
npx cap run android
```

## App Details

| Field        | Value                        |
|-------------|------------------------------|
| App ID       | com.saqlainking.skcoder      |
| App Name     | SK Coder                     |
| Author       | Saqlain King                 |
| Min SDK      | Android 7.0 (API 24)        |
| Target SDK   | Android 14 (API 34)         |

## Notes

- The app runs the full SK Coder web IDE inside a native Android WebView.
- Terminal tabs (SK-Shell, Python, Node.js, Java, SK-AI) work via web APIs.
- GitHub and AI features require internet access.
- Puter AI works inside the WebView with no extra configuration.
