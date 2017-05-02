module.exports = {
  navigateFallback: '/index.html',
  stripPrefix: 'dist/app',
  root: 'dist/app',
  staticFileGlobs: [
    'dist/app/index.html',
    'dist/app/**.js',
    'dist/app/**.css'
  ]
}