import type { RadioStation } from '../data/stations';

const artworkCache = new Map<string, string>();
const inFlightCache = new Map<string, Promise<string>>();

function extractHexColors(cssBg: string, fallback: string): [string, string] {
  const matches = cssBg.match(/#[0-9a-fA-F]{3,8}/g);
  if (!matches || matches.length === 0) return [fallback, '#09090b'];
  if (matches.length === 1) return [matches[0], matches[0]];
  return [matches[0], matches[1]];
}

/**
 * Renders an opaque 512x512 PNG data URL for each station cover so iOS Lock Screen,
 * Apple CarPlay, and Bluetooth car stereos always display the artwork reliably
 * (many mobile/car media receivers reject .webp or transparent logos).
 */
export function getStationLockscreenArtwork(station: RadioStation): Promise<string> {
  const cached = artworkCache.get(station.id);
  if (cached) return Promise.resolve(cached);

  const pending = inFlightCache.get(station.id);
  if (pending) return pending;

  const fallbackUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${station.cover}`
      : station.cover;

  const promise = new Promise<string>((resolve) => {
    if (typeof document === 'undefined') {
      resolve(fallbackUrl);
      return;
    }

    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(fallbackUrl);
      return;
    }

    const [c1, c2] = extractHexColors(station.cardBg, station.accentColor || '#18181b');
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        if (station.fullBleed) {
          // Cover crop centered to fill 512x512
          const scale = Math.max(size / img.width, size / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const dx = (size - drawW) / 2;
          const dy = (size - drawH) / 2;
          ctx.drawImage(img, dx, dy, drawW, drawH);
        } else {
          // Centered logo with ~16% breathing padding
          const maxBox = size * 0.68;
          const scale = Math.min(maxBox / img.width, maxBox / img.height);
          const drawW = img.width * scale;
          const drawH = img.height * scale;
          const dx = (size - drawW) / 2;
          const dy = (size - drawH) / 2;
          ctx.shadowColor = 'rgba(0, 0, 0, 0.35)';
          ctx.shadowBlur = 18;
          ctx.shadowOffsetY = 6;
          ctx.drawImage(img, dx, dy, drawW, drawH);
        }

        const pngDataUrl = canvas.toDataURL('image/png');
        artworkCache.set(station.id, pngDataUrl);
        resolve(pngDataUrl);
      } catch {
        resolve(fallbackUrl);
      }
    };
    img.onerror = () => resolve(fallbackUrl);
    img.src = station.cover;
  }).finally(() => {
    inFlightCache.delete(station.id);
  });

  inFlightCache.set(station.id, promise);
  return promise;
}
