/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // Indicate that these packages should not be bundled by webpack
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
    }

    // Ignore native addon files and onnxruntime-node entirely
    config.externals = [...(config.externals || []), {
      'onnxruntime-node': 'onnxruntime-node',
      'ollama': 'ollama',
      'sharp': 'sharp',
    }];

    return config;
  }
};

module.exports = nextConfig;