import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// TODO: toggle production build and minify code
export default {
  input: 'src/main.ts',
  output: {
    file: 'main.js',
    format: 'cjs',
  },
  external: ['obsidian', 'React', 'ReactDOM'],
  plugins: [
    typescript(),
    commonjs(),
    resolve({
      browser: true,
    }),
  ],
}
