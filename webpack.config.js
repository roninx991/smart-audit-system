const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    app: './app/scripts/index.js',
    accountant: './app/scripts/accountant.js',
    client: './app/scripts/client.js',
    card: './app/scripts/card.js',
  },
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js'
  },
  plugins: [
    // Copy our app's index.html to the build folder.
    new HtmlWebpackPlugin({ 
      filename: 'index.html',
      template: './app/index.html',
      chunks: ['app', 'card'] 
    }),
    new HtmlWebpackPlugin({
        filename: 'client.html', 
        template: './app/client.html',
        chunks: ['client']
    }),
    new HtmlWebpackPlugin({
        filename: 'accountant.html', 
        template: './app/accountant.html',
        chunks: ['accountant']
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [
      { 
        test: /\.s?css$/, 
        use: [ 'style-loader', 'css-loader', 'sass-loader' ] 
      },
      {
        test: /\.(scss)$/,
        use: [{
          loader: 'style-loader', // inject CSS to page
        }, {
          loader: 'css-loader', // translates CSS into CommonJS modules
        }, {
          loader: 'postcss-loader', // Run post css actions
          options: {
            plugins: function () { // post css plugins, can be exported to postcss.config.js
              return [
                require('precss'),
                require('autoprefixer')
              ];
            }
          }
        }, {
          loader: 'sass-loader' // compiles Sass to CSS
        }]
      },     
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
        }
      }
    ]
  }
}

