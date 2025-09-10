import express, { Request, Response } from 'express';
import { join } from "path";
import {
  existsSync,
} from 'fs';
import { isDevelop } from './config';



export async function createServer() {
  const server = express();
  server.use(express.json({ limit: '150mb' }));
  if (isDevelop) {
    const webpack = require('webpack');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware')
    const webpackConfig = require('../renderer/webpack.config.js');
    const compiler = webpack(webpackConfig);
    server.use(webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
    }));
    server.use(webpackHotMiddleware(compiler));
    server.get('*', (_req: Request, res: Response) => {
      res.sendFile(join(__dirname, '../renderer/index.html'));
    });
  } else {
    const staticPath = join(__dirname, '../renderer/out');
    server.use('/_next', express.static(join(staticPath, '_next')));
    server.use(express.static(staticPath));
    server.get('*', (req: Request, res: Response) => {
      const filePath = join(staticPath, req.url === '/' ? 'index.html' : req.url);
      console.log('Requested file path:', filePath);
      if (existsSync(filePath)) {
        res.sendFile(filePath);
      } else {
        console.log('File not found, serving index.html');
        res.sendFile(join(staticPath, 'index.html'));
      }
    });
  }
  return server;
}