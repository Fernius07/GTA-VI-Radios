import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Serves local MP3 files from ./local-audio at /audio/<file>.mp3 during dev/preview
 * with full HTTP Range (206 Partial Content) support for instant seeking across large files,
 * while keeping the 7.3 GB audio folder outside public/ so production builds stay tiny.
 */
function localAudioPlugin(): Plugin {
  const audioDir = path.resolve(__dirname, 'local-audio');

  const serveAudio: import('connect').NextHandleFunction = (req, res, next) => {
    if (!req.url || !req.url.startsWith('/audio/')) return next();

    const fileName = decodeURIComponent(req.url.replace(/^\/audio\//, '').split('?')[0]);
    if (!fileName || fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
      res.statusCode = 400;
      res.end('Bad request');
      return;
    }

    const filePath = path.join(audioDir, fileName);
    if (!fs.existsSync(filePath)) {
      return next();
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    if (range) {
      const match = /bytes=(\d*)-(\d*)/.exec(range);
      if (!match) {
        res.statusCode = 416;
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        res.end();
        return;
      }
      const start = match[1] ? parseInt(match[1], 10) : 0;
      const end = match[2] ? Math.min(parseInt(match[2], 10), fileSize - 1) : fileSize - 1;

      if (start >= fileSize || start > end) {
        res.statusCode = 416;
        res.setHeader('Content-Range', `bytes */${fileSize}`);
        res.end();
        return;
      }

      res.statusCode = 206;
      res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
      res.setHeader('Content-Length', String(end - start + 1));

      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      fs.createReadStream(filePath, { start, end }).pipe(res);
      return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Length', String(fileSize));
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    fs.createReadStream(filePath).pipe(res);
  };

  return {
    name: 'local-audio-range-server',
    configureServer(server) {
      server.middlewares.use(serveAudio);
    },
    configurePreviewServer(server) {
      server.middlewares.use(serveAudio);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localAudioPlugin()],
  server: {
    port: 5173,
    strictPort: false,
  },
});
