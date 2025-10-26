/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  assetPrefix: '/',
  // Indicate that these packages should not be bundled by webpack (server-side only)
  serverExternalPackages: ['sharp',"ollama", 'onnxruntime-node'],
  webpack: (config:any, { isServer }:any) => {
    // Only apply these changes when building for the client.
    if (!isServer) {
      // Tells Webpack not to attempt bundling 'fs' or 'node:fs' on client builds.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // for 'fs'
      };

      // Explicitly ignore .node files
      config.module.rules.push({
        test: /\.node$/,
        use: 'ignore-loader',
      });

      // Alias onnxruntime to onnxruntime-web for browser compatibility
      config.resolve.alias = {
        ...config.resolve.alias,
        onnxruntime: 'onnxruntime-web',
      };
    }

    // Ignore native addon files and onnxruntime-node entirely (server-side only)
    if (isServer) {
      config.externals = [...(config.externals || []), {
        'onnxruntime-node': 'onnxruntime-node',
        'ollama': 'ollama',
        'sharp': 'sharp',
      }];
    }

    return config;
  }
};

module.exports = nextConfig;