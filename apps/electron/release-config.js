module.exports = {
  appId: process.env.BUNDLEID,
  asar: true,
  asarUnpack: [
    "**/node_modules/sharp/**/*",
    "**/node_modules/@img/**/*",
    "**/node_modules/canvas/**/*"
  ],
  files: [
    "main",
    "renderer/out"
  ],
  dmg: {
    sign: false
  },
  mac: {
    category: "public.app-category.productivity",
    entitlements: ".release/entitlements.mac.plist",
    entitlementsInherit: ".release/entitlements.mac.plist",
    hardenedRuntime: true,
    gatekeeperAssess: false,
    target: [
      "zip"
    ],
    icon: "./UAITO.icns",
    notarize: {
      teamId: process.env.APPLE_TEAM_ID,
    }
  },
  win: {
    target: [
      "nsis"
    ],
    icon: "./UAITO.ico",
    "extraResources": [
      {
        "from": "node_modules/sharp",
        "to": "sharp",
        "filter": ["**/*"]
      }
    ]
  },
  linux: {
    target: [
      "AppImage",
      "deb"
    ],
    category: "Productivity",
    icon: "./UAITO.png"
  },
  directories: {
    output: "dist"
  },
  publish: {
    provider: 'github',
    owner: 'uaito',
    repo: 'releases'
  }
};