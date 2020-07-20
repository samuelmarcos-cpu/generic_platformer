module.exports = {
  entry: {
    game: './src/app.ts'
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/public'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devServer: {
    compress: true,
    port: process.env.PORT || 1234
  }
}
