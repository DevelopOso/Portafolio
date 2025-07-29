import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import mainServer from './src/main.server';
import {environment} from "./environments/environment";
import { version } from './package.json';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');

  const commonEngine = new CommonEngine();

  // Use built-in middleware for parsing JSON and URL-encoded data
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Endpoint para recibir logs del cliente
  server.post('/api/logs', (req, res) => {
    console.log('Log from client ', req.body.message);
    res.status(200).send();
  });

  server.get('/health', (req, res) => {
    res.status(200).send();
  });

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    console.log('Request Info:', {
      protocol,
      originalUrl,
      baseUrl,
      headers
    });

    commonEngine
      .render({
        bootstrap: mainServer,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = environment.PORT || '4000';

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server ${version} ${environment.name} listening on http://localhost:${port}`);
  });
}

run();
