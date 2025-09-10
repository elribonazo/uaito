/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      unoptimized: true,
    },
    assetPrefix: '/',
    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
        // Handle ES modules and import.meta
        config.experiments = {
            ...config.experiments,
            topLevelAwait: true,
        };

        // Handle problematic dependencies with ES modules
        config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
            crypto: false,
            stream: false,
            buffer: false,
        };

        // Configure module rules to handle ES modules properly
        config.module.rules.push({
            test: /\.m?js$/,
            type: 'javascript/auto',
            resolve: {
                fullySpecified: false,
            },
        });

        // Use webpack's DefinePlugin to replace import.meta
        config.plugins.push(
            new webpack.DefinePlugin({
                'import.meta': {
                    url: JSON.stringify('file:///')
                }
            })
        );

        return config;
    },
};

module.exports = nextConfig;
