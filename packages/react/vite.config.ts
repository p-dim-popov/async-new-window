import makeConfig from '@local/vite-lib-config'

export default makeConfig({
  dirname: __dirname,
  externals: ['react', 'react-dom'],
})
