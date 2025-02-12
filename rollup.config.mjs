import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'

// TODO: create production build and minify code
export default {
  input: 'src/main.ts',
  output: {
    file: 'main.js',
    format: 'cjs',
  },
  external: ['obsidian', 'React', 'ReactDOM'],
  preserveModules: true,
  plugins: [
    typescript(),
    commonjs(),
    resolve({
      browser: true,
    }),
    postcss({
      plugins: [autoprefixer()],
      extract: 'styles.css',
      minimize: true,
    }),
  ],
}
