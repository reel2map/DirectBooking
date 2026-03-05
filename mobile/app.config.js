require('dotenv').config();

module.exports = {
  expo: {
    name: "DirectBooking",
    slug: "directbooking",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#0F4C5C",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.directbooking.app",
    },
    android: {
      package: "com.directbooking.app",
      adaptiveIcon: {
        backgroundColor: "#0F4C5C",
        foregroundImage: "./assets/android-icon-foreground.png",
        backgroundImage: "./assets/android-icon-background.png",
        monochromeImage: "./assets/android-icon-monochrome.png",
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    plugins: ["expo-image-picker", "expo-document-picker"],
    newArchEnabled: false,
    extra: {
      claudeApiKey: process.env.EXPO_PUBLIC_CLAUDE_API_KEY,
    },
  },
};
