module.exports = {
   entry: './client/main.tsx',
   output: {
      filename: './public/scripts/bundle.js'
   },
   resolve: {
      extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
   },
   module: {
      loaders: [
         // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
         { test: /\.tsx?$/, loader: 'ts-loader' }
      ]
   },
   devtool: 'source-map',
   "exclude": [
      "node_modules",
      "public",
      "server",
      "app-state"
   ]
};