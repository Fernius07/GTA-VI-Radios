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
import { StationArtwork } from './StationArtwork';

interface PlayerBarProps {
  station: RadioStation;
  isPlaying: boolean;
  isBuffering: boolean;
  isFavorite: boolean;
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
  const displayVol = isMuted ? 0 : volume;
  const VolumeIcon =
    displayVol === 0 ? VolumeX : displayVol < 0.5 ? Volume1 : Volume2;

  return (
    <footer className="z-30 shrink-0">
      {/* Mobile Mini-Player (< md) */}
      <div
        className="relative overflow-hidden border-t border-white/[0.08] px-3 py-2 backdrop-blur-xl md:hidden"
        style={{
          background: `linear-gradient(90deg, ${station.accentColor}28 0%, rgba(16,16,20,0.97) 55%, rgba(11,11,14,0.98) 100%)`,
        }}
      >
        <div className="flex items-center justify-between gap-2.5">
          {/* Left: Cover + Title + Frequency */}
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <StationArtwork
              station={station}
              size="xs"
              isPlaying={isPlaying}
              className="shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-white leading-tight">
                {station.name}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-zinc-300">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-zinc-500'
                  }`}
                />
                <span className="truncate">
                  {isPlaying ? 'En directo' : 'En pausa'} · {station.frequency}
                </span>
              </p>
            </div>
          </div>

          {/* Right: Compact Prev / Next / Play */}
          <div className="flex shrink-0 items-center gap-1">
            <button
              onClick={onPrev}
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 active:bg-white/10 active:text-white touch-manipulation"
              aria-label="Emisora anterior"
            >
              <SkipBack className="h-4 w-4 fill-current" />
            </button>

            <button
              onClick={onNext}
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-300 active:bg-white/10 active:text-white touch-manipulation"
              aria-label="Siguiente emisora"
            >
              <SkipForward className="h-4 w-4 fill-current" />
            </button>

            <button
              onClick={onTogglePlay}
              className="ml-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-md transition active:scale-95 touch-manipulation"
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
            >
              {isBuffering ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4 fill-black" />
              ) : (
                <Play className="h-4 w-4 fill-black ml-0.5" />
              )}
            </button>
          </div>
        </div>

        {/* Thin 2px glowing live accent bar along bottom edge */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-white/[0.06]">
          <div
            className={`h-full w-full transition-opacity duration-300 ${
              isPlaying ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              background: `linear-gradient(90deg, ${station.accentColor}, #1ed760)`,
            }}
          />
        </div>
      </div>

      {/* Full Desktop Player (>= md) */}
      <div className="hidden md:block border-t border-white/[0.08] bg-[#0b0b0e]/95 px-5 py-2.5 backdrop-blur-xl">
        <div className="mx-auto grid max-w-[1800px] grid-cols-[minmax(220px,1fr)_minmax(300px,1.5fr)_minmax(200px,1fr)] items-center gap-3">
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
                <span className="inline-flex items-center gap-1 rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] font-bold text-zinc-300">
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

          {/* Center: Controls + Live Broadcast Signal Status */}
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
                <span>FM</span>
              </button>
            </div>

            <div className="flex w-full max-w-md items-center gap-2.5 text-[11px] font-medium text-zinc-400">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-300">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    isPlaying ? 'bg-[#1ed760] animate-pulse' : 'bg-zinc-500'
                  }`}
                />
                {isPlaying ? 'En directo' : 'En pausa'}
              </span>
              <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full w-full rounded-full transition-opacity duration-300 ${
                    isPlaying
                      ? 'bg-gradient-to-r from-[#1ed760]/40 via-[#1ed760] to-[#1ed760]/40 opacity-100'
                      : 'bg-white/25 opacity-40'
                  }`}
                />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                {station.frequency}
              </span>
            </div>
          </div>

          {/* Right: Volume */}
          <div className="flex items-center justify-end gap-3">
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
      </div>
    </footer>
  );
}
