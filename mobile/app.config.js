export default {
  expo: {
    name: "ExchangeCurrencyApp",
    slug: "exchangecurrencyapp",
    version: "1.0.0",
    sdkVersion: "54.0.0",
    orientation: "portrait",
    userInterfaceStyle: "light",
    splash: {
      resizeMode: "contain",
      backgroundColor: "#f0f9ff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.exchangecurrencyapp.mobile"
    },
    android: {
      usesCleartextTraffic: true,
      adaptiveIcon: {
        backgroundColor: "#f0f9ff"
      },
      package: "com.exchangecurrencyapp.mobile"
    },
    scheme: "exchangecurrencyapp"
  }
};

