// Public SDK facts from /docs/sdks/, observed 2026-10-25. Verification is scoped below, not a production certification.
export const sdkStatuses = [
  {
    "platform": "web",
    "label": "Web",
    "status": "verified",
    "version": "0.1.0",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-web-0.1.0.tgz",
    "install": "npm install https://appside.build/docs/downloads/sdks/appside-web-0.1.0.tgz",
    "verification": "Unit tests and real-browser journey.",
    "source": "https://appside.build/docs/sdks/"
  },
  {
    "platform": "node",
    "label": "Node",
    "status": "verified",
    "version": "0.1.1",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-node-0.1.1.tgz",
    "install": "npm install https://appside.build/docs/downloads/sdks/appside-node-0.1.1.tgz",
    "verification": "Unit tests and getOrder matched signed webhook in browser E2E.",
    "source": "https://appside.build/docs/sdks/"
  },
  {
    "platform": "python",
    "label": "Python",
    "status": "verified",
    "version": "0.1.1",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-python-0.1.1.tar.gz",
    "install": "pip install https://appside.build/docs/downloads/sdks/appside-python-0.1.1.tar.gz",
    "verification": "Unit tests for ES256, webhook tamper/age rejection and getOrder.",
    "source": "https://appside.build/docs/sdks/"
  },
  {
    "platform": "android",
    "label": "Android",
    "status": "built",
    "version": "0.1.0",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-android-0.1.0.aar",
    "install": "Download the AAR to app/libs/; add implementation(files(\"libs/appside-android-0.1.0.aar\")) and implementation(\"androidx.browser:browser:1.8.0\")",
    "verification": "Gradle release AAR and 12 JUnit tests; on-device integration not yet verified.",
    "source": "https://appside.build/docs/sdks/",
    "sourceDownloadUrl": "https://appside.build/docs/downloads/sdks/appside-android-source-0.1.0.tar.gz"
  },
  {
    "platform": "ios",
    "label": "iOS",
    "status": "preview",
    "version": "0.1.0",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-ios-0.1.0.tar.gz",
    "install": "Unpack; in Xcode choose File > Add Package Dependencies > Add Local > AppsideSDK",
    "verification": "Core compiled and smoke-tested; swift test and iOS UI build not yet verified.",
    "source": "https://appside.build/docs/sdks/"
  },
  {
    "platform": "flutter",
    "label": "Flutter",
    "status": "preview",
    "version": "0.1.0",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-flutter-0.1.0.tar.gz",
    "install": "Unpack next to your app; add appside: {path: ../appside} under dependencies in pubspec.yaml",
    "verification": "Analyze clean and 12 tests; native device host not yet verified.",
    "source": "https://appside.build/docs/sdks/"
  },
  {
    "platform": "react-native",
    "label": "React Native",
    "status": "preview",
    "version": "0.1.0",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-react-native-0.1.0.tgz",
    "install": "npm install https://appside.build/docs/downloads/sdks/appside-react-native-0.1.0.tgz",
    "verification": "JS bridge tests; native host is source only.",
    "source": "https://appside.build/docs/sdks/"
  },
  {
    "platform": "unity",
    "label": "Unity",
    "status": "preview",
    "version": "0.1.0",
    "mode": "test",
    "downloadUrl": "https://appside.build/docs/downloads/sdks/appside-unity-0.1.0.tgz",
    "install": "Download the tarball; Unity > Window > Package Manager > + > Add package from tarball",
    "verification": "Source only; not compiled in Unity.",
    "source": "https://appside.build/docs/sdks/"
  }
];
