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
             test: /\.css$/i,
             use: ['style-loader', 'css-loader']
          },
          {
             test: /\.scss$/i,
             use: ['style-loader', 'css-loader', 'sass-loader']
          },
          {
            test: /.(png|jpg|gif)$/i,
            use: 'url-loader'
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