import createConfig from '@uaito/build';

export default createConfig({
  format:[ 'cjs'],
  entry: ['src/cli.ts'],
  external: ['yargs'],
});
