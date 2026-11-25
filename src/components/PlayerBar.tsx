import {
  Heart,
  Loader2,
  Pause,
  Play,
  Radio,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { RadioStation } from '../data/stations';
import { formatBroadcastTime } from '../lib/radioEngine';
import { StationArtwork } from './StationArtwork';

interface PlayerBarProps {
  station: RadioStation;
  isPlaying: boolean;
  isBuffering: boolean;
  isFavorite: boolean;
  livePosition: number;
  effectiveDuration: number;
  volume: number;
  isMuted: boolean;
  fmStaticEnabled: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onRandom: () => void;
  onToggleFavorite: () => void;
  onChangeVolume: (v: number) => void;
  onToggleMute: () => void;
  onToggleFmStatic: () => void;
}

export function PlayerBar({
  station,
  isPlaying,
  isBuffering,
  isFavorite,
  livePosition,
  effectiveDuration,
  volume,
  isMuted,
  fmStaticEnabled,
  onTogglePlay,
  onPrev,
  onNext,
  onRandom,
  onToggleFavorite,
  onChangeVolume,
  onToggleMute,
  onToggleFmStatic,
}: PlayerBarProps) {
  const progressPct =
    effectiveDuration > 0 ? Math.min(100, (livePosition / effectiveDuration) * 100) : 0;

  const displayVol = isMuted ? 0 : volume;
  const VolumeIcon =
    displayVol === 0 ? VolumeX : displayVol < 0.5 ? Volume1 : Volume2;

  return (
    <footer className="z-30 shrink-0 border-t border-white/[0.08] bg-[#0b0b0e]/95 px-3 py-2.5 backdrop-blur-xl sm:px-5">
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 items-center gap-3 md:grid-cols-[minmax(220px,1fr)_minmax(300px,1.5fr)_minmax(200px,1fr)]">
        {/* Left: Active Station Identity */}
        <div className="flex items-center gap-3 min-w-0">
          <StationArtwork
            station={station}
            size="sm"
            isPlaying={isPlaying}
            className="shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-bold text-white">
                {station.name}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold text-zinc-300">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-rose-500'
                  }`}
                />
                LIVE
              </span>
            </div>
            <p className="truncate text-xs text-zinc-400">
              {station.frequency} · {station.styles.slice(0, 2).join(' · ')}
            </p>
          </div>
          <button
            onClick={onToggleFavorite}
            className={`rounded-full p-2 transition ${
              isFavorite ? 'text-[#1ed760]' : 'text-zinc-400 hover:text-white'
            }`}
            aria-label={isFavorite ? 'Quitar de favoritas' : 'Guardar en favoritas'}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-[#1ed760]' : ''}`} />
          </button>
        </div>

        {/* Center: Controls + Live Broadcast Progress */}
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-4">
            <button
              onClick={onRandom}
              className="text-zinc-400 transition hover:text-white"
              title="Emisora aleatoria (R)"
              aria-label="Emisora aleatoria"
            >
              <Shuffle className="h-4 w-4" />
            </button>

            <button
              onClick={onPrev}
              className="text-zinc-300 transition hover:text-white"
              title="Emisora anterior (←)"
              aria-label="Emisora anterior"
            >
              <SkipBack className="h-5 w-5 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 active:scale-95"
              title="Reproducir / Pausar (Espacio)"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isBuffering ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-5 w-5 fill-black" />
              ) : (
                <Play className="h-5 w-5 fill-black ml-0.5" />
              )}
            </button>

            <button
              onClick={onNext}
              className="text-zinc-300 transition hover:text-white"
              title="Siguiente emisora (→)"
              aria-label="Siguiente emisora"
            >
              <SkipForward className="h-5 w-5 fill-current" />
            </button>

            <button
              onClick={onToggleFmStatic}
              className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                fmStaticEnabled
                  ? 'bg-[#1ed760]/15 text-[#1ed760]'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
              title="Efecto estática FM al cambiar de emisora"
            >
              <Radio className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">FM</span>
            </button>
          </div>

          {/* Live Broadcast Progress (read-only real-time sync bar) */}
          <div className="flex w-full max-w-lg items-center gap-2.5 text-[11px] font-mono text-zinc-400">
            <span className="w-14 text-right tabular-nums text-zinc-300">
              {formatBroadcastTime(livePosition)}
            </span>
            <div
              className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/15"
              title="Emisión continua en directo sincronizada con tu sesión"
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#1ed760] to-[#4ade80] transition-[width] duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="w-14 tabular-nums">
              {formatBroadcastTime(effectiveDuration)}
            </span>
          </div>
        </div>

        {/* Right: Volume & Live Sync Status */}
        <div className="hidden md:flex items-center justify-end gap-3">
          <div className="flex items-center gap-2 w-36">
            <button
              onClick={onToggleMute}
              className="text-zinc-400 transition hover:text-white"
              title="Silenciar (M)"
              aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              <VolumeIcon className="h-4 w-4" />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={displayVol}
              onChange={(e) => onChangeVolume(parseFloat(e.target.value))}
              className="spotify-slider h-1 flex-1 rounded-full"
              style={{
                background: `linear-gradient(to right, #1ed760 0%, #1ed760 ${displayVol * 100}%, rgba(255,255,255,0.18) ${displayVol * 100}%, rgba(255,255,255,0.18) 100%)`,
              }}
              aria-label="Volumen"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
