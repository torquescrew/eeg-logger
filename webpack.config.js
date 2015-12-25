module.exports = {
   entry: './client/main.tsx',
   output: {
      filename: './public/bundle.js'
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
   "exclude": [
      "node_modules"
   ]
};