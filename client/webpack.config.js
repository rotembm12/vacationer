module.exports = {
    mode: 'development',
    entry: ['@babel/polyfill', './src/index.js'],
    module: {
       rules: [
          {
             test: /\.(js|jsx)$/,
             exclude: /(node_modules)/,
             use: {
                loader: 'babel-loader',
                options: {
                   presets: ['@babel/preset-env']
                }
             }
          },
          {
             test: /\.scss$/i,
             use: ['style-loader', 'css-loader', 'sass-loader']
          }
       ]
    },
    resolve: {
       extensions: ['*', '.js']
    },
    output: {
       path: __dirname + '/dist',
       publicPath: '/',
       filename: 'bundle.js'
    },
    devServer: {
       contentBase: './dist'
    }
 };