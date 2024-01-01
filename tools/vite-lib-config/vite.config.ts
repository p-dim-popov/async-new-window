import makeConfig from './src'

export default makeConfig({
  dirname: __dirname,
  externals: ["vite", "path", "vite-plugin-dts"],
})
