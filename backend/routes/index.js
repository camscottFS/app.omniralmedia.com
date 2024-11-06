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
        // Mount the route
        if (typeof route === 'function' || typeof route === 'object') {
          // Use the route's relative path from the routes directory
          const routePath = '/' + path.relative(__dirname, path.dirname(fullPath)).replace(/\\/g, '/');
          app.use('/api' + routePath, route);
        }
      }
    });
  };

  walk(routesPath);
};
