// forge.config.js
module.exports = {
    packagerConfig: {
      osxSign: {
        identity: process.env.IDENTITY,
        "hardened-runtime": true,
        entitlements: ".release/entitlements.mac.plist",
        "entitlements-inherit": ".release/entitlements.mac.plist",
        "signature-flags": "library"
      },
      osxNotarize: {
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD,
        appBundleId: process.env.BUNDLEID
      }
    },
    makers: [
      {
        name: "@electron-forge/maker-zip",
        platforms: ["darwin"]
      }
    ]
  };