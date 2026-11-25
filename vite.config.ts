import fs from 'node:fs';
import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import JavaScriptObfuscator from 'javascript-obfuscator';

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

/**
 * Obfuscates built JS chunks in production builds to deter casual inspection in DevTools.
 */
function productionObfuscatorPlugin(): Plugin {
  return {
    name: 'production-js-obfuscator',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type === 'chunk' && item.fileName.endsWith('.js')) {
          const result = JavaScriptObfuscator.obfuscate(item.code, {
            compact: true,
            identifierNamesGenerator: 'hexadecimal',
            renameGlobals: false,
            rotateStringArray: true,
            shuffleStringArray: true,
            splitStrings: true,
            splitStringsChunkLength: 8,
            stringArray: true,
            stringArrayEncoding: ['base64'],
            stringArrayIndexShift: true,
            stringArrayThreshold: 0.85,
            unicodeEscapeSequence: false,
            controlFlowFlattening: false,
            deadCodeInjection: false,
            selfDefending: false,
            debugProtection: false,
            disableConsoleOutput: true,
          });
          item.code = result.getObfuscatedCode();
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localAudioPlugin(), productionObfuscatorPlugin()],
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  },
  build: {
    sourcemap: false,
    minify: 'esbuild',
  },
  server: {
    port: 5173,
    strictPort: false,
  },
});
