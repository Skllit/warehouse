module.exports = {
  webpack: {
    configure: {
      output: {
        hotUpdateChunkFilename: '[id].[hash].hot-update.js',
        hotUpdateMainFilename: '[runtime].[hash].hot-update.json',
      },
    },
  },
}; 