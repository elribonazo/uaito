import esbuild from 'esbuild';
import { globPlugin } from 'esbuild-plugin-glob';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

esbuild.build({
  entryPoints: ['src/index.ts'],
  outdir: 'build',
  bundle: true,
  sourcemap: true,
  splitting: false,
  format: 'cjs',
  target: ['esnext'],
  platform: 'neutral',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  plugins: [
    globPlugin(),
    nodeExternalsPlugin()
  ],
  external: [
    'react',
    'react-dom',
    "ollama",
    "onnxruntime-node",
    "@huggingface/transformers"
  ]
})
.then(() => {
  console.log('Build complete');
  return esbuild.build({
    entryPoints: ['src/cli.ts'],
    outdir: 'build',
    bundle: true,
    sourcemap: true,
    splitting: false,
    format: 'cjs',
    target: ['esnext'],
    platform: 'node',
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    plugins: [
      globPlugin(),
      nodeExternalsPlugin()
    ],
    external: [
      'react',
      'react-dom',
      "ollama",
      "onnxruntime-node",
      "@huggingface/transformers"
    ]
  })
})
.catch(() => process.exit(1));