import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  server: {
    port: 5173
  },
  plugins: [
    {
      name: 'serve-aurum-website',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0];
          if (url === '/aurum-website' || url === '/aurum-website/') {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const htmlPath = path.resolve(__dirname, 'aurum-website/index.html');
            const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
            res.end(htmlContent);
            return;
          }
          next();
        });
      }
    }
  ]
});
