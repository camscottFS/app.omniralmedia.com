const fs = require('fs');
const path = require('path');

module.exports = (app) => {
  const routesPath = path.join(__dirname);

  // Recursively read all files in the routes directory
  const walk = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
      const fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        // Recurse into subdirectory
        walk(fullPath);
      } else if (file.endsWith('.js') && file !== 'index.js') {
        // Require the route file
        const route = require(fullPath);

        if (typeof route === 'function' || typeof route === 'object' && typeof route.router === 'function') {
          // Construct route path based on directory structure
          const routePath = '/' + path.relative(__dirname, path.dirname(fullPath)).replace(/\\/g, '/');

          // Use router if route exports a middleware function
          if (typeof route === 'function') {
            app.use('/api' + routePath, route);
          } else if (typeof route.router === 'function') {
            app.use('/api' + routePath, route.router);
          }
        }
      }
    });
  };

  walk(routesPath);
};
