import compression from 'compression';
import history from 'connect-history-api-fallback';
import cors from 'cors';
import express from 'express';
import favicon from 'serve-favicon';
import path from 'path';

const app = express();
const distPath = path.resolve('dist');
const listenPort = 7000;

app
  .use(compression())
  .use(cors())
  .use(favicon(path.join(distPath, 'favicon.ico')))
  .use(history())
  .use(express.static(distPath))
  .listen(listenPort, () => {
    console.log('Server started, press CTRL+C to exit.');
    console.log('Listening on port', listenPort);
  });
