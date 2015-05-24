# Just YouTube Comments.

## (Mostly Just The Comments About *The Eye*.)

Incredibly stupid app built with great tools: [browserify](http://browserify.org), [autoprefixer](https://github.com/postcss/autoprefixer), [concurrently](https://www.npmjs.com/package/concurrently), and [babel](http://babeljs.io).

> he has one eye. ILLUMINATI CONFIRMED.

## Usage:

`npm install` - fetch dependencies listed in `package.json.dependencies`.

`npm run start` - starts the app in "developer mode". automatically recompiles script and style bundles. In a production environment (e.g. `NODE_ENV=production npm run start`), this command _just_ starts the webserver for the app.

`npm run bundle` - alias for `npm run bundle:scripts && npm run bundle:styles`. generates the `bundle.js` and `bundle.css` that the app consumes. runs automatically at `postinstall` step, which means it runs automatically after deployment to Heroku.
